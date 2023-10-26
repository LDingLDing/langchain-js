import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  // 创建LangChain提示模板
  const prompt = PromptTemplate.fromTemplate(`
  您是一位专业的鲜花店文案撰写员。
  对于售价为 {price} 元的 {flower_name} ，您能提供一个吸引人的简短描述吗？
  `);

  // 创建模型实例
  const model = new OpenAI(
    { modelName: "text-davinci-003" },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 输入提示
  const input = await prompt.format({ flower_name: "玫瑰", price: 99 });

  // 得到模型的输出
  const output = await model.call(input);

  return output;
}
export default func;
