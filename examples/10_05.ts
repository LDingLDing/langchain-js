import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";

export async function func() {
  // 初始化大语言模型
  const llm = new OpenAI(
    {
      modelName: "text-davinci-003",
      temperature: 0.5,
    },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  const memory = new ConversationSummaryBufferMemory({
    llm,
    maxTokenLimit: 300,
  });

  // 初始化对话链
  const conversation = new ConversationChain({
    llm,
    memory,
  });

  // 第一天的对话
  // 回合1
  const result1 = await conversation.run(
    "我姐姐明天要过生日，我需要一束生日花束。"
  );

  // 回合2
  const result2 = await conversation.run("她喜欢粉色玫瑰，颜色是粉色的。");
  const arch2 = await memory.loadMemoryVariables({});

  // 第二天的对话
  // 回合3
  const result3 = await conversation.run(
    "我又来了，还记得我昨天为什么要来买花吗？"
  );

  return { result1, result2, arch2, result3 };
}

export default func;
