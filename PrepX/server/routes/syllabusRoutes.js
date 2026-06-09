const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const model = require("../services/geminiService");

const router = express.Router();

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

module.exports = router;