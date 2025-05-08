const mongoose = require("mongoose");
const crypto = require("crypto");

const FileSchema = new mongoose.Schema({
	filename: {
		type: String,
		required: true,
	},
	originalName: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
	mimetype: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	uploaders: [
		{
			username: {
				type: String,
				required: true,
			},
			groupCode: {
				type: String,
				required: true,
			},
			uploadDate: {
				type: Date,
				default: Date.now,
			},
		},
	],
	filePath: {
		type: String,
		required: true,
	},
	groupCodes: [
		{
			type: String,
			required: true,
		},
	],
	downloads: {
		type: Number,
		default: 0,
	},
	isPublic: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: ["active", "expired", "deleted"],
		default: "active",
	},
	uploadDate: {
		type: Date,
		default: Date.now,
	},
	expiryDate: {
		type: Date,
		default: function () {
			const date = new Date();
			date.setDate(date.getDate() + 21); // 21 days from now
			return date;
		},
	},
});

// Create indexes for better search performance
FileSchema.index({
	originalName: "text",
	username: 1,
	status: 1,
});

// Add a method to check if file is expired
FileSchema.methods.isExpired = function () {
	return new Date() > this.expiryDate;
};

module.exports = mongoose.model("File", FileSchema);
