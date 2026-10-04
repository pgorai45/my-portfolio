const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

const getPublicExperience = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, company, position, location, start_date, end_date, currently_working, description, technologies, accent_color, display_order, is_visible
       FROM experience
       WHERE is_visible = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get public experience error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch experience records.",
    });
  }
};

const getAdminExperience = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM experience WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(company) LIKE $1 OR LOWER(position) LIKE $1)`;
    }

    query += " ORDER BY display_order ASC, id ASC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get admin experience error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch experience records.",
    });
  }
};

const createExperience = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      start_date,
      end_date,
      currently_working,
      description,
      technologies,
      accent_color,
      display_order,
      is_visible,
    } = req.body;

    if (!company || !position || !start_date) {
      return res.status(400).json({
        success: false,
        message: "Company, position, and start date are required.",
      });
    }

    let order = parseInt(display_order, 10);
    if (isNaN(order)) {
      const maxOrder = await pool.query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM experience");
      order = maxOrder.rows[0].next_order;
    }

    const tech = Array.isArray(technologies)
      ? technologies
      : typeof technologies === "string"
      ? technologies.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `INSERT INTO experience (
        company, position, location, start_date, end_date, currently_working, description, technologies, accent_color, display_order, is_visible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        company.trim(),
        position.trim(),
        location?.trim() || null,
        start_date.trim(),
        end_date?.trim() || null,
        currently_working !== undefined ? Boolean(currently_working) : false,
        description?.trim() || null,
        JSON.stringify(tech),
        accent_color || "purple",
        order,
        is_visible !== undefined ? Boolean(is_visible) : true,
      ]
    );

    await logActivity("CREATE_EXPERIENCE", "EXPERIENCE", result.rows[0].id, `Created experience: ${position} at ${company}`, req);

    return res.status(201).json({
      success: true,
      message: "Experience entry created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create experience error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create experience entry.",
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM experience WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience entry not found.",
      });
    }
    const curr = existing.rows[0];

    const {
      company,
      position,
      location,
      start_date,
      end_date,
      currently_working,
      description,
      technologies,
      accent_color,
      display_order,
      is_visible,
    } = req.body;

    const finalCompany = company !== undefined ? company.trim() : curr.company;
    const finalPos = position !== undefined ? position.trim() : curr.position;
    const finalLoc = location !== undefined ? (location ? location.trim() : null) : curr.location;
    const finalStart = start_date !== undefined ? start_date.trim() : curr.start_date;
    const finalEnd = end_date !== undefined ? (end_date ? end_date.trim() : null) : curr.end_date;
    const finalWorking = currently_working !== undefined ? Boolean(currently_working) : curr.currently_working;
    const finalDesc = description !== undefined ? (description ? description.trim() : null) : curr.description;
    const finalAccent = accent_color !== undefined ? accent_color : curr.accent_color;

    const finalTech = technologies !== undefined
      ? (Array.isArray(technologies) ? technologies : typeof technologies === "string" ? technologies.split(",").map((s) => s.trim()).filter(Boolean) : [])
      : (typeof curr.technologies === "string" ? JSON.parse(curr.technologies || "[]") : curr.technologies);

    const finalOrder = display_order !== undefined
      ? (isNaN(parseInt(display_order, 10)) ? curr.display_order : parseInt(display_order, 10))
      : curr.display_order;

    const finalVisible = is_visible !== undefined ? Boolean(is_visible) : curr.is_visible;

    const result = await pool.query(
      `UPDATE experience
       SET company = $1, position = $2, location = $3, start_date = $4, end_date = $5,
           currently_working = $6, description = $7, technologies = $8, accent_color = $9,
           display_order = $10, is_visible = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        finalCompany,
        finalPos,
        finalLoc,
        finalStart,
        finalEnd,
        finalWorking,
        finalDesc,
        JSON.stringify(finalTech),
        finalAccent || "purple",
        finalOrder,
        finalVisible,
        id,
      ]
    );

    await logActivity("UPDATE_EXPERIENCE", "EXPERIENCE", id, `Updated experience: ${finalPos} at ${finalCompany}`, req);

    return res.json({
      success: true,
      message: "Experience entry updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update experience error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update experience entry.",
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, position, company FROM experience WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Experience entry not found.",
      });
    }

    const label = `${existing.rows[0].position} (${existing.rows[0].company})`;
    await pool.query("DELETE FROM experience WHERE id = $1", [id]);
    await logActivity("DELETE_EXPERIENCE", "EXPERIENCE", id, `Deleted experience: ${label}`, req);

    return res.json({
      success: true,
      message: "Experience entry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete experience error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete experience entry.",
    });
  }
};

module.exports = {
  getPublicExperience,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};
