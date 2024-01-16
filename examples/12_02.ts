import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { LLMChain } from "langchain/chains";
import { OpenAIChat } from "langchain/llms/openai";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { AgentStep } from "langchain/schema";

export function formatLogToString(
  intermediateSteps: AgentStep[],
  observationPrefix = "Observation: ",
  llmPrefix = "Thought: "
): string {
  const formattedSteps = intermediateSteps.reduce(
    (thoughts, { action, observation }) =>
      thoughts +
      [action.log, `\n${observationPrefix}${observation}`, llmPrefix].join(
        "\n"
      ),
    ""
  );
  return formattedSteps;
}

export async function func() {
  const tools = [new SerpAPI(), new Calculator()];
  const prompt = ZeroShotAgent.createPrompt(tools);

  const llm = new OpenAIChat(
    { temperature: 0 },
    { apiKey: getOpenAIKey(), baseURL: getOpenAIBaseURL() }
  );

  const llmChain = new LLMChain({
    prompt,
    llm,
    // verbose: true,
  });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    verbose: true,
  });

  const response = await executor.invoke({
    input:
      "目前市场上玫瑰花的平均价格是多少？如果我在此基础上加价15%卖出，应该如何定价？",
  });

  return { response };
}
export default func;
