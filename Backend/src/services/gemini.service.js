import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-embedding-001" });
};

export const getEmbedding = async (text) => {
  try {
    const model = getModel();
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Gemini Embedding Error:", error);
    throw error;
  }
};

export const getEmbeddings = async (texts) => {
  try {
    const model = getModel();
    const result = await model.batchEmbedContents({
      requests: texts.map((text) => ({
        content: { parts: [{ text }] },
      })),
    });
    return result.embeddings.map((e) => e.values);
  } catch (error) {
    console.error("Gemini Batch Embedding Error:", error);
    throw error;
  }
};
