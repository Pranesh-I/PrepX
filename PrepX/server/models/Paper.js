const mongoose = require("mongoose");

const questionPartSchema = new mongoose.Schema({
  label: {
    type: String,
  },

  marks: {
    type: Number,
  },

  questionText: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
  },

  marks: {
    type: Number,
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },

  parts: [questionPartSchema],
});

const blueprintItemSchema = new mongoose.Schema({
  marks: {
    type: Number,
    required: true,
  },

  count: {
    type: Number,
    required: true,
  },

  pattern: {
    type: [Number],
    default: [],
  },
});

const paperSchema = new mongoose.Schema(
  {
    syllabusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Syllabus",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    blueprint: [blueprintItemSchema],

    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Paper",
  paperSchema
);