// transformer.js 文档
// https://huggingface.co/docs/transformers.js/main/en/api/tokenizers
// https://huggingface.co/docs/transformers.js/main/en/api/models

import {
  AutoTokenizer,
  AutoModel,
  AutoModelForCausalLM,
} from "@xenova/transformers";

export async function func() {
  const modelID = "Xenova/llama2.c-stories42M";

  // 加载预训练模型的分词器
  const tokenizer = await AutoTokenizer.from_pretrained(modelID);

  // 加载预训练的模型
  const model = await AutoModelForCausalLM.from_pretrained(modelID);

  // 定义一个提示，希望模型基于此提示生成故事
  const prompt = "give me a story about Rose.";

  // 使用分词器将提示转化为模型可以理解的格式
  const inputs = await tokenizer(prompt, {
    return_tensors: "pt",
  });

  // 将生成的令牌解码成文本，并跳过任何特殊的令牌，例如[CLS], [SEP]等
  const outputs = await model.generate(inputs.input_ids);

  const response = tokenizer.decode(outputs[0], {
    skip_special_tokens: true,
  });

  return response;
}

export default func;
