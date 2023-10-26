import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

export async function func() {
  const chat = new ChatOpenAI(
    {
      modelName: "gpt-4",
      temperature: 0.8,
      maxTokens: 60,
    },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );

  const message = [
    new SystemMessage("你是一个很棒的智能助手"),
    new HumanMessage("请给我的花店起个名字"),
  ];

  const response = await chat.call(message);
  return response.content;
}

export default func;
