const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

// Existing public endpoint
const createContact = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, message, is_read)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id, name, email, message, is_read, created_at`,
      [name.trim(), email.trim(), message.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message",
    });
  }
};

// Admin endpoints
const getAdminContacts = async (req, res) => {
  try {
    const { search, status, sort = "newest", page = 1, limit = 20 } = req.query;
    let query = "SELECT * FROM contacts WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(message) LIKE $${params.length})`;
    }

    if (status === "read") {
      query += " AND is_read = TRUE";
    } else if (status === "unread") {
      query += " AND is_read = FALSE";
    }

    if (sort === "oldest") {
      query += " ORDER BY created_at ASC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    params.push(parseInt(limit, 10));
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataQuery = `${query} LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
    const result = await pool.query(dataQuery, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM contacts WHERE 1=1";
    const countParams = [];
    if (search && search.trim()) {
      countParams.push(`%${search.trim().toLowerCase()}%`);
      countQuery += ` AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(message) LIKE $1)`;
    }
    if (status === "read") {
      countQuery += " AND is_read = TRUE";
    } else if (status === "unread") {
      countQuery += " AND is_read = FALSE";
    }
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(totalCount / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error("Get admin contacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
    });
  }
};

const toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    let result;
    if (is_read !== undefined) {
      result = await pool.query(
        `UPDATE contacts SET is_read = $1 WHERE id = $2 RETURNING *`,
        [Boolean(is_read), id]
      );
    } else {
      result = await pool.query(
        `UPDATE contacts SET is_read = NOT is_read WHERE id = $1 RETURNING *`,
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    return res.json({
      success: true,
      message: `Contact marked as ${result.rows[0].is_read ? "read" : "unread"}.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Toggle contact read status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact status.",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, name FROM contacts WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    const contactName = existing.rows[0].name;
    await pool.query("DELETE FROM contacts WHERE id = $1", [id]);
    await logActivity("DELETE_CONTACT", "CONTACT", id, `Deleted contact message from ${contactName}`, req);

    return res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact.",
    });
  }
};

module.exports = {
  createContact,
  getAdminContacts,
  toggleReadStatus,
  deleteContact,
};