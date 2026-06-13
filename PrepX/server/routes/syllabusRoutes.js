const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadSyllabus,
} = require("../controllers/syllabusController");

const {
  model,
  extractTopicsFromImage,
} = require("../services/geminiService");

const router = express.Router();

// Test Cloudinary Upload
router.post(
  "/test-upload",
  upload.single("syllabus"),
  (req, res) => {
    res.json({
      success: true,
      file: req.file,
    });
  }
);

// Test Gemini Connection
router.get("/test-gemini", async (req, res) => {
  try {
    const result = await model.generateContent(
      "Say Gemini Connected"
    );

    console.log(result.response.text());

    res.json({
      success: true,
      response: result.response.text(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Real Upload Route
router.post(
  "/upload",
  upload.single("syllabus"),
  uploadSyllabus
);

router.post(
  "/test-vision",
  upload.single("syllabus"),
  async (req, res) => {
    try {
      const result = await extractTopicsFromImage(
        req.file.path
      );

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;