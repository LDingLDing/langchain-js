import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  // 创建输出解析器, 定义我们想要接收的数据格式
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    flowerType: "鲜花的种类",
    price: "鲜花的价格",
    description: "鲜花的描述文案",
    reason: "为什么要这样写这个文案",
  });

  // 获取输出格式指示
  const formatInstructions = outputParser.getFormatInstructions();

  // 创建提示模板
  const promptTemplate = `您是一位专业的鲜花店文案撰写员。
  对于售价为 {price} 元的 {flower} ，您能提供一个吸引人的简短中文描述吗？
  {formatInstructions}`;

  // 根据模板创建提示，同时在提示中加入输出解析器的说明
  const prompt: any = PromptTemplate.fromTemplate(promptTemplate, {
    partialVariables: { formatInstructions },
  });

  // 数据准备
  const flowers = [
    { flower_name: "玫瑰", price: 99 },
    { flower_name: "百合", price: 168 },
    { flower_name: "康乃馨", price: 38 },
  ];

  // 创建模型实例
  const model = new OpenAI(
    { modelName: "text-davinci-003" },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );
  const outputs = [];
  for (const { flower_name: flower, price } of flowers) {
    // 根据提示准备模型的输入
    const input = await prompt.format({
      flower,
      price,
    });

    // 获取模型的输出
    const output = await model.call(input);

    // 解析模型的输出
    const parsedOutput = await outputParser.parse(output);

    // 将解析后的输出添加到 outputs 中
    outputs.push(parsedOutput);
  }
  return { formatInstructions, outputs };
}

export default func;
