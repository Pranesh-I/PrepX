const express = require("express");
const upload = require("../middleware/uploadMiddleware");

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

module.exports = router;