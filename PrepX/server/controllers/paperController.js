const Syllabus = require("../models/Syllabus");
const Paper = require("../models/Paper");

const {
  generateQuestionPaper,
} = require("../services/paperGenerationService");

const {
  generatePDF,
} = require("../services/pdfService");

const generatePaper = async (req, res) => {
  try {
    const { syllabusId, blueprint } = req.body;

    // Validate Request
    if (!syllabusId) {
      return res.status(400).json({
        success: false,
        message: "Syllabus ID is required",
      });
    }

    if (!Array.isArray(blueprint) || blueprint.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid blueprint is required",
      });
    }

    // Find syllabus
    const syllabus = await Syllabus.findById(syllabusId);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    // Generate Question Paper
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

    let parsedPaper;

    try {
      parsedPaper = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Gemini JSON Parse Error");
      console.error(cleanedResponse);

      return res.status(500).json({
        success: false,
        message: "Gemini returned invalid JSON",
      });
    }

    // Validate Response
    if (
      !parsedPaper.questions ||
      !Array.isArray(parsedPaper.questions)
    ) {
      return res.status(500).json({
        success: false,
        message: "Generated paper format is invalid",
      });
    }

    // Blueprint Validation
    const expectedQuestions = blueprint.reduce(
      (sum, item) => sum + item.count,
      0
    );

    if (parsedPaper.questions.length !== expectedQuestions) {
      return res.status(500).json({
        success: false,
        message:
          "Generated question count does not match blueprint",
      });
    }

    // Save Paper
    const savedPaper = await Paper.create({
      syllabusId: syllabus._id,
      subject: syllabus.subject,
      blueprint,
      questions: parsedPaper.questions,
    });

    return res.status(201).json({
      success: true,
      message: "Question paper generated successfully",
      paperId: savedPaper._id,
      totalQuestions: savedPaper.questions.length,
    });

  } catch (error) {
    console.error("Paper Generation Error");
    console.error(error);

    return res.status(500).json({
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

const getAllPapers = async (req, res) => {
  try {

    const papers = await Paper.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: papers.length,
      papers,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPaper = await Paper.findByIdAndDelete(id);

    if (!deletedPaper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Paper deleted successfully",
      deletedPaperId: deletedPaper._id,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const downloadPaper = async (req, res) => {
  try {
    console.log("========== DOWNLOAD ==========");

    const { id } = req.params;
    console.log("Paper ID:", id);

    const paper = await Paper.findById(id);

    console.log("Paper Found:", !!paper);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found",
      });
    }

    console.log("Calling generatePDF()...");

    const pdf = await generatePDF(paper);

    console.log("generatePDF() completed");

    console.log(pdf);

    res.download(pdf.filePath, pdf.fileName, (err) => {
      if (err) {
        console.log("Download Error");
        console.log(err);
      } else {
        console.log("Download Success");
      }
    });

  } catch (error) {

    console.error("DOWNLOAD ERROR");
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
  getAllPapers,
  deletePaper,
  downloadPaper,
};