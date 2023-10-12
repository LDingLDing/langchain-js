import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import { OpenAI } from "langchain/llms/openai";

export async function func() {
  const openai = new OpenAI(
    {
      modelName: "text-davinci-003",
      temperature: 0.8,
      maxTokens: 60,
    },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );

  const response = await openai.predict("请给我的花店起个名字");
  return response;
}

export default func;
