const express = require("express");

const {
  generatePaper,
  getPaperById,
} = require("../controllers/paperController");

const router = express.Router();

// Generate Question Paper
router.post("/generate", generatePaper);

// Get Generated Paper by ID
router.get("/:id", getPaperById);

module.exports = router;