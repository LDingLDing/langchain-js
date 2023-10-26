import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  // 原始字符串模板
  const template = "{flower}的花语是?";
  // 创建模型实例
  const llm = new OpenAI(
    { temperature: 0 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );
  // 创建LLMChain
  const llmChain = new LLMChain({
    llm,
    prompt: await PromptTemplate.fromTemplate(template),
  });
  // 调用LLMChain，返回结果
  const result = await llmChain.call({ flower: "玫瑰" });
  return result.text;
}

export default func;
