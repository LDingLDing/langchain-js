import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  // 创建LangChain提示模板
  const prompt = PromptTemplate.fromTemplate(
    `您是一位专业的鲜花店文案撰写员。
  对于售价为 {price} 元的 {flower_name} ，您能提供一个吸引人的简短描述吗？`
  );

  // 创建模型实例
  const model = new OpenAI(
    {
      modelName: "text-davinci-003",
    },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );

  // 多种花的列表
  const flowers = [
    { flower_name: "玫瑰", price: 99 },
    { flower_name: "百合", price: 168 },
    { flower_name: "康乃馨", price: 38 },
  ];

  // 生成多种花的文案
  const output = [];
  for (const flower of flowers) {
    const input = await prompt.format(flower);
    const text = await model.call(input);
    output.push(text);
  }
  return output;
}

export default func;
