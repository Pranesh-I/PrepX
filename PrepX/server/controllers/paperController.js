const Syllabus = require("../models/Syllabus");
const Paper = require("../models/Paper");

const {
  generateQuestionPaper,
} = require("../services/paperGenerationService");

const generatePaper = async (req, res) => {
  try {
    const { syllabusId, blueprint } = req.body;

    if (!syllabusId) {
      return res.status(400).json({
        success: false,
        message: "Syllabus ID is required",
      });
    }

    if (!blueprint || !Array.isArray(blueprint)) {
      return res.status(400).json({
        success: false,
        message: "Blueprint array is required",
      });
    }

    console.log("========== PAPER DEBUG ==========");
    console.log("Received syllabusId:", syllabusId);

    const syllabus = await Syllabus.findById(syllabusId);

    console.log("Syllabus Found:");
    console.log(syllabus);
    console.log("================================");

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const generatedPaper = await generateQuestionPaper(
      syllabus.subject,
      syllabus.topics,
      blueprint
    );

    // Remove markdown if Gemini returns ```json
    const cleanedResponse = generatedPaper
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedPaper = JSON.parse(cleanedResponse);

    const savedPaper = await Paper.create({
      syllabusId: syllabus._id,
      subject: syllabus.subject,
      blueprint,
      questions: parsedPaper.questions,
    });

    res.status(200).json({
      success: true,
      message: "Question paper generated and saved",
      paperId: savedPaper._id,
      totalQuestions: savedPaper.questions.length,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await Paper.findById(id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    res.status(200).json({
      success: true,
      paper,
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
  generatePaper,
  getPaperById,
};