import "dotenv/config";

//get response from grop
const getOpenAiResponse = async (message) => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("Groq API key is not configured");
    error.statusCode = 500;
    throw error;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options,
    );
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.error?.message || "Groq request failed");
      error.statusCode = 502;
      throw error;
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      const error = new Error("Groq returned an invalid response");
      error.statusCode = 502;
      throw error;
    }

    return content;
  } catch (err) {
    if (err.statusCode) throw err;

    console.error("Groq request failed:", err);
    const error = new Error("Unable to reach the AI provider");
    error.statusCode = 502;
    throw error;
  }
};
export default getOpenAiResponse;
