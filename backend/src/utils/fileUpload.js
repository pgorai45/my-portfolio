const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.resolve(__dirname, "../../uploads");
const resumeDir = path.join(uploadDir, "resumes");
const projectDir = path.join(uploadDir, "projects");

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

// Allowed actual file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_RESUME_TYPES = ["application/pdf"];

// Check actual file signature (magic bytes)
async function validateFileSignature(filePath, allowedTypes) {
  try {
    const { fileTypeFromFile } = await import("file-type");
    const detected = await fileTypeFromFile(filePath);

    if (!detected || !allowedTypes.includes(detected.mime)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("File signature validation error:", error);
    return false;
  }
}

// Storage for Resumes (PDF only)
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumeDir);
  },

  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(cleanName);
    const basename = path.basename(cleanName, ext);

    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

// Resume MIME + extension validation
const resumeFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype === "application/pdf" &&
    extension === ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for resumes."), false);
  }
};

const uploadResumeMiddleware = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

// Storage for Images (PNG, JPG, JPEG, WEBP)
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, projectDir);
  },

  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(cleanName);
    const basename = path.basename(cleanName, ext);

    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

// Image MIME + extension validation
const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
  const isExtensionAllowed = allowedExtensions.includes(extension);

  if (isMimeAllowed && isExtensionAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP image files are allowed."
      ),
      false
    );
  }
};

const uploadImageMiddleware = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

// Validate actual file content after Multer upload
async function validateUploadedFile(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    let allowedTypes;

    if (req.file.fieldname === "resume") {
      allowedTypes = ALLOWED_RESUME_TYPES;
    } else if (req.file.fieldname === "image") {
      allowedTypes = ALLOWED_IMAGE_TYPES;
    } else {
      return next();
    }

    const isValid = await validateFileSignature(
      req.file.path,
      allowedTypes
    );

    if (!isValid) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Invalid file content. The file type does not match its extension.",
      });
    }

    next();
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Uploaded file validation failed:", error);

    return res.status(400).json({
      success: false,
      message: "Unable to validate uploaded file.",
    });
  }
}

module.exports = {
  uploadResumeMiddleware,
  uploadImageMiddleware,
  validateUploadedFile,
  resumeDir,
  projectDir,
};