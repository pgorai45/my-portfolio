const express = require("express");
const {
  createAppointment,
} = require("../controllers/appointmentController");
const {
  appointmentSchema,
  validateBody,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post(
  "/",
  validateBody(appointmentSchema),
  createAppointment
);

module.exports = router;