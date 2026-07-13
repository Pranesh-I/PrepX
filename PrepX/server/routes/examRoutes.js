const express = require("express");

const router = express.Router();

const {
  startExam,
  getExam,
  saveAnswer,
  submitExam,
} = require("../controllers/examController");

/*
========================================
Start Exam
POST /api/exam/start/:paperId
========================================
*/
router.post("/start/:paperId", startExam);

/*
========================================
Load Exam
GET /api/exam/:attemptId
========================================
*/
router.get("/:attemptId", getExam);

/*
========================================
Save Answer
PUT /api/exam/:attemptId/answer
========================================
*/
router.put("/:attemptId/answer", saveAnswer);

/*
========================================
Submit Exam
POST /api/exam/:attemptId/submit
========================================
*/
router.post("/:attemptId/submit", submitExam);

module.exports = router;