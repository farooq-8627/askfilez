const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    const { username } = req.body;
    const file = req.file;

    const newFile = new File({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      username
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilesByUser = async (req, res) => {
  try {
    const files = await File.find({ username: req.params.username });
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
          totalSize: { $sum: "$size" }
        }
      },
      { $sort: { fileCount: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.searchFilesByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { q } = req.query; // Optional search term

    const searchQuery = { username };

    // If search term provided, add text search
    if (q) {
      searchQuery.$text = { $search: q };
    }

    const files = await File.find(searchQuery)
      .sort({ uploadDate: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};