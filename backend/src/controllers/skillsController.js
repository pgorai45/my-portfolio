const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

const getPublicSkills = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, category_label, proficiency_subtitle, percentage, display_order, is_visible
       FROM skills
       WHERE is_visible = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get public skills error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills.",
    });
  }
};

const getAdminSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM skills WHERE 1=1";
    const params = [];

    if (category && category !== "all") {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND LOWER(name) LIKE $${params.length}`;
    }

    query += " ORDER BY display_order ASC, id ASC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get admin skills error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin skills.",
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, category, category_label, proficiency_subtitle, percentage, display_order, is_visible } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required.",
      });
    }

    const pct = parseInt(percentage, 10);
    const validPct = isNaN(pct) ? 80 : Math.min(100, Math.max(0, pct));

    // Calculate max display order if not provided
    let order = parseInt(display_order, 10);
    if (isNaN(order)) {
      const maxOrderRes = await pool.query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM skills");
      order = maxOrderRes.rows[0].next_order;
    }

    const result = await pool.query(
      `INSERT INTO skills (name, category, category_label, proficiency_subtitle, percentage, display_order, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name.trim(),
        category.trim(),
        category_label?.trim() || category.trim(),
        proficiency_subtitle?.trim() || null,
        validPct,
        order,
        is_visible !== undefined ? Boolean(is_visible) : true,
      ]
    );

    await logActivity("CREATE_SKILL", "SKILL", result.rows[0].id, `Created skill: ${name}`, req);

    return res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create skill.",
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM skills WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }
    const curr = existing.rows[0];

    const { name, category, category_label, proficiency_subtitle, percentage, display_order, is_visible } = req.body;

    const finalName = name !== undefined ? name.trim() : curr.name;
    const finalCategory = category !== undefined ? category.trim() : curr.category;
    const finalLabel = category_label !== undefined ? (category_label ? category_label.trim() : finalCategory) : curr.category_label;
    const finalSub = proficiency_subtitle !== undefined ? (proficiency_subtitle ? proficiency_subtitle.trim() : null) : curr.proficiency_subtitle;
    const pct = percentage !== undefined ? parseInt(percentage, 10) : curr.percentage;
    const validPct = isNaN(pct) ? curr.percentage : Math.min(100, Math.max(0, pct));
    const order = display_order !== undefined ? parseInt(display_order, 10) : curr.display_order;
    const validOrder = isNaN(order) ? curr.display_order : order;
    const finalVisible = is_visible !== undefined ? Boolean(is_visible) : curr.is_visible;

    const result = await pool.query(
      `UPDATE skills
       SET name = $1, category = $2, category_label = $3, proficiency_subtitle = $4,
           percentage = $5, display_order = $6, is_visible = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        finalName,
        finalCategory,
        finalLabel,
        finalSub,
        validPct,
        validOrder,
        finalVisible,
        id,
      ]
    );

    await logActivity("UPDATE_SKILL", "SKILL", id, `Updated skill: ${finalName}`, req);

    return res.json({
      success: true,
      message: "Skill updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update skill.",
    });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, name FROM skills WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    const skillName = existing.rows[0].name;
    await pool.query("DELETE FROM skills WHERE id = $1", [id]);
    await logActivity("DELETE_SKILL", "SKILL", id, `Deleted skill: ${skillName}`, req);

    return res.json({
      success: true,
      message: `Skill '${skillName}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete skill.",
    });
  }
};

const reorderSkills = async (req, res) => {
  try {
    const { items } = req.body; // array of { id, display_order }
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items array is required for reordering.",
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const item of items) {
        await client.query(
          "UPDATE skills SET display_order = $1, updated_at = NOW() WHERE id = $2",
          [item.display_order, item.id]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    await logActivity("REORDER_SKILLS", "SKILL", "BULK", `Reordered ${items.length} skills`, req);

    return res.json({
      success: true,
      message: "Skills reordered successfully.",
    });
  } catch (error) {
    console.error("Reorder skills error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder skills.",
    });
  }
};

module.exports = {
  getPublicSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
};
