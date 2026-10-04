const express = require("express");
const router = express.Router();
const { verifyAdminToken } = require("../middleware/auth");
const {
  uploadResumeMiddleware,
  uploadImageMiddleware,
  validateUploadedFile,
} = require("../utils/fileUpload");

const {
  loginSchema,
  updateSettingsSchema,
  validateBody,
} = require("../validators/requestSchemas");

// Controllers
const {
  login,
  logout,
  getMe,
  updateSettings,
} = require("../controllers/authController");
const { getDashboardStats } = require("../controllers/statsController");
const {
  getAdminProfile,
  updateProfile,
} = require("../controllers/profileController");
const {
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} = require("../controllers/skillsController");
const {
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const {
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
  toggleFeature,
} = require("../controllers/projectsController");
const {
  getAdminResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
} = require("../controllers/resumeController");
const {
  getAdminContacts,
  toggleReadStatus,
  deleteContact,
} = require("../controllers/contactController");
const {
  getAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post(
  "/login",
  validateBody(loginSchema),
  login
);
router.post("/logout", verifyAdminToken, logout);
router.get("/me", verifyAdminToken, getMe);
router.put(
  "/settings",
  verifyAdminToken,
  validateBody(updateSettingsSchema),
  updateSettings,
);

// ==========================================
// DASHBOARD
// ==========================================
router.get("/stats", verifyAdminToken, getDashboardStats);

// ==========================================
// PROFILE MANAGEMENT
// ==========================================
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/profile", verifyAdminToken, updateProfile);

// ==========================================
// SKILLS MANAGEMENT
// ==========================================
router.get("/skills", verifyAdminToken, getAdminSkills);
router.post("/skills", verifyAdminToken, createSkill);
router.patch("/skills/reorder", verifyAdminToken, reorderSkills);
router.put("/skills/:id", verifyAdminToken, updateSkill);
router.delete("/skills/:id", verifyAdminToken, deleteSkill);

// ==========================================
// EDUCATION MANAGEMENT
// ==========================================
router.get("/education", verifyAdminToken, getAdminEducation);
router.post("/education", verifyAdminToken, createEducation);
router.put("/education/:id", verifyAdminToken, updateEducation);
router.delete("/education/:id", verifyAdminToken, deleteEducation);

// ==========================================
// EXPERIENCE MANAGEMENT
// ==========================================
router.get("/experience", verifyAdminToken, getAdminExperience);
router.post("/experience", verifyAdminToken, createExperience);
router.put("/experience/:id", verifyAdminToken, updateExperience);
router.delete("/experience/:id", verifyAdminToken, deleteExperience);

// ==========================================
// PROJECTS MANAGEMENT
// ==========================================
router.get("/projects", verifyAdminToken, getAdminProjects);
router.post("/projects", verifyAdminToken, createProject);
router.put("/projects/:id", verifyAdminToken, updateProject);
router.delete("/projects/:id", verifyAdminToken, deleteProject);
router.patch("/projects/:id/publish", verifyAdminToken, togglePublish);
router.patch("/projects/:id/feature", verifyAdminToken, toggleFeature);

// ==========================================
// RESUME MANAGEMENT
// ==========================================
router.get("/resumes", verifyAdminToken, getAdminResumes);
router.post(
  "/resume",
  verifyAdminToken,
  uploadResumeMiddleware.single("resume"),
  validateUploadedFile,
  uploadResume,
);
router.put("/resume/:id/active", verifyAdminToken, setActiveResume);
router.delete("/resume/:id", verifyAdminToken, deleteResume);

// ==========================================
// CONTACTS MANAGEMENT
// ==========================================
router.get("/contacts", verifyAdminToken, getAdminContacts);
router.patch("/contacts/:id/read", verifyAdminToken, toggleReadStatus);
router.delete("/contacts/:id", verifyAdminToken, deleteContact);

// ==========================================
// APPOINTMENTS MANAGEMENT
// ==========================================
router.get("/appointments", verifyAdminToken, getAdminAppointments);
router.patch(
  "/appointments/:id/status",
  verifyAdminToken,
  updateAppointmentStatus,
);
router.delete("/appointments/:id", verifyAdminToken, deleteAppointment);

// ==========================================
// IMAGE UPLOAD (FOR PROJECTS / PROFILE)
// ==========================================

router.post(
  "/upload/image",
  verifyAdminToken,
  uploadImageMiddleware.single("image"),
  validateUploadedFile,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const relativeUrl = `/uploads/projects/${req.file.filename}`;

    return res.json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: relativeUrl,
        fileName: req.file.filename,
      },
    });
  },
);

module.exports = router;
