const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const crypto = require("crypto");

// Helper function to calculate file hash
async function calculateFileHash(filePath) {
	const fileBuffer = await fsPromises.readFile(filePath);
	return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

// Helper function to check if files are identical
async function areFilesIdentical(filePath1, filePath2) {
	const hash1 = await calculateFileHash(filePath1);
	const hash2 = await calculateFileHash(filePath2);
	return hash1 === hash2;
}

exports.uploadFile = async (req, res) => {
	try {
		const { username, groupCode } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		if (!username || !username.trim()) {
			return res.status(400).json({ error: "Username is required" });
		}

		const trimmedUsername = username.trim();

		console.log("Upload request:", {
			username: trimmedUsername,
			filename: file.originalname,
			groupCode,
		});

		// Use provided group code or generate a new one
		const newGroupCode =
			groupCode || crypto.randomBytes(4).toString("hex").toUpperCase();

		// Check for duplicate files
		const potentialDuplicates = await File.find({
			originalName: file.originalname,
			size: file.size,
			status: "active",
		});

		// Check if any of the potential duplicates are actually identical
		for (const duplicate of potentialDuplicates) {
			if (await areFilesIdentical(file.path, duplicate.filePath)) {
				// File is identical - add new group code if it's not already present
				if (!duplicate.groupCodes.includes(newGroupCode)) {
					duplicate.groupCodes.push(newGroupCode);
				}

				// Add new uploader information
				duplicate.uploaders.push({
					username: trimmedUsername,
					groupCode: newGroupCode,
					uploadDate: new Date(),
				});

				// Update expiry date to 21 days from now
				const newExpiryDate = new Date();
				newExpiryDate.setDate(newExpiryDate.getDate() + 21);
				duplicate.expiryDate = newExpiryDate;

				await duplicate.save();

				// Delete the temporary uploaded file
				await fsPromises.unlink(file.path);

				return res.status(201).json({
					message: "File reference created successfully",
					file: {
						id: duplicate._id,
						name: duplicate.originalName,
						filename: duplicate.filename,
						size: duplicate.size,
						groupCode: newGroupCode,
						uploadDate: new Date(),
						expiryDate: newExpiryDate,
						mimetype: duplicate.mimetype,
						username: trimmedUsername,
					},
				});
			}
		}

		// If no duplicate found, create new file record
		const newFile = new File({
			filename: file.filename,
			originalName: file.originalname,
			size: file.size,
			mimetype: file.mimetype,
			username: trimmedUsername,
			uploaders: [
				{
					username: trimmedUsername,
					groupCode: newGroupCode,
					uploadDate: new Date(),
				},
			],
			filePath: file.path,
			groupCodes: [newGroupCode],
			status: "active",
		});

		await newFile.save();
		console.log("New file saved:", {
			id: newFile._id,
			name: newFile.originalName,
			filename: newFile.filename,
			groupCodes: newFile.groupCodes,
			username: trimmedUsername,
		});

		res.status(201).json({
			message: "File uploaded successfully",
			file: {
				id: newFile._id,
				name: newFile.originalName,
				filename: newFile.filename,
				size: newFile.size,
				groupCode: newGroupCode,
				uploadDate: newFile.uploadDate,
				expiryDate: newFile.expiryDate,
				mimetype: newFile.mimetype,
				username: trimmedUsername,
			},
		});
	} catch (error) {
		console.error("Upload error:", error);
		// Clean up temporary file if it exists
		if (req.file) {
			await fsPromises.unlink(req.file.path).catch(console.error);
		}
		res.status(500).json({ error: error.message });
	}
};

exports.getFilesByGroupCode = async (req, res) => {
	try {
		const { groupCode } = req.params;
		console.log("Searching for files with group code:", groupCode);

		const files = await File.find({
			groupCodes: groupCode.toUpperCase(),
			status: "active",
		});

		console.log("Found files:", files);

		if (!files || files.length === 0) {
			return res.status(404).json({ error: "Files not found" });
		}

		// Check expiry
		const now = new Date();
		const expiredFiles = files.filter((file) => file.expiryDate < now);
		if (expiredFiles.length > 0) {
			// Update expired files
			await Promise.all(
				expiredFiles.map((file) => {
					file.status = "expired";
					return file.save();
				})
			);
			return res.status(410).json({ error: "Files have expired" });
		}

		// Send files info
		const response = files.map((file) => {
			// Find the uploader for this specific group code
			const uploader = file.uploaders.find(
				(u) => u.groupCode === groupCode.toUpperCase()
			);
			const uploaderUsername = uploader ? uploader.username : file.username;

			return {
				id: file._id,
				name: file.originalName,
				filename: file.filename,
				size: file.size,
				mimetype: file.mimetype,
				uploadDate: uploader ? uploader.uploadDate : file.uploadDate,
				expiryDate: file.expiryDate,
				downloads: file.downloads,
				groupCodes: [groupCode.toUpperCase()], // Only return the current group code
				username: uploaderUsername,
			};
		});

		console.log("Sending response:", response);
		res.json(response);
	} catch (error) {
		console.error("Get files error:", error);
		res.status(500).json({ error: error.message });
	}
};

exports.downloadFile = async (req, res) => {
	try {
		const { groupCode, fileId } = req.params;
		console.log("Download request:", { groupCode, fileId });

		if (!fileId) {
			return res.status(400).json({ error: "File ID is required" });
		}

		// Find file by ID and group code
		const file = await File.findOne({
			_id: fileId,
			groupCodes: groupCode.toUpperCase(),
			status: "active",
		});

		console.log("File record from DB:", file);

		if (!file) {
			return res.status(404).json({ error: "File not found" });
		}

		// Check expiry
		if (file.isExpired()) {
			file.status = "expired";
			await file.save();
			return res.status(410).json({ error: "File has expired" });
		}

		// Ensure the file path is absolute
		const absoluteFilePath = path.resolve(__dirname, "..", file.filePath);
		console.log("Resolved absolute file path:", absoluteFilePath);

		// Check if file exists on disk
		try {
			await fsPromises.access(absoluteFilePath);
			console.log("File exists on disk:", absoluteFilePath);
		} catch (error) {
			console.error("File access error (file does not exist):", error);
			return res.status(404).json({ error: "File not found on server" });
		}

		// Increment download counter
		file.downloads += 1;
		await file.save();

		// Set headers for file download
		res.setHeader("Content-Type", file.mimetype);
		res.setHeader(
			"Content-Disposition",
			`attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`
		);

		// Stream the file
		console.log("About to stream file with fs.createReadStream");
		const fileStream = fs.createReadStream(absoluteFilePath);

		fileStream.on("error", (error) => {
			console.error("File stream error:", error);
			if (!res.headersSent) {
				res.status(500).json({ error: "Error streaming file" });
			}
		});

		fileStream.on("end", () => {
			console.log("File download completed:", file.originalName);
		});

		fileStream.pipe(res);
	} catch (error) {
		console.error("Download error:", error);
		if (!res.headersSent) {
			res.status(500).json({ error: error.message });
		}
	}
};

exports.getFilesByUser = async (req, res) => {
	try {
		const { username } = req.params;
		const files = await File.find({ username })
			.select("-filePath")
			.sort({ uploadDate: -1 });

		res.json(files);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getUserStats = async (req, res) => {
	try {
		const stats = await File.aggregate([
			{
				$group: {
					_id: "$username",
					fileCount: { $sum: 1 },
					totalSize: { $sum: "$size" },
					totalDownloads: { $sum: "$downloads" },
				},
			},
			{ $sort: { fileCount: -1 } },
		]);
		res.json(stats);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.searchFiles = async (req, res) => {
	try {
		const { q, username } = req.query;

		const searchQuery = {};

		if (username) {
			searchQuery.username = username;
		}

		if (q) {
			if (q.length === 8 && /^[0-9A-F]+$/i.test(q)) {
				// If query looks like a group code
				searchQuery.groupCodes = q.toUpperCase();
			} else {
				// Text search in file names
				searchQuery.$text = { $search: q };
			}
		}

		const files = await File.find(searchQuery)
			.select("-filePath")
			.sort({ uploadDate: -1 })
			.limit(20);

		res.json(files);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.deleteFile = async (req, res) => {
	try {
		const { groupCode, filename } = req.params;
		const { username } = req.body;

		const file = await File.findOne({
			groupCodes: groupCode.toUpperCase(),
			filename,
			status: "active",
		});

		if (!file) {
			return res.status(404).json({ error: "File not found" });
		}

		if (file.username !== username) {
			return res
				.status(403)
				.json({ error: "Not authorized to delete this file" });
		}

		// Delete file from disk
		try {
			await fsPromises.unlink(file.filePath);
		} catch (error) {
			console.error("Error deleting file from disk:", error);
		}

		// Delete file record from database
		await file.deleteOne();

		res.json({ message: "File deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.streamFile = async (req, res) => {
	try {
		const { groupCode, fileId } = req.params;
		console.log("Stream request received:", { groupCode, fileId });

		const file = await File.findOne({
			_id: fileId,
			groupCodes: groupCode.toUpperCase(),
			status: "active",
		});

		console.log(
			"File found in DB:",
			file
				? {
						id: file._id,
						name: file.originalName,
						filename: file.filename,
						filePath: file.filePath,
						mimetype: file.mimetype,
				  }
				: "No file found"
		);

		if (!file) {
			return res.status(404).json({ error: "File not found" });
		}

		// Check expiry
		if (file.isExpired()) {
			file.status = "expired";
			await file.save();
			return res.status(410).json({ error: "File has expired" });
		}

		// Construct the file path
		const uploadDir = path.join(__dirname, "..", "uploads");
		const absoluteFilePath = path.join(uploadDir, file.filename);

		console.log("File path details:", {
			uploadDir,
			filename: file.filename,
			absoluteFilePath,
			originalFilePath: file.filePath,
		});

		try {
			const exists = await fsPromises
				.access(absoluteFilePath)
				.then(() => true)
				.catch(() => false);

			if (!exists) {
				console.error("File does not exist at path:", absoluteFilePath);
				return res.status(404).json({ error: "File not found on server" });
			}
			console.log("File exists on disk at:", absoluteFilePath);
		} catch (error) {
			console.error("File access error:", error);
			return res.status(404).json({ error: "File not found on server" });
		}

		const stat = await fsPromises.stat(absoluteFilePath);
		console.log("File stats:", {
			size: stat.size,
			mime: file.mimetype,
		});

		// Set CORS headers
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
		res.setHeader("Access-Control-Allow-Headers", "Range");

		const range = req.headers.range;
		if (range) {
			console.log("Range request received:", range);
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
			const chunksize = end - start + 1;

			console.log("Streaming range:", { start, end, chunksize });

			const stream = fs.createReadStream(absoluteFilePath, { start, end });
			res.writeHead(206, {
				"Content-Range": `bytes ${start}-${end}/${stat.size}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": file.mimetype,
			});

			stream.on("error", (error) => {
				console.error("Stream error:", error);
				if (!res.headersSent) {
					res.status(500).json({ error: "Error streaming file" });
				}
			});

			stream.pipe(res);
		} else {
			console.log("Full file request");
			res.writeHead(200, {
				"Content-Length": stat.size,
				"Content-Type": file.mimetype,
				"Accept-Ranges": "bytes",
			});

			const stream = fs.createReadStream(absoluteFilePath);

			stream.on("error", (error) => {
				console.error("Stream error:", error);
				if (!res.headersSent) {
					res.status(500).json({ error: "Error streaming file" });
				}
			});

			stream.pipe(res);
		}
	} catch (error) {
		console.error("Stream error:", error);
		if (!res.headersSent) {
			res.status(500).json({ error: error.message });
		}
	}
};
