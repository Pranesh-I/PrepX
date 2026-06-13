const Syllabus = require("../models/Syllabus");

const {
  extractTopicsFromImage,
} = require("../services/geminiService");

const uploadSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!req.body.subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    const geminiResponse =
      await extractTopicsFromImage(req.file.path);

    const parsedData = JSON.parse(geminiResponse);

    const syllabus = await Syllabus.create({
      imageUrl: req.file.path,
      subject: req.body.subject,
      topics: parsedData.topics || [],
      rawText: geminiResponse,
    });

    res.status(201).json({
      success: true,
      message: "Syllabus uploaded successfully",
      syllabusId: syllabus._id,
      subject: syllabus.subject,
      topics: syllabus.topics,
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