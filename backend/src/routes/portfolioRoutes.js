const express = require("express");
const router = express.Router();

const { getPublicProfile } = require("../controllers/profileController");
const { getPublicSkills } = require("../controllers/skillsController");
const { getPublicEducation } = require("../controllers/educationController");
const { getPublicExperience } = require("../controllers/experienceController");
const { getPublicProjects } = require("../controllers/projectsController");
const { getPublicResume } = require("../controllers/resumeController");

router.get("/profile", getPublicProfile);
router.get("/skills", getPublicSkills);
router.get("/education", getPublicEducation);
router.get("/experience", getPublicExperience);
router.get("/projects", getPublicProjects);
router.get("/resume", getPublicResume);

module.exports = router;
