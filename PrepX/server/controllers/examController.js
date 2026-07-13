const Attempt = require("../models/Attempt");
const Paper = require("../models/Paper");

/*
========================================
Start Exam
========================================
POST /api/exam/start/:paperId
*/

const startExam = async (req, res) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    const attempt = await Attempt.create({
      paperId: paper._id,
      totalQuestions: paper.questions.length,
      status: "in-progress",
    });

    res.status(201).json({
      success: true,
      message: "Exam started successfully",
      attemptId: attempt._id,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
Get Exam
========================================
GET /api/exam/:attemptId
*/

const getExam = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const paper = await Paper.findById(attempt.paperId);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    // Remove answers before sending to frontend
    const questions = paper.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      marks: q.marks,
      topic: q.topic,
      questionType: q.questionType,
      options: q.options,
      parts: q.parts,
    }));

    res.status(200).json({
      success: true,
      attemptId: attempt._id,
      subject: paper.subject,
      questions,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
Save Answer
========================================
PUT /api/exam/:attemptId/answer
*/

const saveAnswer = async (req, res) => {
  try {

    const { attemptId } = req.params;

    const {
      questionId,
      selectedOption,
      markedForReview,
    } = req.body;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const existingAnswer = attempt.answers.find(
      (a) => a.questionId.toString() === questionId
    );

    if (existingAnswer) {

      existingAnswer.selectedOption = selectedOption;
      existingAnswer.markedForReview = markedForReview;

    } else {

      attempt.answers.push({
        questionId,
        selectedOption,
        markedForReview,
      });

    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Answer saved",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
========================================
Submit Exam
========================================
POST /api/exam/:attemptId/submit
*/

const submitExam = async (req, res) => {

  try {

    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const paper = await Paper.findById(attempt.paperId);

    let score = 0;

    let totalCorrect = 0;

    for (const answer of attempt.answers) {

      const question = paper.questions.find(
        (q) =>
          q._id.toString() === answer.questionId.toString()
      );

      if (!question) continue;

      if (
        question.correctAnswer &&
        answer.selectedOption === question.correctAnswer
      ) {

        answer.isCorrect = true;

        score += question.marks;

        totalCorrect++;

      }

    }

    attempt.score = score;
    attempt.totalCorrect = totalCorrect;
    attempt.status = "submitted";
    attempt.submittedAt = new Date();

    // Calculate total marks
    const totalMarks = paper.questions.reduce(
    (sum, question) => sum + question.marks,
    0
    );

    // Calculate percentage
    const percentage =
    totalMarks > 0
        ? Number(((score / totalMarks) * 100).toFixed(2))
        : 0;

    attempt.percentage = percentage;

    await attempt.save();

    // Calculate unanswered questions
    const unanswered =
    attempt.totalQuestions - attempt.answers.length;

    // Wrong answers
    const wrong =
    attempt.answers.length - totalCorrect;

    res.status(200).json({
    success: true,

    summary: {
        score,
        totalMarks,
        percentage,

        totalQuestions: attempt.totalQuestions,

        answered: attempt.answers.length,

        unanswered,

        correct: totalCorrect,

        wrong,
    },
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
  startExam,
  getExam,
  saveAnswer,
  submitExam,
};