const Syllabus = require("../models/Syllabus");

const uploadSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const syllabus = await Syllabus.create({
      imageUrl: req.file.path,
      rawText: "",
      topics: [],
      subject: "",
    });

    res.status(201).json({
      success: true,
      message: "Syllabus uploaded successfully",
      syllabusId: syllabus._id,
      imageUrl: syllabus.imageUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadSyllabus,
};