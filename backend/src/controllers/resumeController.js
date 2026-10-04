const pool = require("../config/db");
const { logActivity } = require("../utils/logger");
const path = require("path");
const fs = require("fs");

const getPublicResume = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, file_name, file_path, file_size, mime_type, is_active, updated_at
       FROM resumes
       WHERE is_active = TRUE
       ORDER BY updated_at DESC, id DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      // Fallback to latest resume
      const fallback = await pool.query(
        `SELECT id, title, file_name, file_path, file_size, mime_type, is_active, updated_at
         FROM resumes
         ORDER BY id DESC
         LIMIT 1`
      );
      return res.json({
        success: true,
        data: fallback.rows[0] || null,
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get public resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active resume.",
    });
  }
};

const getAdminResumes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM resumes ORDER BY is_active DESC, created_at DESC`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get admin resumes error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
    });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded.",
      });
    }

    const { title, set_active } = req.body;
    const resumeTitle = title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, "");
    const shouldBeActive = set_active === "true" || set_active === true;

    const relativePath = `/uploads/resumes/${req.file.filename}`;

    const client = await pool.connect();
    let newResume;
    try {
      await client.query("BEGIN");

      // If setting as active, deactivate other resumes
      if (shouldBeActive) {
        await client.query("UPDATE resumes SET is_active = FALSE");
      }

      const insertRes = await client.query(
        `INSERT INTO resumes (title, file_name, file_path, file_size, mime_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          resumeTitle,
          req.file.filename,
          relativePath,
          req.file.size,
          req.file.mimetype || "application/pdf",
          shouldBeActive,
        ]
      );
      newResume = insertRes.rows[0];

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      // Remove uploaded file if DB insert fails
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      throw err;
    } finally {
      client.release();
    }

    await logActivity("UPLOAD_RESUME", "RESUME", newResume.id, `Uploaded new resume: ${resumeTitle}`, req);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: newResume,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });
  }
};

const setActiveResume = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    let updated;
    try {
      await client.query("BEGIN");
      await client.query("UPDATE resumes SET is_active = FALSE");
      const result = await client.query(
        `UPDATE resumes SET is_active = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }
      updated = result.rows[0];
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    await logActivity("SET_ACTIVE_RESUME", "RESUME", id, `Set resume '${updated.title}' as active`, req);

    return res.json({
      success: true,
      message: `Resume '${updated.title}' is now active.`,
      data: updated,
    });
  } catch (error) {
    console.error("Set active resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set active resume.",
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM resumes WHERE id = $1", [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resume = existing.rows[0];

    // Delete record from DB
    await pool.query("DELETE FROM resumes WHERE id = $1", [id]);

    // Delete file from disk if present
    if (resume.file_name) {
      const diskPath = path.resolve(__dirname, "../../uploads/resumes", resume.file_name);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch (e) {
          console.warn("Could not delete file from disk:", e.message);
        }
      }
    }

    // If deleted resume was active, set latest remaining resume active
    if (resume.is_active) {
      await pool.query(
        `UPDATE resumes SET is_active = TRUE
         WHERE id = (SELECT id FROM resumes ORDER BY created_at DESC LIMIT 1)`
      );
    }

    await logActivity("DELETE_RESUME", "RESUME", id, `Deleted resume: ${resume.title}`, req);

    return res.json({
      success: true,
      message: `Resume '${resume.title}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });
  }
};

module.exports = {
  getPublicResume,
  getAdminResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
};
