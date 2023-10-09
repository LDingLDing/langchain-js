/** @format */
import { OpenAI } from "langchain/llms/openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";

export async function func() {
  const response = new OpenAI({
    modelName: "text-davinci-003",
    temperature: 0.5,
    maxTokens: 100,
    prompt,
  });
}

export default func;
