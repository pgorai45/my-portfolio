const express = require("express");
const { createContact } = require("../controllers/contactController");
const {
  contactSchema,
  validateBody,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post(
  "/",
  validateBody(contactSchema),
  createContact
);

module.exports = router;