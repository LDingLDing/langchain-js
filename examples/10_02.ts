import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";

export async function func() {
  // 初始化大语言模型
  const llm = new OpenAI(
    {
      modelName: "text-davinci-003",
      temperature: 0.5,
    },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  const memory = new BufferMemory();

  // 初始化对话链
  const conversation = new ConversationChain({
    llm,
    memory,
  });

  // 第一天的对话
  // 回合1
  await conversation.run("我姐姐明天要过生日，我需要一束生日花束。");
  const arch1 = await memory.loadMemoryVariables({});

  // 回合2
  await conversation.run("她喜欢粉色玫瑰，颜色是粉色的。");
  const arch2 = await memory.loadMemoryVariables({});

  // 回合3 （第二天的对话）
  await conversation.run("我又来了，还记得我昨天为什么要来买花吗？");
  const arch3 = await memory.loadMemoryVariables({});

  return {
    "第一次对话后的记忆:": arch1,
    "第二次对话后的记忆:": arch2,
    "第三次对话后的记忆:": arch3,
    "第三次对话后时提示:": conversation.prompt.template,
  };
}

export default func;
