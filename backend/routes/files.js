const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Helper function to sanitize filenames
const sanitizeFilename = (filename) => {
	// Remove any path components
	const basename = path.basename(filename);
	// Replace any non-alphanumeric characters (except dots and dashes) with underscores
	return basename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

// Configure multer for file upload
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		// Generate unique filename
		const uniqueSuffix = crypto.randomBytes(8).toString("hex");
		const sanitizedName = sanitizeFilename(file.originalname);
		const ext = path.extname(sanitizedName);
		const basename = path.basename(sanitizedName, ext);
		cb(null, `${basename}_${uniqueSuffix}${ext}`);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100 * 1024 * 1024, // 100MB limit
	},
});

// File upload route
router.post("/upload", upload.single("file"), fileController.uploadFile);

// File access and download routes
router.get("/group/:groupCode", fileController.getFilesByGroupCode);
router.get("/download/:groupCode/:fileId", fileController.downloadFile);
router.delete("/delete/:groupCode/:filename", fileController.deleteFile);

// User-specific routes
router.get("/user/:username", fileController.getFilesByUser);
router.get("/stats", fileController.getUserStats);

// Search route
router.get("/search", fileController.searchFiles);

module.exports = router;
