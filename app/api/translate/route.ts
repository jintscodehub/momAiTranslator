import { NextRequest } from "next/server";

if (!process.env.OPEN_AI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export type ChatGPTAgent = "user" | "system";

interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

interface RequestPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  max_tokens: number;
}

export async function POST(req: NextRequest) {
  const { englishText, momInput } = await req.json();

  if (!englishText) {
    return new Response(JSON.stringify({ error: "No English text provided" }), { status: 400 });
  }

  const translateToMandarin = async (text: string) => {
    const payload: RequestPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translator. Translate the following English text to Mandarin Chinese." },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 200,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API request failed");
    }
    return data.choices[0].message.content;
  };

  const generateReply = async (text: string, momInput: string) => {
    const payload: RequestPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant helping to generate a personal, direct English reply from the perspective of a mother communicating with a client." },
        { role: "user", content: `Context (English text from client): ${text}\nMom's input (in Mandarin): ${momInput}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API request failed");
    }
    return data.choices[0].message.content;
  };

  try {
    const mandarinTranslation = await translateToMandarin(englishText);
    const reply = momInput ? await generateReply(englishText, momInput) : null;

    return new Response(JSON.stringify({ mandarinTranslation, reply }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "An error occurred while processing the request." }), { status: 500 });
  }
}
