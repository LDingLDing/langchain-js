import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { OpenAIChat } from "langchain/llms/openai";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";

export async function func() {
  // 模板的构建
  const template = "你是一位专业顾问，负责为专注于{product}的公司起名。";
  const systemMessagePrompt =
    SystemMessagePromptTemplate.fromTemplate(template);
  const humanTemplate = "公司主打产品是{product_detail}。";
  const humanMessagePrompt =
    HumanMessagePromptTemplate.fromTemplate(humanTemplate);
  const promptTemplte = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    humanMessagePrompt,
  ]);

  // 格式化提示消息生成提示
  const prompt = (
    await promptTemplte.formatPromptValue({
      product: "鲜花装饰",
      product_detail: "创新的鲜花设计。",
    })
  ).toChatMessages();
  // return prompt;

  // 下面调用模型，把提示消息传入模型，生成结果
  const chat = new OpenAIChat(undefined, {
    apiKey: getOpenAIKey(),
    baseURL: getOpenAIBaseURL(),
  });

  const result = await chat.predictMessages(prompt);

  return result;
}

export default func;
