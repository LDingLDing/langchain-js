import { getOpenAIBaseURL, getOpenAIKey } from "@/app/libs/settings";
import { OpenAIChat } from "langchain/llms/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";

export async function func() {
  const llm = new OpenAIChat(
    {},
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 创建一个用于解析输出的json解析器
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "name of a flower",
    colors: "the colors of this flower",
  });

  // 定义一个用于获取某种花的颜色列表的查询
  const flowerQuery =
    "Generate the charaters for a random flower." +
    parser.getFormatInstructions();

  // const misformatted = await llm.call(flowerQuery);
  // 定义一个格式不正确的输出
  const misformatted =
    "{'name': '康乃馨', 'colors': ['粉红色','白色','红色','紫色','黄色']}";

  // 使用OutputFixingParser创建一个新的解析器，该解析器能够纠正格式不正确的输出
  const newParser = OutputFixingParser.fromLLM(llm, parser);

  // 使用新的解析器解析不正确的输出
  const result = await newParser.parse(misformatted);

  return { misformatted, result };
}

export default func;
