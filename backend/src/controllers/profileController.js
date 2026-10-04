const pool = require("../config/db");
const { logActivity } = require("../utils/logger");

const getPublicProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, title, bio, about_intro, about_details, profile_image,
              location, email, phone, github_url, linkedin_url, twitter_url, website_url,
              available_for_work, is_visible, updated_at
       FROM portfolio_profile
       WHERE is_visible = TRUE
       ORDER BY id ASC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      // Fallback if visibility is toggled off or no row
      const fallback = await pool.query(
        `SELECT id, name, title, bio, about_intro, about_details, profile_image,
                location, email, phone, github_url, linkedin_url, twitter_url, website_url,
                available_for_work, is_visible, updated_at
         FROM portfolio_profile
         ORDER BY id ASC
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
    console.error("Get public profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio profile.",
    });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM portfolio_profile ORDER BY id ASC LIMIT 1`
    );

    if (result.rows.length === 0) {
      // Create a default if empty
      const inserted = await pool.query(
        `INSERT INTO portfolio_profile (name, title) VALUES ('Prasanta Gorai', 'Full Stack Developer') RETURNING *`
      );
      return res.json({
        success: true,
        data: inserted.rows[0],
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      about_intro,
      about_details,
      profile_image,
      location,
      email,
      phone,
      github_url,
      linkedin_url,
      twitter_url,
      website_url,
      available_for_work,
      is_visible,
    } = req.body;

    if (!name || !title) {
      return res.status(400).json({
        success: false,
        message: "Name and title are required.",
      });
    }

    // Check if profile exists
    const existing = await pool.query("SELECT id FROM portfolio_profile ORDER BY id ASC LIMIT 1");

    let result;
    if (existing.rows.length > 0) {
      const id = existing.rows[0].id;
      result = await pool.query(
        `UPDATE portfolio_profile
         SET name = $1, title = $2, bio = $3, about_intro = $4, about_details = $5,
             profile_image = $6, location = $7, email = $8, phone = $9,
             github_url = $10, linkedin_url = $11, twitter_url = $12, website_url = $13,
             available_for_work = $14, is_visible = $15, updated_at = NOW()
         WHERE id = $16
         RETURNING *`,
        [
          name.trim(),
          title.trim(),
          bio?.trim() || null,
          about_intro?.trim() || null,
          about_details?.trim() || null,
          profile_image?.trim() || null,
          location?.trim() || null,
          email?.trim() || null,
          phone?.trim() || null,
          github_url?.trim() || null,
          linkedin_url?.trim() || null,
          twitter_url?.trim() || null,
          website_url?.trim() || null,
          available_for_work !== undefined ? Boolean(available_for_work) : true,
          is_visible !== undefined ? Boolean(is_visible) : true,
          id,
        ]
      );
      await logActivity("UPDATE_PROFILE", "PROFILE", id, `Profile updated for ${name}`, req);
    } else {
      result = await pool.query(
        `INSERT INTO portfolio_profile (
          name, title, bio, about_intro, about_details, profile_image,
          location, email, phone, github_url, linkedin_url, twitter_url, website_url,
          available_for_work, is_visible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          name.trim(),
          title.trim(),
          bio?.trim() || null,
          about_intro?.trim() || null,
          about_details?.trim() || null,
          profile_image?.trim() || null,
          location?.trim() || null,
          email?.trim() || null,
          phone?.trim() || null,
          github_url?.trim() || null,
          linkedin_url?.trim() || null,
          twitter_url?.trim() || null,
          website_url?.trim() || null,
          available_for_work !== undefined ? Boolean(available_for_work) : true,
          is_visible !== undefined ? Boolean(is_visible) : true,
        ]
      );
      await logActivity("CREATE_PROFILE", "PROFILE", result.rows[0].id, `Profile created for ${name}`, req);
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

module.exports = {
  getPublicProfile,
  getAdminProfile,
  updateProfile,
};
