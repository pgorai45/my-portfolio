const { z } = require("zod");

// Contact form validation
const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must not exceed 255 characters"),

    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(5000, "Message must not exceed 5000 characters"),
  })
  .strict();

// Appointment validation
const appointmentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must not exceed 255 characters"),

    date: z.string().trim().min(1, "Date is required").max(20, "Invalid date"),

    time: z.string().trim().min(1, "Time is required").max(20, "Invalid time"),

    message: z
      .string()
      .trim()
      .max(2000, "Message must not exceed 2000 characters")
      .optional()
      .or(z.literal("")),
  })
  .strict();

// Admin login validation
const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must not exceed 255 characters"),

    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password is too long"),
  })
  .strict();



  const updateSettingsSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 characters")
      .max(100, "Username must not exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must not exceed 255 characters")
      .optional(),

    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(128, "Current password is too long")
      .optional(),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(128, "New password is too long")
      .regex(/[A-Z]/, "New password must contain an uppercase letter")
      .regex(/[a-z]/, "New password must contain a lowercase letter")
      .regex(/[0-9]/, "New password must contain a number")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain a special character",
      )
      .optional(),
  })
  .strict();

// Generic validation middleware
const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
};

module.exports = {
  contactSchema,
  appointmentSchema,
  loginSchema,
  updateSettingsSchema,
  validateBody,
};
