const express = require("express");

const {
  generatePaper,
  getPaperById,
  getAllPapers,
  deletePaper,
  downloadPaper,
} = require("../controllers/paperController");

const router = express.Router();

// Generate Question Paper
router.post("/generate", generatePaper);

// Get All Papers
router.get("/", getAllPapers);

// Get Paper By ID
router.get("/:id", getPaperById);

// Delete Paper
router.delete("/:id", deletePaper);

router.get("/:id/download", downloadPaper);

module.exports = router;