const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/files", require("./routes/files"));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Server error" });
});

module.exports = app;
