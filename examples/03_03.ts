import OpenAI from "openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";

export async function func() {
  const openai = new OpenAI({
    apiKey: getOpenAIKey(),
    baseURL: getOpenAIBaseURL(),
  });

  const flowers = [
    { flower_name: "玫瑰", price: 99 },
    { flower_name: "百合", price: 168 },
    { flower_name: "康乃馨", price: 38 },
  ];

  const output = [];
  // 循环调用Text模型的Completion方法，生成文案
  for (const { flower_name, price } of flowers) {
    const prompt = `您是一位专业的鲜花店文案撰写员。对于售价为${price}元的${flower_name}，您能提供一个吸引人的简短描述吗？`;
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
    });
    // 输出文案
    output.push(response.choices[0].text.trim());
  }

  return output;
}

export default func;
