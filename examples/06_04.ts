// 使用的模型 https://huggingface.co/TheBloke/Llama-2-7b-Chat-GGUF/tree/main
// 机器比较慢，大概需要 5 分钟左右

import { LlamaCpp } from "langchain/llms/llama_cpp";
import path from "path";

export async function func() {
  const modelPath = path.resolve("models", "./llama-2-7b-chat.Q2_K.gguf");

  const model = new LlamaCpp({ modelPath });

  const response = await model.call(
    "昨天有一个客户抱怨他买了花给女朋友之后，两天花就枯了，你说作为客服我应该怎么解释？"
  );

  return response;
}

export default func;
