const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [
      projectsRes,
      skillsRes,
      educationRes,
      experienceRes,
      contactsRes,
      appointmentsRes,
      pendingApptRes,
      unreadContactsRes,
      recentContactsRes,
      recentAppointmentsRes,
      recentChangesRes,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM projects"),
      pool.query("SELECT COUNT(*) FROM skills"),
      pool.query("SELECT COUNT(*) FROM education"),
      pool.query("SELECT COUNT(*) FROM experience"),
      pool.query("SELECT COUNT(*) FROM contacts"),
      pool.query("SELECT COUNT(*) FROM appointments"),
      pool.query("SELECT COUNT(*) FROM appointments WHERE LOWER(status) = 'pending'"),
      pool.query("SELECT COUNT(*) FROM contacts WHERE is_read = FALSE"),
      pool.query("SELECT id, name, email, message, is_read, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"),
      pool.query("SELECT id, name, email, date, time, status, created_at FROM appointments ORDER BY date DESC, time DESC LIMIT 5"),
      pool.query("SELECT id, action, entity_type, entity_id, details, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 10"),
    ]);

    return res.json({
      success: true,
      data: {
        counts: {
          totalProjects: parseInt(projectsRes.rows[0].count, 10),
          totalSkills: parseInt(skillsRes.rows[0].count, 10),
          totalEducation: parseInt(educationRes.rows[0].count, 10),
          totalExperience: parseInt(experienceRes.rows[0].count, 10),
          totalContacts: parseInt(contactsRes.rows[0].count, 10),
          totalAppointments: parseInt(appointmentsRes.rows[0].count, 10),
          pendingAppointments: parseInt(pendingApptRes.rows[0].count, 10),
          unreadContacts: parseInt(unreadContactsRes.rows[0].count, 10),
        },
        recentContacts: recentContactsRes.rows,
        recentAppointments: recentAppointmentsRes.rows,
        recentChanges: recentChangesRes.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

module.exports = {
  getDashboardStats,
};
