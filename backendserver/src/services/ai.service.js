const { GoogleGenerativeAI } = require("@google/generative-ai");

const AppError = require("../utils/AppError");
const STATUS_CODES = require("../utils/statusCode");
const buildPrompt = require("../utils/promptBuilder");
require("dotenv").config();
class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    this.MAX_RETRIES = 3;
  }

  async extractCRM(batch) {
    const prompt = buildPrompt(batch);

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);

        let responseText = result.response.text().trim();

  
        responseText = responseText
          .replace(/^```json/i, "")
          .replace(/^```/i, "")
          .replace(/```$/i, "")
          .trim();

        const parsed = JSON.parse(responseText);

        if (!Array.isArray(parsed)) {
          throw new Error("AI did not return an array.");
        }

        return parsed;
      } catch (error) {
        console.log(`AI Attempt ${attempt} failed`);

        if (attempt === this.MAX_RETRIES) {
          throw new AppError(
            "AI extraction failed.",
            STATUS_CODES.INTERNAL_SERVER_ERROR
          );
        }
      }
    }
  }
}

module.exports = new AIService();