import { z } from "zod";
import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import {
  ConversationChain,
  LLMChain,
  LLMRouterChain,
  MultiPromptChain,
} from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { RouterOutputParser } from "langchain/output_parsers";
import { STRUCTURED_MULTI_PROMPT_ROUTER_TEMPLATE } from "@/../langchain/dist/chains/router/multi_prompt_prompt";
import { interpolateFString } from "@/../langchain/dist/prompts/template";

const structuredOutputParserSchema = z.object({
  destination: z
    .string()
    .optional()
    .describe('name of the question answering system to use or "DEFAULT"'),
  next_inputs: z
    .object({
      input: z
        .string()
        .describe("a potentially modified version of the original input"),
    })
    .describe("input to be fed to the next model"),
});

export async function func() {
  // 构建两个场景的模板
  const flowerCareTemplate = `
  你是一个经验丰富的园丁，擅长解答关于养花育花的问题。
  下面是需要你来回答的问题:
  {input}
  `;

  const flowerDecoTemplate = `
  你是一位网红插花大师，擅长解答关于鲜花装饰的问题。
  下面是需要你来回答的问题:
  {input}
  `;

  // 构建提示信息
  const promptInfos = [
    {
      key: "flowerCare",
      description: "适合回答关于鲜花护理的问题",
      template: flowerCareTemplate,
    },
    {
      key: "flowerDecoration",
      description: "适合回答关于鲜花装饰的问题",
      template: flowerDecoTemplate,
    },
  ];

  // 初始化语言模型
  const llm = new OpenAI(
    {},
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  // 构建目标链
  const chainMap = promptInfos.reduce((rst: any, { key, template }) => {
    const prompt = new PromptTemplate({ template, inputVariables: ["input"] });
    const chain = new LLMChain({ llm, prompt, verbose: true });
    rst[key] = chain;
    return rst;
  }, {});

  // 构建路由链
  const outputParser = new RouterOutputParser(structuredOutputParserSchema);

  const destinations = promptInfos.reduce((rst, info) => {
    rst += `${info.key}: ${info.description} \n`;
    return rst;
  }, "");

  const routerTemplate = interpolateFString(
    STRUCTURED_MULTI_PROMPT_ROUTER_TEMPLATE(
      outputParser.getFormatInstructions({ interpolationDepth: 4 })
    ),
    {
      destinations,
    }
  );

  const routerPrompt = new PromptTemplate({
    template: routerTemplate,
    inputVariables: ["input"],
    outputParser: new RouterOutputParser(structuredOutputParserSchema),
  });

  const routerChain = LLMRouterChain.fromLLM(llm, routerPrompt, {
    verbose: true,
  });

  // 构建默认链
  const defaultChain = new ConversationChain({
    prompt: new PromptTemplate({
      template: "{input}",
      inputVariables: ["input"],
    }),
    llm,
    outputKey: "text",
    verbose: true,
  });

  // 构建多提示链
  const chain = new MultiPromptChain({
    routerChain: routerChain,
    destinationChains: chainMap,
    defaultChain: defaultChain,
    verbose: true,
  });

  const result = await chain.run("如何为玫瑰浇水？");
  // const result = await chain.run("如何为婚礼场地装饰花朵？");
  // const result = await chain.run("如何区分阿豆和罗豆？");

  return { result, routerTemplate };
}

export default func;
