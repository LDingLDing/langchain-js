import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { OpenAIChat } from "langchain/llms/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";

export async function func() {
  const llm = new OpenAIChat(
    {},
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 创建一个用于解析输出的json解析器
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    action: "action to take",
    actionInput: "input to the action",
  });

  // 定义一个提示模板，它将用于向模型提问
  const prompt = new PromptTemplate({
    template: "Answer the user query.\n{format_instructions}\n{query}\n",
    inputVariables: ["query"],
    partialVariables: { format_instructions: parser.getFormatInstructions() },
  });
  const promptValve = await prompt.format({
    query: "What are the colors of Orchid?",
  });

  // 定义一个错误格式的字符串
  // const badResponse = await llm.call(promptValve);
  const badResponse = '{"action": "search"}';

  const fixParser = OutputFixingParser.fromLLM(llm, parser);

  // .parse 方法在一次失败后会自动进行 retryChain
  const parseResult = await fixParser.parse(badResponse);

  return { badResponse, parseResult };
}

export default func;
