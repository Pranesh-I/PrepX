const express = require("express");

const {
  generatePaper,
} = require("../controllers/paperController");

const router = express.Router();

router.post(
  "/generate",
  generatePaper
);

module.exports = router;