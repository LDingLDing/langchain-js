import { PromptTemplate } from "langchain/prompts";
import { HuggingFaceInference } from "langchain/llms/hf";
import { LLMChain } from "langchain/chains";
import { getHuggingFaceToken } from "@/app/libs/settings";

export async function func() {
  const llm = new HuggingFaceInference({
    model: "gpt2",
    apiKey: getHuggingFaceToken(),
  });

  const template = `Question: {question}
  Answer: `;

  const prompt = new PromptTemplate({ template, inputVariables: ["question"] });

  const llmChain = new LLMChain({ prompt, llm });

  const response = await llmChain.run("Rose is which type of flower?");

  return response;
}

export default func;
