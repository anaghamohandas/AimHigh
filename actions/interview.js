"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  async function callModel(p) {
    // Use structured contents where supported to improve reliability
    return await model.generateContent({ contents: [{ role: "user", parts: [{ text: p }] }] });
  }

  function extractTextFromResponse(result) {
    // Try known shapes: candidates/content/parts, response.text() function, or raw output
    try {
      const candidatesText = result?.response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("");
      if (candidatesText) return candidatesText;

      if (result?.response && typeof result.response.text === "function") {
        return result.response.text();
      }

      // Fallbacks
      if (typeof result?.response === "string") return result.response;
      if (result?.outputText) return result.outputText;

      return "";
    } catch (e) {
      return "";
    }
  }

  function tryParseJSONFromText(text) {
    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    // Try to extract the first {...} block which is likely the JSON
    const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
    const toParse = jsonMatch ? jsonMatch[1] : cleaned;

    return JSON.parse(toParse);
  }

  try {
    // First attempt
    const result = await callModel(prompt);
    const text = extractTextFromResponse(result) || "";

    try {
      const quiz = tryParseJSONFromText(text);
      if (quiz?.questions && Array.isArray(quiz.questions) && quiz.questions.length === 10) {
        return quiz.questions;
      }

      // If shape is unexpected or wrong number of questions, attempt one retry with an explicit enforcement message
      console.warn("generateQuiz: response did not contain 10 questions. Attempting one retry.");
    } catch (parseErr) {
      console.warn("generateQuiz: initial parse failed", parseErr?.message || parseErr);
    }

    // Retry prompt that asks the model to ONLY return valid JSON with 10 questions
    const retryPrompt = `
      Please return ONLY valid JSON in the exact format below with exactly 10 items in the "questions" array and no additional text or markdown:
      {
        "questions": [
          { "question": "string", "options": ["string","string","string","string"], "correctAnswer": "string", "explanation": "string" }
        ]
      }

      Previous response was not valid. Now return the corrected JSON.
    `;

    const retryResult = await callModel(retryPrompt);
    const retryText = extractTextFromResponse(retryResult) || "";
    try {
      const quiz = tryParseJSONFromText(retryText);
      if (quiz?.questions && Array.isArray(quiz.questions) && quiz.questions.length === 10) {
        return quiz.questions;
      }

      console.error("generateQuiz: retry returned invalid questions array", {
        length: quiz?.questions?.length,
        sample: Array.isArray(quiz?.questions) ? quiz.questions.slice(0, 3) : quiz?.questions,
        raw: retryText.slice(0, 200),
      });
    } catch (finalParseErr) {
      console.error("generateQuiz: retry parse failed", finalParseErr?.message || finalParseErr, retryText.slice(0, 300));
    }

    throw new Error("Failed to generate quiz questions in the expected JSON format (10 questions expected). Check server logs for model output.");
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}