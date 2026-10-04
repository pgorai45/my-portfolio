const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { logActivity } = require("../utils/logger");
const DUMMY_PASSWORD_HASH =
  "$2b$10$7EqJtq98hPqEX7fNZaFWoO7h6Yq8KQYQhQJ6J0VfV8Q5w5w5w5w5w5";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await pool.query(
      "SELECT id, email, password_hash, username, role FROM admins WHERE LOWER(email) = $1",
      [cleanEmail],
    );

    const admin = result.rows[0];

    const passwordHash = admin?.password_hash || DUMMY_PASSWORD_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!admin || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      secret,
      { expiresIn: "7d" },
    );

    await logActivity(
      "ADMIN_LOGIN",
      "ADMIN",
      admin.id,
      `Admin ${admin.email} logged in`,
      req,
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          role: admin.role,
        },
      },
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
};

const logout = async (req, res) => {
  try {
    if (req.admin) {
      await logActivity(
        "ADMIN_LOGOUT",
        "ADMIN",
        req.admin.id,
        `Admin ${req.admin.email} logged out`,
        req,
      );
    }
    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: req.admin,
      admin: req.admin,
    });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { username, email, currentPassword, newPassword } = req.body;

    // Fetch existing admin
    const currentAdminResult = await pool.query(
      "SELECT id, email, password_hash, username, role FROM admins WHERE id = $1",
      [adminId],
    );

    if (currentAdminResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const currentAdmin = currentAdminResult.rows[0];

    // Check if updating password
    let updatedPasswordHash = currentAdmin.password_hash;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set a new password.",
        });
      }

      const isCurrentValid = await bcrypt.compare(
        currentPassword,
        currentAdmin.password_hash,
      );
      if (!isCurrentValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }
      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedEmail = email
      ? email.trim().toLowerCase()
      : currentAdmin.email;
    const updatedUsername = username ? username.trim() : currentAdmin.username;

    // Check if new email is taken by another admin
    if (updatedEmail !== currentAdmin.email) {
      const emailCheck = await pool.query(
        "SELECT id FROM admins WHERE LOWER(email) = $1 AND id != $2",
        [updatedEmail, adminId],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account.",
        });
      }
    }

    const updateResult = await pool.query(
      `UPDATE admins
       SET email = $1, username = $2, password_hash = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, username, role, updated_at`,
      [updatedEmail, updatedUsername, updatedPasswordHash, adminId],
    );

    await logActivity(
      "UPDATE_ADMIN_SETTINGS",
      "ADMIN",
      adminId,
      `Admin updated profile/settings`,
      req,
    );

    return res.json({
      success: true,
      message: "Admin settings updated successfully.",
      admin: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  updateSettings,
};
