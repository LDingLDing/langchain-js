import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  // 原始字符串模板
  const template = "{flower}的花语是?";
  // 创建LangChain模板
  const promptTemp = PromptTemplate.fromTemplate(template);
  // 根据模板创建提示
  const prompt = await promptTemp.format({ flower: "玫瑰" });
  // 创建模型实例
  const model = new OpenAI(
    { temperature: 0 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );
  // 传入提示，调用模型，返回结果
  const result = await model.call(prompt);

  return { prompt, result };
}

export default func;
