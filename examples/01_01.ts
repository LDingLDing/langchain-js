import OpenAI from "openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  const openai = new OpenAI({
    apiKey: getOpenAIKey(),
    baseURL: getOpenAIBaseURL(),
  });
  const response = await openai.completions.create({
    model: "text-davinci-003",
    temperature: 0.5,
    max_tokens: 100,
    prompt: "请给我的花店起个名",
  });
  return response.choices[0].text;
}

export default func;
