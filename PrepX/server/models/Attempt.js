const mongoose = require("mongoose");

/*
========================================
Student Answer Schema
========================================
*/

const answerSchema = new mongoose.Schema(
  {
    // Question being answered
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    /*
    ----------------------------------------
    Objective Questions
    ----------------------------------------
    MCQ / True-False / Fill in the Blank
    */

    selectedOption: {
      type: String,
      default: "",
    },

    /*
    ----------------------------------------
    Descriptive Questions (Phase 3)
    ----------------------------------------
    */

    writtenAnswer: {
      type: String,
      default: "",
    },

    uploadedImage: {
      type: String,
      default: "",
    },

    /*
    ----------------------------------------
    Evaluation
    ----------------------------------------
    */

    isCorrect: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    /*
    ----------------------------------------
    UI
    ----------------------------------------
    */

    markedForReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/*
========================================
Exam Attempt
========================================
*/

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "in-progress",
        "submitted",
        "evaluated",
      ],
      default: "in-progress",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: Date,

    timeTaken: {
      type: Number,
      default: 0,
    },

    answers: [answerSchema],

    /*
    ----------------------------------------
    Result
    ----------------------------------------
    */

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    totalCorrect: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attempt", attemptSchema);