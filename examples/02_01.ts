import fs from "fs";
import path from "path";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { RetrievalQAChain } from "langchain/chains";

import { getOpenAIBaseURL, getOpenAIKey } from "@/libs/settings";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function func() {
  // 1. 加载Documents
  const baseDir = path.resolve("./examples/flower_files");
  const arr = fs.readdirSync(baseDir);
  let documents: Document[] = [];

  for (const filename of arr) {
    const filePath = path.resolve(baseDir, filename);
    if (filename.endsWith(".pdf")) {
      const loader = new PDFLoader(filePath);
      documents = documents.concat(await loader.load());
    } else if (filename.endsWith(".docx")) {
      const loader = new DocxLoader(filePath);
      documents = documents.concat(await loader.load());
    } else if (filename.endsWith(".txt")) {
      const loader = new TextLoader(filePath);
      documents = documents.concat(await loader.load());
    }
  }

  // 2.Split 将Documents切分成块以便后续进行嵌入和向量存储
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 10,
  });
  const chunkedDocuments = await textSplitter.splitDocuments(documents);

  // 3.Store 将分割嵌入并存储在矢量数据库Qdrant中
  const embeddings = new OpenAIEmbeddings(undefined, {
    apiKey: getOpenAIKey(),
    baseURL: getOpenAIBaseURL(),
  });
  const vectorstore = await MemoryVectorStore.fromDocuments(
    chunkedDocuments,
    embeddings
  );

  // 4. Retrieval 准备模型和Retrieval链
  const llm = new ChatOpenAI(
    {
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    },
    {
      apiKey: getOpenAIKey(),
      baseURL: getOpenAIBaseURL(),
    }
  );
  const retrieverFromLLM = MultiQueryRetriever.fromLLM({
    retriever: vectorstore.asRetriever(),
    llm,
  });
  const qaChain = RetrievalQAChain.fromLLM(llm, retrieverFromLLM);

  // 5. Output
  const question = "董事长致辞中提到的企业精神指的是啥？";
  const result = await qaChain.run(question);

  return result;
}

export default func;
