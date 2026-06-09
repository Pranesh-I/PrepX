const genAI = require("../config/gemini");

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL,
});

module.exports = model;