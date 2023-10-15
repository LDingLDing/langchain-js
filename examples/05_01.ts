import { OpenAIChat } from "langchain/llms/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";

export async function func() {
  // 创建聊天模型
  const llm = new OpenAIChat(
    { temperature: 0 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 设定 AI 的角色和目标
  const roleTemplate =
    "你是一个为花店电商公司工作的AI助手, 你的目标是帮助客户根据他们的喜好做出明智的决定";

  // CoT 的关键部分，AI 解释推理过程，并加入一些先前的对话示例（Few-Shot Learning）
  const cotTemplate = `作为一个为花店电商公司工作的AI助手，我的目标是帮助客户根据他们的喜好做出明智的决定。 

  我会按部就班的思考，先理解客户的需求，然后考虑各种鲜花的涵义，最后根据这个需求，给出我的推荐。
  同时，我也会向客户解释我这样推荐的原因。
  
  示例 1:
    人类：我想找一种象征爱情的花。
    AI：首先，我理解你正在寻找一种可以象征爱情的花。在许多文化中，红玫瑰被视为爱情的象征，这是因为它们的红色通常与热情和浓烈的感情联系在一起。因此，考虑到这一点，我会推荐红玫瑰。红玫瑰不仅能够象征爱情，同时也可以传达出强烈的感情，这是你在寻找的。
  
  示例 2:
    人类：我想要一些独特和奇特的花。
    AI：从你的需求中，我理解你想要的是独一无二和引人注目的花朵。兰花是一种非常独特并且颜色鲜艳的花，它们在世界上的许多地方都被视为奢侈品和美的象征。因此，我建议你考虑兰花。选择兰花可以满足你对独特和奇特的要求，而且，兰花的美丽和它们所代表的力量和奢侈也可能会吸引你。`;

  const systemPromptRole =
    SystemMessagePromptTemplate.fromTemplate(roleTemplate);
  const systemPromptCot = SystemMessagePromptTemplate.fromTemplate(cotTemplate);

  // 用户的询问
  const humanTemplate = "{human_input}";
  const humanPrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

  // 将以上所有信息结合为一个聊天提示
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemPromptRole,
    systemPromptCot,
    humanPrompt,
  ]);

  // 接收用户的询问，返回回答结果
  const prompt = await chatPrompt.formatMessages({
    human_input:
      "我想为我的女朋友购买一些花。她喜欢粉色和紫色。你有什么建议吗?",
  });
  const response = await llm.predictMessages(prompt);

  return { prompt, response };
}

export default func;
