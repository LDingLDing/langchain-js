import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import { LLMChain, SequentialChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  const llm = new OpenAI(
    { temperature: 0.7 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 第一个LLMChain：生成鲜花的介绍
  const introductionTemplate = `
    你是一个植物学家。给定花的名称和类型，你需要为这种花写一个200字左右的介绍。
    花名: {name}
    颜色: {color}
    植物学家: 这是关于上述花的介绍:`;

  const introductionPrompt = new PromptTemplate({
    inputVariables: ["name", "color"],
    template: introductionTemplate,
  });

  const introductionChain = new LLMChain({
    llm,
    prompt: introductionPrompt,
    outputKey: "introduction",
  });

  // 第二个LLMChain：根据鲜花的介绍写出鲜花的评论
  const reviewTemplate = `
    你是一位鲜花评论家。给定一种花的介绍，你需要为这种花写一篇200字左右的评论。
    鲜花介绍:
    {introduction}
    花评人对上述花的评论:`;

  const reviewPrompt = new PromptTemplate({
    inputVariables: ["introduction"],
    template: reviewTemplate,
  });

  const reviewChain = new LLMChain({
    llm,
    prompt: reviewPrompt,
    outputKey: "review",
  });

  // 第三个LLMChain：根据鲜花的介绍和评论写出一篇自媒体的文案
  const socialPostTemplate = `
    你是一家花店的社交媒体经理。给定一种花的介绍和评论，你需要为这种花写一篇社交媒体的帖子，300字左右。
    鲜花介绍:
    {introduction}
    花评人对上述花的评论:
    {review}
    社交媒体帖子:`;

  const socialPostPrompt = new PromptTemplate({
    inputVariables: ["introduction", "review"],
    template: socialPostTemplate,
  });

  const socialPostChain = new LLMChain({
    llm,
    prompt: socialPostPrompt,
    outputKey: "social_post_text",
  });

  // 总的链：按顺序运行三个链
  const overallChain = new SequentialChain({
    chains: [introductionChain, reviewChain, socialPostChain],
    inputVariables: ["name", "color"],
    outputVariables: ["introduction", "review", "social_post_text"],
    verbose: true,
  });

  // 运行链并打印结果
  const result = await overallChain.call({ name: "玫瑰", color: "黑色" });

  return result;
}

export default func;
