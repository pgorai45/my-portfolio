const pool = require("../config/db");

async function logActivity(action, entityType, entityId, details, req = null) {
  try {
    const ip = req ? (req.headers["x-forwarded-for"] || req.socket.remoteAddress || null) : null;
    await pool.query(
      `INSERT INTO activity_logs (action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [action, entityType, String(entityId || ""), details, ip]
    );
  } catch (error) {
    console.error("Failed to write activity log:", error.message);
  }
}

module.exports = {
  logActivity,
};
