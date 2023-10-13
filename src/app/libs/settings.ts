/** @format */

export function getOpenAIKey() {
  return process.env.OPENAI_API_KEY;
}

export function getOpenAIBaseURL() {
  return process.env.OPENAI_API_BASE;
}

export function getHuggingFaceToken() {
  return process.env.HUGGINGFACEHUB_API_TOKEN;
}
