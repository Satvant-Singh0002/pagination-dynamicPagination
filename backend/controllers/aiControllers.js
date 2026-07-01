const { GoogleGenAI } = require("@google/genai");
const Expense = require("../models/expenseModels");
require("dotenv").config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getCategory = async (req, res) => {
  try {
    const { description } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
            You are an AI expense categorizer.

Analyze the expense description and suggest the best category.

Expense:
"${description}"

Rules:
- Return only the category name.
- Category should be short (1 or 2 words).
- Do not explain anything.
            `,
    });
    const category = response.text.trim();
    res.status(200).json({
    
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error occurred while categorizing expense.",
    });
  }
};

// Function to generate AI report
const generateReport = async (req, res) => {

    try {

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.userId
            }
        });

        const expenseData = expenses.map(exp => ({
            amount: exp.expenseAmount,
            description: exp.description,
            category: exp.category
        }));

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: `
You are an AI Financial Advisor.

Analyze the following expenses.

${JSON.stringify(expenseData)}

Generate:

1. Total spending summary
2. Highest spending category
3. Three short money saving suggestions

Keep the report short.
`
        });

        res.json({
            success: true,
            report: response.text
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to generate report"
        });

    }

};
module.exports ={
    getCategory,
    generateReport
}