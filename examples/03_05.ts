import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";

import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";

export async function func() {
  // 数据准备
  const flowers = [
    { flower_name: "玫瑰", price: 99 },
    { flower_name: "百合", price: 168 },
    { flower_name: "康乃馨", price: 38 },
  ];

  // 创建提示模板
  const templte = `您是一位专业的鲜花店文案撰写员。
  对于售价为 {price} 元的 {flower_name} ，您能提供一个吸引人的简短描述吗？
  {format_instructions}`;

  // 创建模型实例
  const model = new OpenAI(
    { modelName: "text-davinci-003" },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );

  // 定义我们想要接收的响应模式
  const responseSchemas = {
    description: "鲜花的描述文案",
    reason: "问什么要这样写这个文案",
  };

  // 创建输出解析器
  const outputParser =
    StructuredOutputParser.fromNamesAndDescriptions(responseSchemas);

  // 获取格式指示
  const formatInstructions = outputParser.getFormatInstructions();

  // 根据模板创建提示，同时在提示中加入输出解析器的说明
  const prompt = PromptTemplate.fromTemplate<{
    flower_name: string;
    price: number;
  }>(templte, {
    partialVariables: { format_instructions: formatInstructions },
  });

  const outputs = [];
  for (const { flower_name, price } of flowers) {
    // 根据提示准备模型的输入
    const input = await prompt.format({ flower_name, price });

    // 打印完整提示词
    // return input;

    // 获取模型的输出
    const output = await model.call(input);

    // 解析模型的输出（这是一个字典结构）
    const parsedOutput = await outputParser.parse(output);

    // 在解析后的输出中添加“flower”和“price”
    outputs.push([
      flower_name,
      price,
      parsedOutput.description,
      parsedOutput.reason,
    ]);
  }

  // 保存到CSV文件
  const csv = stringify(outputs, {
    header: true,
    columns: ["flower", "price", "description", "reason"],
  });
  fs.writeFileSync(
    path.resolve("examples", "./flowers_with_descriptions.csv"),
    csv
  );

  // 打印字典
  return outputs;
}

export default func;
