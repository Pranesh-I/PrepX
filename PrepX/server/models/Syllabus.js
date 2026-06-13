const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
      default: "",
    },

    topics: [
      {
        type: String,
      },
    ],

    subject: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Syllabus", syllabusSchema);