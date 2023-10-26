import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

export async function func() {
  // 初始化大语言模型
  const llm = new OpenAI(
    {
      modelName: "text-davinci-003",
      temperature: 0.5,
    },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 初始化对话链
  const convChain = new ConversationChain({ llm });

  // 打印对话的模板
  return convChain.prompt.template;
}

export default func;
