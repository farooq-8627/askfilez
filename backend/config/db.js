require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		console.log(process.env.MONGODB_URI);
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
};

module.exports = connectDB;
