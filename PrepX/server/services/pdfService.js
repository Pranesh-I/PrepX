const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (paper) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("========== PDF SERVICE ==========");
      console.log("Generating PDF for:", paper.subject);

      const fileName = `paper_${paper._id}.pdf`;

      const filePath = path.join(
        __dirname,
        "../generated-papers",
        fileName
      );

      console.log("Saving PDF to:", filePath);

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const stream = fs.createWriteStream(filePath);

      stream.on("finish", () => {
        console.log("✅ PDF Saved Successfully");

        resolve({
          fileName,
          filePath,
        });
      });

      stream.on("error", (err) => {
        console.error("Stream Error:", err);
        reject(err);
      });

      doc.pipe(stream);

      // =====================================================
      // HEADER
      // =====================================================

      doc
        .fontSize(18)
        .text("SRI ESHWAR COLLEGE OF ENGINEERING", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(16)
        .text("MODEL QUESTION PAPER", {
          align: "center",
        });

      doc.moveDown();

      doc.fontSize(12);

      doc.text(`Subject : ${paper.subject}`);
      doc.text("Time : 3 Hours");
      doc.text("Max Marks : 100");

      doc.moveDown();

      // =====================================================
      // PART A (1 MARK)
      // =====================================================

      doc
        .fontSize(14)
        .text("PART - A");

      doc.moveDown();

      let partANumber = 1;

      paper.questions.forEach((question) => {

        if (
          question.marks === 1 &&
          (!question.parts || question.parts.length === 0)
        ) {

          doc
            .fontSize(12)
            .text(
              `${partANumber}. ${question.questionText} (${question.marks} Mark)`
            );

          if (
            question.questionType === "mcq" &&
            Array.isArray(question.options)
          ) {

            question.options.forEach((option, index) => {

              doc.text(
                `   ${String.fromCharCode(
                  65 + index
                )}. ${option}`
              );

            });

          }

          doc.moveDown();

          partANumber++;

        }

      });

      // =====================================================
      // PART B (2 MARK)
      // =====================================================

      doc.addPage();

      doc
        .fontSize(14)
        .text("PART - B");

      doc.moveDown();

      let partBNumber = 21;

      paper.questions.forEach((question) => {

        if (
          question.marks === 2 &&
          (!question.parts || question.parts.length === 0)
        ) {

          doc
            .fontSize(12)
            .text(
              `${partBNumber}. ${question.questionText} (${question.marks} Marks)`
            );

          doc.moveDown();

          partBNumber++;

        }

      });

      // =====================================================
      // PART C (LONG QUESTIONS)
      // =====================================================

      doc.addPage();

      doc
        .fontSize(14)
        .text("PART - C");

      doc.moveDown();

      let partCNumber = 26;

      paper.questions.forEach((question) => {

        if (
          question.parts &&
          question.parts.length > 0
        ) {

          doc
            .fontSize(12)
            .text(`${partCNumber}.`);

          question.parts.forEach((part) => {

            doc.text(
              `   ${part.label}) ${part.questionText} (${part.marks} Marks)`
            );

          });

          doc.moveDown();

          partCNumber++;

        }

      });

      console.log("Ending PDF...");
      doc.end();

    } catch (error) {

      console.error("PDF Generation Error:", error);
      reject(error);

    }
  });
};

module.exports = {
  generatePDF,
};