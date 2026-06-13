const genAI = require("../config/gemini");

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL,
});

const extractTopicsFromImage = async (imageUrl) => {
const prompt = `
You are reading a student's syllabus document.

Extract ALL topics and subtopics from the syllabus.

Return ONLY valid JSON in this exact format:

{
  "topics": [
    "topic 1",
    "topic 2",
    "topic 3"
  ]
}

Rules:
- Extract only actual study topics and subtopics.
- Ignore UNIT headings, chapter names, section titles, page numbers and marks.
- Include subtopics if present.
- Remove duplicates.
- Return only JSON.
- No markdown.
- No explanation.
`;

  const result = await model.generateContent([
    prompt,
    {
      fileData: {
        mimeType: "image/jpeg",
        fileUri: imageUrl,
      },
    },
  ]);

  return result.response.text();
};

module.exports = {
  model,
  extractTopicsFromImage,
};