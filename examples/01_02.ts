import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import OpenAI from "openai";

export async function func() {
  const openai = new OpenAI({
    apiKey: getOpenAIKey(),
    baseURL: getOpenAIBaseURL(),
  });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a creative AI." },
      { role: "user", content: "请给我的花店起个名" },
    ],
    temperature: 0.8,
    max_tokens: 60,
  });
  return response.choices[0].message.content;
}

export default func;
