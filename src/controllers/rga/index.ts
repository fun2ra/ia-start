import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { Annotation, StateGraph } from "@langchain/langgraph";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
// Load environment variables from .env file
dotenv.config();

const loader = new PDFLoader("public/assets/insurance.pdf");

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const allSplits = await textSplitter.splitDocuments(docs);

// console.log(allSplits.length);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);

// Index chunks
await vectorStore.addDocuments(allSplits);

// Define prompt for question-answering
const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// Define state for application
const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

// Define application steps
const retrieve = async (state: typeof StateAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(state.question, 10);
  return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
  const messages = await promptTemplate.invoke({
    question: state.question,
    context: docsContent,
  });
  const response = await model.invoke(messages);
  return { answer: response.content };
};

// Compile application and test
const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();


// console.log("Question: ", q);
// console.log("Answer: ", result.answer);


const rga = async (q: string) => {

    const insuranceCategories = {
        question: `What all the possible rate classifications for insurance?`,
      };
      
      const categories = await graph.invoke(insuranceCategories);
      // console.log("Categories: ", categories.answer);
      
      const calculate = {
        question:
          "How it is calculated the risk for a given customer based in his medical data? if is possible give me a formula.",
      };
      const calculated = await graph.invoke(calculate);
      // console.log("Evaluate risk based on: ", calculated.answer);
      
      const context = `Evaluate the risk based in his medical data. If the customer have a invalidating disease for one rate class set the risk as high,
        and evaluate the next category. If the risk is high the customer decline for this rate class.
        ${categories.answer}. Evaluate all possible rate classes.
        For your evaluation use this criteria: ${calculated.answer}.
         I want to know what is the best insurance for him. List the options and give an score for each one, each option in a separated line.
         from recommended to refused. Add check, good or refused emojis to the score. Explain the reason for each score.`;
      
    //   const q =
    //     "I have a customer that have 35 years old. He takes enarapil and he is overweight.";
      
      const inputs = {
        question: q + context,
      };
      
      const result = await graph.invoke(inputs);
      console.log("Question: ", q);
      console.log("Answer: ", result.answer);

    return result;

}

export default rga;