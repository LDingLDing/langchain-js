import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  // 设置提示模板
  const prompt = new PromptTemplate({
    inputVariables: ["flower", "season"],
    template: "{flower}在{season}的花语是?",
  });

  // 初始化大模型
  const llm = new OpenAI(
    { temperature: 0 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 初始化链
  const llmChain = new LLMChain({ llm, prompt });

  // 列表
  const list = [
    { flower: "玫瑰", season: "夏季" },
    { flower: "百合", season: "春季" },
    { flower: "郁金香", season: "秋季" },
  ];

  // call方法
  const result1 = await llmChain.call(list[0]);

  // run方法
  // @Tip: the langchain has a bug that in .run function cannot recognize [inputVariables]
  // const result2 = await llmChain.run(list[0]);

  // predict方法
  const result3 = await llmChain.predict(list[0]);

  // apply方法
  const result4 = await llmChain.apply(list);

  return { result1, result3, result4, llmChain };
}

export default func;
