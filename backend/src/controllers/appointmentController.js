const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

// Existing public endpoint
const createAppointment = async (req, res) => {
  try {
    const { name, email, date, time, message } = req.body;

    if (!name || !email || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, email, date and time are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO appointments (name, email, date, time, message, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, name, email, date, time, message, status, created_at`,
      [
        name.trim(),
        email.trim(),
        date,
        time,
        message?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit appointment request",
    });
  }
};

// Admin endpoints
const getAdminAppointments = async (req, res) => {
  try {
    const { search, status, sort = "newest", page = 1, limit = 20 } = req.query;
    let query = "SELECT * FROM appointments WHERE 1=1";
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(COALESCE(message, '')) LIKE $${params.length})`;
    }

    if (status && status !== "all") {
      params.push(status.trim().toLowerCase());
      query += ` AND LOWER(status) = $${params.length}`;
    }

    if (sort === "oldest") {
      query += " ORDER BY date ASC, time ASC";
    } else {
      query += " ORDER BY date DESC, time DESC";
    }

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    params.push(parseInt(limit, 10));
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataQuery = `${query} LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
    const result = await pool.query(dataQuery, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM appointments WHERE 1=1";
    const countParams = [];
    if (search && search.trim()) {
      countParams.push(`%${search.trim().toLowerCase()}%`);
      countQuery += ` AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(COALESCE(message, '')) LIKE $1)`;
    }
    if (status && status !== "all") {
      countParams.push(status.trim().toLowerCase());
      countQuery += ` AND LOWER(status) = $${countParams.length}`;
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
    console.error("Get admin appointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status.toLowerCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const appt = result.rows[0];
    await logActivity("UPDATE_APPOINTMENT_STATUS", "APPOINTMENT", id, `Appointment for ${appt.name} updated to ${status}`, req);

    return res.json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: appt,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status.",
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT id, name FROM appointments WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const name = existing.rows[0].name;
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
    await logActivity("DELETE_APPOINTMENT", "APPOINTMENT", id, `Deleted appointment for ${name}`, req);

    return res.json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete appointment.",
    });
  }
};

module.exports = {
  createAppointment,
  getAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};