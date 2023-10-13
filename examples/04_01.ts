import { PromptTemplate } from "langchain/prompts";

export async function func() {
  const prompt = PromptTemplate.fromTemplate(
    `你是业务咨询顾问。
    你给一个销售{product}的电商公司，起一个好的名字？`
  );

  // return prompt.format({ product: "鲜花" });

  const prompt2 = new PromptTemplate({
    inputVariables: ["product", "market"],
    template:
      "你是业务咨询顾问。对于一个面向{market}市场的，专注于销售{product}的公司，你会推荐哪个名字？",
  });

  return prompt2.format({ product: "鲜花", market: "高端" });
}

export default func;
