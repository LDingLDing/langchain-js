/**
 * 环境要求
 * 1. 启动 Qdrant
 * 2. 配置环境变量 QDRANT_URL
 */

import { PromptTemplate, FewShotPromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { SemanticSimilarityExampleSelector } from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  // 创建一些示例
  const samples = [
    {
      flower_type: "玫瑰",
      occasion: "爱情",
      ad_copy: "玫瑰，浪漫的象征，是你向心爱的人表达爱意的最佳选择。",
    },
    {
      flower_type: "康乃馨",
      occasion: "母亲节",
      ad_copy: "康乃馨代表着母爱的纯洁与伟大，是母亲节赠送给母亲的完美礼物。",
    },
    {
      flower_type: "百合",
      occasion: "庆祝",
      ad_copy: "百合象征着纯洁与高雅，是你庆祝特殊时刻的理想选择。",
    },
    {
      flower_type: "向日葵",
      occasion: "鼓励",
      ad_copy: "向日葵象征着坚韧和乐观，是你鼓励亲朋好友的最好方式。",
    },
  ];

  // 创建一个提示模板
  const examplePrompt = new PromptTemplate({
    template: "鲜花类型: {flower_type}\n场合: {occasion}\n文案: {ad_copy}",
    inputVariables: ["flower_type", "occasion", "ad_copy"],
  });

  // 创建一个FewShotPromptTemplate对象
  const prompt = new FewShotPromptTemplate({
    examplePrompt,
    examples: samples,
    suffix: "鲜花类型: {flower_type}\n场合: {occasion}",
    inputVariables: ["flower_type", "occasion"],
  });

  const openaiConfig = { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() };
  const model = new OpenAI({ modelName: "text-davinci-003" }, openaiConfig);

  // 把提示传递给大模型
  const input = await prompt.format({
    flower_type: "野玫瑰",
    occasion: "爱情",
  });
  const output = await model.call(input);

  // 初始化示例选择器
  const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
    samples,
    new OpenAIEmbeddings(undefined, openaiConfig),
    QdrantVectorStore,
    { k: 1 }
  );

  // 创建一个使用示例选择器的FewShotPromptTemplate对象
  const prompt2 = new FewShotPromptTemplate({
    exampleSelector,
    examplePrompt,
    suffix: "鲜花类型: {flower_type}\n场合: {occasion}",
    inputVariables: ["flower_type", "occasion"],
  });

  // 把提示传递给大模型
  const input2 = await prompt2.format({
    flower_type: "红玫瑰",
    occasion: "爱情",
  });
  const output2 = await model.call(input2);

  return { input, output, input2, output2 };
}

export default func;
