---
title:  How to build a website RAG Tool
description: Learn to enhance your AI projects with the power of Retrieval Augmented Generation (RAG). This step-by-step tutorial guides you through creating the WebRAGTool in KaibanJS, enabling your AI agents to access and utilize web-sourced, context-specific data with ease.
---

In this tutorial, we'll explore how to implement Retrieval Augmented Generation (RAG) by creating a custom tool in KaibanJS. We'll focus on the creation of the `WebRAGTool` and how to integrate it into your code to enhance your AI agents with up-to-date, context-specific information from the web.

:::tip[For the Eager Learners]
Ready to dive straight into the code? You can find the complete project on CodeSandbox by following the link below:

[View the completed project on CodeSandbox](https://stackblitz.com/~/github.com/kaiban-ai/kaibanjs-web-rag-tool-demo)

Feel free to explore the project and return to this tutorial for a detailed walkthrough!
:::

## Introduction

**Retrieval Augmented Generation (RAG)** combines large language models (LLMs) with external data sources to provide more accurate and current information. By retrieving relevant documents and incorporating them into the generation process, RAG enables AI agents to answer queries using the latest available data.

We'll create a custom tool called `WebRAGTool` that:

- Fetches web content from a specified URL.
- Processes and splits the content into manageable chunks.
- Creates a vector store for efficient retrieval.
- Uses an LLM to generate concise answers based on retrieved documents.

## Creating the WebRAGTool

Let's dive into the creation of the `WebRAGTool`, which implements the RAG functionality.

### Step 1: Install and Import Required Dependencies

First, install the necessary dependencies in your project directory:

```bash
npm install kaibanjs @langchain/core @langchain/community @langchain/openai zod cheerio
```

Create a new file `tool.js` and import the necessary modules:

```javascript
import { Tool } from '@langchain/core/tools';
import 'cheerio';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
```

**Explanation:**

- **`Tool`**: Base class for creating custom tools in LangChain.
- **`zod`**: Library for schema validation, used to define and validate input schemas.
- **`CheerioWebBaseLoader`**: Loads and parses web content using Cheerio.
- **`RecursiveCharacterTextSplitter`**: Splits text into chunks, maintaining context with overlaps.
- **`MemoryVectorStore`**: In-memory vector store for embeddings.
- **`OpenAIEmbeddings`**: Generates embeddings using OpenAI's API.
- **`ChatPromptTemplate`**: Creates templates for chat-based prompts.
- **`ChatOpenAI`**: Interface to OpenAI's chat models.
- **`createStuffDocumentsChain`**: Creates a chain that processes documents and generates outputs.
- **`StringOutputParser`**: Parses the output into a string format.

### Step 2: Define the WebRAGTool Class

```javascript
export class WebRAGTool extends Tool {
  constructor(fields) {
    super(fields);
    // Store the URL from which to fetch content
    this.url = fields.url;

    // Define the tool's name and description
    this.name = 'web_rag';
    this.description = `This tool implements Retrieval Augmented Generation (RAG) by dynamically fetching and processing web content from a specified URL to answer user queries. It leverages external web sources to provide enriched responses that go beyond static datasets.`;

    // Define the schema for the input query using Zod for validation
    this.schema = z.object({
      query: z.string().describe('The query for which to retrieve and generate answers.'),
    });
  }

  async _call(input) {
    try {
      // Step 1: Load Content from the Specified URL
      const loader = new CheerioWebBaseLoader(this.url);
      const docs = await loader.load();

      // Step 2: Split the Loaded Documents into Chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);

      // Step 3: Create a Vector Store from the Document Chunks
      const vectorStore = await MemoryVectorStore.fromDocuments(
        splits,
        new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY,
        })
      );

      // Step 4: Initialize a Retriever
      const retriever = vectorStore.asRetriever();

      // Step 5: Define the Prompt Template for the Language Model
      const prompt = ChatPromptTemplate.fromTemplate(`
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:`);

      // Step 6: Initialize the Language Model (LLM)
      const llm = new ChatOpenAI({
        model: 'gpt-4o-mini',
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Step 7: Create the RAG Chain
      const ragChain = await createStuffDocumentsChain({
        llm,
        prompt,
        outputParser: new StringOutputParser(),
      });

      // Step 8: Retrieve Relevant Documents Based on the User's Query
      const retrievedDocs = await retriever.invoke(input.query);

      // Step 9: Generate the Final Response
      const response = await ragChain.invoke({
        question: input.query,
        context: retrievedDocs,
      });

      // Step 10: Return the Generated Response
      return response;
    } catch (error) {
      // Log and rethrow any errors that occur during the process
      console.error('Error running the WebRAGTool:', error);
      throw error;
    }
  }
}
```

### Explanation of the Main Parts

#### **Constructor**

- **Initialization**: Sets up the tool with a specific URL, name, description, and input schema.
- **`this.url`**: Stores the URL from which content will be fetched.
- **`this.name`**: Sets the tool's identifier.
- **`this.description`**: Provides a detailed description of the tool's functionality.
- **Input Schema**: Uses `zod` to define and validate that the input `query` is a string.

#### **_call Method**

This asynchronous method implements the core functionality of the tool.

##### **Step 1: Loading Content**

```javascript
const loader = new CheerioWebBaseLoader(this.url);
const docs = await loader.load();
```

- **Purpose**: Fetches and parses web content from the specified URL.
- **`CheerioWebBaseLoader`**: Loads the HTML content and converts it into a format suitable for processing.

##### **Step 2: Text Splitting**

```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
```

- **Purpose**: Splits the loaded documents into smaller chunks to manage large texts and maintain context.
- **Parameters**:
  - **`chunkSize`**: Approximate size of each text chunk.
  - **`chunkOverlap`**: Overlaps chunks by a certain number of characters to preserve context between them.

##### **Step 3: Vector Store Creation**

```javascript
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  })
);
```

- **Purpose**: Converts text chunks into embeddings and stores them for efficient retrieval.
- **`OpenAIEmbeddings`**: Generates embeddings using the OpenAI API.

##### **Step 4: Retriever Initialization**

```javascript
const retriever = vectorStore.asRetriever();
```

- **Purpose**: Creates a retriever object that can find relevant documents based on the user's query.

##### **Step 5: Prompt Template Definition**

```javascript
const prompt = ChatPromptTemplate.fromTemplate(`
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:`);
```

- **Purpose**: Defines how the language model should formulate its response.
- **Template Variables**:
  - **`{question}`**: The user's query.
  - **`{context}`**: The retrieved documents relevant to the query.

##### **Step 6: LLM Initialization**

```javascript
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
});
```

- **Purpose**: Sets up the language model that will generate the final answer.
- **Model**: Uses OpenAI's `gpt-4o-mini`.

##### **Step 7: RAG Chain Creation**

```javascript
const ragChain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser: new StringOutputParser(),
});
```

- **Purpose**: Creates a chain that processes the retrieved documents and generates an answer.
- **Components**:
  - **`llm`**: The language model to use.
  - **`prompt`**: The prompt template defined earlier.
  - **`outputParser`**: Parses the LLM's output into a string.

##### **Step 8: Document Retrieval**

```javascript
const retrievedDocs = await retriever.getRelevantDocuments(input.query);
```

- **Purpose**: Retrieves documents relevant to the user's query.

##### **Step 9: Response Generation**

```javascript
const response = await ragChain.invoke({
  question: input.query,
  context: retrievedDocs,
});
```

- **Purpose**: Invokes the chain with the question and context to generate an answer.

##### **Step 10: Returning the Response**

```javascript
return response;
```

- **Purpose**: Returns the final, concise answer to the user's query.

### Error Handling

The `_call` method includes a try-catch block to handle any errors that may occur during execution, logging them for debugging purposes.

## Integrating the Tool into Your Code

With the `WebRAGTool` defined, you can integrate it into your application to enhance your AI agents.

### Step 1: Create an Agent that Uses the Tool

In your codebase, you can create an agent that utilizes the `WebRAGTool`:

```javascript
import { Agent } from 'kaibanjs';
import { WebRAGTool } from './tool';

const webRAGTool = new WebRAGTool({
  url: 'https://www.cnbc.com/finance/', // Specify the URL to fetch content from
});

const analystAgent = new Agent({
  name: 'Finley',
  role: 'Financial Analyst',
  goal: 'Research and summarize the latest financial news on a given topic',
  background: 'Expert in financial data analysis and market research',
  tools: [webRAGTool], // Include the WebRAGTool in the agent's tools
});
```

**Explanation:**

- **`webRAGTool`**: An instance of the `WebRAGTool`, initialized with a specific URL.
- **`analystAgent`**: An agent configured to use the `webRAGTool` for answering queries.

## Conclusion

By following this guide, you've learned how to:

- **Create a custom RAG tool** that fetches and processes web content.
- **Understand each component** of the tool and its role in the RAG process.
- **Integrate the tool into an agent** to answer user queries with up-to-date information.
- **Use the agent in your code** to enhance your application's capabilities.

By leveraging Retrieval Augmented Generation, your AI agents can provide more accurate and contextually relevant responses, greatly improving the user experience.

## Feedback

:::tip[We Love Feedback!]
Is there something unclear or quirky in this tutorial? Have a suggestion or spotted an issue? Help us improve by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). Your input is valuable!
:::