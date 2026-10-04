const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

const getPublicEducation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, institution, degree, stream, start_year, end_year, grade, description, coursework, display_order, is_visible
       FROM education
       WHERE is_visible = TRUE
       ORDER BY display_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get public education error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch education records.",
    });
  }
};

const getAdminEducation = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM education WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(institution) LIKE $1 OR LOWER(degree) LIKE $1 OR LOWER(stream) LIKE $1)`;
    }

    query += " ORDER BY display_order ASC, id ASC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get admin education error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch education records.",
    });
  }
};

const createEducation = async (req, res) => {
  try {
    const {
      institution,
      degree,
      stream,
      start_year,
      end_year,
      grade,
      description,
      coursework,
      display_order,
      is_visible,
    } = req.body;

    if (!institution || !degree || !start_year) {
      return res.status(400).json({
        success: false,
        message: "Institution, degree, and start year are required.",
      });
    }

    let order = parseInt(display_order, 10);
    if (isNaN(order)) {
      const maxOrder = await pool.query("SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM education");
      order = maxOrder.rows[0].next_order;
    }

    const cw = Array.isArray(coursework)
      ? coursework
      : typeof coursework === "string"
      ? coursework.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `INSERT INTO education (
        institution, degree, stream, start_year, end_year, grade, description, coursework, display_order, is_visible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        institution.trim(),
        degree.trim(),
        stream?.trim() || null,
        start_year.trim(),
        end_year?.trim() || null,
        grade?.trim() || null,
        description?.trim() || null,
        JSON.stringify(cw),
        order,
        is_visible !== undefined ? Boolean(is_visible) : true,
      ]
    );

    await logActivity("CREATE_EDUCATION", "EDUCATION", result.rows[0].id, `Created education: ${degree} at ${institution}`, req);

    return res.status(201).json({
      success: true,
      message: "Education entry added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create education error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add education entry.",
    });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM education WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found.",
      });
    }
    const curr = existing.rows[0];

    const {
      institution,
      degree,
      stream,
      start_year,
      end_year,
      grade,
      description,
      coursework,
      display_order,
      is_visible,
    } = req.body;

    const finalInst = institution !== undefined ? institution.trim() : curr.institution;
    const finalDegree = degree !== undefined ? degree.trim() : curr.degree;
    const finalStream = stream !== undefined ? (stream ? stream.trim() : null) : curr.stream;
    const finalStart = start_year !== undefined ? start_year.trim() : curr.start_year;
    const finalEnd = end_year !== undefined ? (end_year ? end_year.trim() : null) : curr.end_year;
    const finalGrade = grade !== undefined ? (grade ? grade.trim() : null) : curr.grade;
    const finalDesc = description !== undefined ? (description ? description.trim() : null) : curr.description;
    const finalCw = coursework !== undefined
      ? (Array.isArray(coursework) ? coursework : typeof coursework === "string" ? coursework.split(",").map((s) => s.trim()).filter(Boolean) : [])
      : (typeof curr.coursework === "string" ? JSON.parse(curr.coursework || "[]") : curr.coursework);
    const finalOrder = display_order !== undefined
      ? (isNaN(parseInt(display_order, 10)) ? curr.display_order : parseInt(display_order, 10))
      : curr.display_order;
    const finalVisible = is_visible !== undefined ? Boolean(is_visible) : curr.is_visible;

    const result = await pool.query(
      `UPDATE education
       SET institution = $1, degree = $2, stream = $3, start_year = $4, end_year = $5,
           grade = $6, description = $7, coursework = $8, display_order = $9, is_visible = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        finalInst,
        finalDegree,
        finalStream,
        finalStart,
        finalEnd,
        finalGrade,
        finalDesc,
        JSON.stringify(finalCw),
        finalOrder,
        finalVisible,
        id,
      ]
    );

    await logActivity("UPDATE_EDUCATION", "EDUCATION", id, `Updated education: ${finalDegree}`, req);

    return res.json({
      success: true,
      message: "Education entry updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update education error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update education entry.",
    });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, degree, institution FROM education WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education entry not found.",
      });
    }

    const label = `${existing.rows[0].degree} (${existing.rows[0].institution})`;
    await pool.query("DELETE FROM education WHERE id = $1", [id]);
    await logActivity("DELETE_EDUCATION", "EDUCATION", id, `Deleted education: ${label}`, req);

    return res.json({
      success: true,
      message: "Education entry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete education error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete education entry.",
    });
  }
};

module.exports = {
  getPublicEducation,
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};
