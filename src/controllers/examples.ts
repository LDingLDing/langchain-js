import { readFile } from "fs/promises";

export async function getCode(filename: string) {
  const text = await readFile(`./examples/${filename}.ts`, "utf-8");
  return text;
}
