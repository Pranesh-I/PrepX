const { model } = require("./geminiService");

const generateQuestionPaper = async (
  subject,
  topics,
  blueprint
) => {
  const prompt = `
You are a senior university professor with more than 20 years of experience setting university semester examination papers.

SUBJECT:
${subject}

TOPICS:
${JSON.stringify(topics)}

BLUEPRINT:
${JSON.stringify(blueprint)}

====================================================

OBJECTIVE

Generate a realistic university examination question paper exactly according to the blueprint.

The generated paper should look like it was created by an experienced faculty member.

====================================================

TOPIC ANALYSIS PHASE

Before generating questions:

1. Analyze all syllabus topics.

2. Identify the top 30-40% most important, high-weight and exam-worthy topics.

3. Generate MOST questions from those important topics.

4. The same important topic may appear in:
   - 1 mark section
   - 2 mark section
   - long answer section

5. Marks determine depth of questioning.
   Marks DO NOT determine topic importance.

6. Less important topics may appear occasionally but should not dominate the paper.

====================================================

QUESTION QUALITY RULES

1. Questions must resemble actual university semester examination questions.

2. Avoid textbook exercise style questions.

3. Avoid random practice problems.

4. Prefer faculty-style descriptive questions.

5. Long-answer questions should test:
   - understanding
   - explanation
   - comparison
   - design
   - application
   - analysis

6. Avoid duplicate questions.

7. Avoid repeating the same concept multiple times.

8. Use proper academic language.

====================================================

1 MARK QUESTIONS

Allowed Types:

- MCQ
- True/False
- Fill in the blanks

Distribution:

- Mix all three types.
- Do not generate only MCQs.

--------------------------

MCQ FORMAT

Every MCQ must contain exactly 4 options.

Example:

{
  "topic":"Lexical Analysis",
  "marks":1,
  "questionType":"mcq",
  "questionText":"Which compiler phase converts source code into tokens?",
  "options":[
    "Lexical Analysis",
    "Syntax Analysis",
    "Code Generation",
    "Code Optimization"
  ]
}

DO NOT provide answers.

--------------------------

TRUE/FALSE FORMAT

{
  "topic":"LL(1) Parser",
  "marks":1,
  "questionType":"true_false",
  "questionText":"LL(1) parser uses one lookahead symbol."
}

DO NOT provide answers.

--------------------------

FILL BLANK FORMAT

{
  "topic":"Three Address Code",
  "marks":1,
  "questionType":"fill_blank",
  "questionText":"__________ is an intermediate representation that uses at most three operands."
}

DO NOT provide answers.

====================================================

2 MARK QUESTIONS

Generate:

- Definitions
- Advantages
- Differences
- Short explanations
- Applications

Keep answers short in nature.

====================================================

5 MARK QUESTIONS

Generate:

- Concept explanations
- Procedures
- Working principles
- Short theory questions

====================================================

10+ MARK QUESTIONS

Generate realistic faculty-style long questions.

Prefer:

- Detailed explanations
- Design questions
- Comparison questions
- Application questions
- Analytical questions

Avoid unnecessary textbook-style construction exercises unless the topic naturally requires them.

Examples:

GOOD:

"Explain the working of SLR Parsing with suitable example."

"Compare SLR and LALR parsers."

"Discuss Code Optimization techniques."

AVOID:

"Construct 25 parsing tables."

====================================================

SPLIT QUESTION RULE

If a blueprint pattern exists, follow it exactly.

Example:

Pattern:

[10,4]

Output:

{
  "topic":"SLR Parsing",
  "marks":14,
  "parts":[
    {
      "label":"a",
      "marks":10,
      "questionText":"Explain the working of SLR Parsing with suitable example."
    },
    {
      "label":"b",
      "marks":4,
      "questionText":"List the advantages of SLR Parsing."
    }
  ]
}

Supported patterns include:

[7,7]
[10,4]
[8,6]
[8,8]
[5,5,4]

and any custom pattern.

====================================================

OUTPUT FORMAT

Return ONLY VALID JSON.

{
  "questions":[]
}

No markdown.

No explanation.

No extra text.

Return only JSON.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  generateQuestionPaper,
};