const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

const getPublicProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, title, category, short_description, description,
              image_url, technologies, github_url, live_demo_url, accent, preview_type,
              display_order, is_featured, is_published, created_at
       FROM projects
       WHERE is_published = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get public projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
};

const getAdminProjects = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = "SELECT * FROM projects WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    if (category && category !== "all") {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (status === "published") {
      query += " AND is_published = TRUE";
    } else if (status === "draft") {
      query += " AND is_published = FALSE";
    } else if (status === "featured") {
      query += " AND is_featured = TRUE";
    }

    query += " ORDER BY display_order ASC, id ASC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get admin projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      short_description,
      description,
      image_url,
      technologies,
      github_url,
      live_demo_url,
      accent,
      preview_type,
      display_order,
      is_featured,
      is_published,
    } = req.body;

    const rawDesc = description || req.body.full_description || short_description;

    if (!title || !rawDesc || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and description are required.",
      });
    }

    let order = parseInt(display_order, 10);
    if (isNaN(order)) {
      const maxOrder = await pool.query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM projects");
      order = maxOrder.rows[0].next_order;
    }

    const tech = Array.isArray(technologies)
      ? technologies
      : typeof technologies === "string"
      ? technologies.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const projectSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
      : title.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const descToUse = rawDesc.trim();
    const shortDescToUse = short_description?.trim() || (descToUse.length > 100 ? descToUse.slice(0, 100) + "..." : descToUse);

    const result = await pool.query(
      `INSERT INTO projects (
        slug, title, category, short_description, description, image_url,
        technologies, github_url, live_demo_url, accent, preview_type,
        display_order, is_featured, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        projectSlug,
        title.trim(),
        category.trim(),
        shortDescToUse,
        descToUse,
        image_url?.trim() || null,
        JSON.stringify(tech),
        github_url?.trim() || null,
        live_demo_url?.trim() || null,
        accent || "purple",
        preview_type || "assistant",
        order,
        is_featured !== undefined ? Boolean(is_featured) : false,
        is_published !== undefined ? Boolean(is_published) : true,
      ]
    );

    await logActivity("CREATE_PROJECT", "PROJECT", result.rows[0].id, `Created project: ${title}`, req);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }
    const curr = existing.rows[0];

    const {
      title,
      slug,
      category,
      short_description,
      description,
      image_url,
      technologies,
      github_url,
      live_demo_url,
      accent,
      preview_type,
      display_order,
      is_featured,
      is_published,
    } = req.body;

    const finalTitle = title !== undefined ? title.trim() : curr.title;
    const finalCategory = category !== undefined ? category.trim() : curr.category;
    const incomingDesc = description !== undefined ? description : req.body.full_description;
    const finalDesc = incomingDesc !== undefined ? (incomingDesc ? incomingDesc.trim() : curr.description) : curr.description;
    const finalShortDesc = short_description !== undefined ? (short_description ? short_description.trim() : null) : curr.short_description;
    const finalImg = image_url !== undefined ? (image_url ? image_url.trim() : null) : curr.image_url;
    const finalGithub = github_url !== undefined ? (github_url ? github_url.trim() : null) : curr.github_url;
    const finalDemo = live_demo_url !== undefined ? (live_demo_url ? live_demo_url.trim() : null) : curr.live_demo_url;
    const finalAccent = accent !== undefined ? accent : curr.accent;
    const finalPreview = preview_type !== undefined ? preview_type : curr.preview_type;
    const finalOrder = display_order !== undefined
      ? (isNaN(parseInt(display_order, 10)) ? curr.display_order : parseInt(display_order, 10))
      : curr.display_order;
    const finalFeatured = is_featured !== undefined ? Boolean(is_featured) : curr.is_featured;
    const finalPublished = is_published !== undefined ? Boolean(is_published) : curr.is_published;

    const finalSlug = slug !== undefined
      ? (slug ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") : curr.slug)
      : (title !== undefined ? title.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") : curr.slug);

    let tech = technologies !== undefined
      ? (Array.isArray(technologies) ? technologies : typeof technologies === "string" ? technologies.split(",").map((s) => s.trim()).filter(Boolean) : [])
      : (typeof curr.technologies === "string" ? JSON.parse(curr.technologies || "[]") : curr.technologies);

    const result = await pool.query(
      `UPDATE projects
       SET slug = $1, title = $2, category = $3, short_description = $4,
           description = $5, image_url = $6, technologies = $7, github_url = $8,
           live_demo_url = $9, accent = $10, preview_type = $11, display_order = $12,
           is_featured = $13, is_published = $14, updated_at = NOW()
       WHERE id = $15
       RETURNING *`,
      [
        finalSlug,
        finalTitle,
        finalCategory,
        finalShortDesc,
        finalDesc,
        finalImg,
        JSON.stringify(tech),
        finalGithub,
        finalDemo,
        finalAccent || "purple",
        finalPreview || "assistant",
        finalOrder,
        finalFeatured,
        finalPublished,
        id,
      ]
    );

    await logActivity("UPDATE_PROJECT", "PROJECT", id, `Updated project: ${finalTitle}`, req);

    return res.json({
      success: true,
      message: "Project updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, title FROM projects WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const title = existing.rows[0].title;
    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    await logActivity("DELETE_PROJECT", "PROJECT", id, `Deleted project: ${title}`, req);

    return res.json({
      success: true,
      message: `Project '${title}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
};

const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE projects
       SET is_published = NOT is_published, updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, is_published`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const status = result.rows[0].is_published ? "published" : "unpublished";
    await logActivity("TOGGLE_PUBLISH", "PROJECT", id, `Project '${result.rows[0].title}' is now ${status}`, req);

    return res.json({
      success: true,
      message: `Project is now ${status}.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle publish error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project publish status.",
    });
  }
};

const toggleFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE projects
       SET is_featured = NOT is_featured, updated_at = NOW()
       WHERE id = $1
       RETURNING id, title, is_featured`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const status = result.rows[0].is_featured ? "featured" : "unfeatured";
    await logActivity("TOGGLE_FEATURE", "PROJECT", id, `Project '${result.rows[0].title}' is now ${status}`, req);

    return res.json({
      success: true,
      message: `Project is now ${status}.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle feature error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project feature status.",
    });
  }
};

module.exports = {
  getPublicProjects,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
  toggleFeature,
};
