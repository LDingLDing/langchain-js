import { OpenAI } from "langchain/llms/openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  const llm = new OpenAI(
    {
      modelName: "text-davinci-003",
      maxTokens: 200,
    },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );
  const text = await llm.call("请给我写一句情人节红玫瑰的中文宣传语");
  return text;
}

export default func;
