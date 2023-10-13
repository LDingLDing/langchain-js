import { HuggingFaceInference } from "langchain/llms/hf";
import { PromptTemplate } from "langchain/prompts";
import { getHuggingFaceToken } from "@/app/libs/settings";

export async function func() {
  // 创建LangChain提示模板
  const prompt = PromptTemplate.fromTemplate(
    `You are a flower shop assitiant。
    For {price} of {flower_name} ，can you write something for me？`
  );

  // 创建模型实例
  const model = new HuggingFaceInference({
    model: "gpt2",
    apiKey: getHuggingFaceToken(),
  });

  // 输入提示
  const input = await prompt.format({ flower_name: "玫瑰", price: 99 });

  // 得到模型的输出
  const output = await model.call(input);

  return output;
}

export default func;
