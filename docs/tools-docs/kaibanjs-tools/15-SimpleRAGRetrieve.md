---
title: Simple RAG Retrieve Tool
description: Simple RAG Retrieve Tool is a specialized RAG implementation that works with pre-loaded vector stores for efficient question-answering systems.
---

# Simple RAG Retrieve Tool

## Description

Simple RAG Retrieve Tool is a specialized Retrieval-Augmented Generation (RAG) tool designed for scenarios where you have pre-loaded data in a vector store. Unlike the standard SimpleRAG tool, this tool requires a VectorStore instance with existing data and focuses on retrieving and answering questions about previously stored information.

![Simple RAG Retrieve Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1733521442/SimpleRAG_df8buq.png)

Key features:

- **Pre-loaded Data Support**: Works with existing vector stores containing processed data
- **Flexible Vector Store Integration**: Supports various vector store implementations
- **Customizable Components**: Configure embeddings, retrieval options, and language models
- **Efficient Retrieval**: Optimized for querying pre-existing knowledge bases

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key

Before using the tool, ensure you have an OpenAI API key to enable the RAG functionality.

## Basic Example

Here's how to use the SimpleRAGRetrieve tool with a pre-loaded vector store:

```js
import { SimpleRAGRetrieve } from '@kaibanjs/tools';
import { MemoryVectorStore } from '@langchain/community/vectorstores/memory';
import { Agent, Task, Team } from 'kaibanjs';

// Create a vector store with pre-loaded data
const vectorStore = new MemoryVectorStore();

// Create the tool instance
const simpleRAGRetrieveTool = new SimpleRAGRetrieve({
  OPENAI_API_KEY: 'your-openai-api-key',
  vectorStore: vectorStore
});

// Create an agent with the tool
const knowledgeAssistant = new Agent({
  name: 'Alex',
  role: 'Knowledge Assistant',
  goal: 'Answer questions using pre-loaded knowledge base',
  background: 'RAG Specialist',
  tools: [simpleRAGRetrieveTool]
});

// Create a task for the agent
const answerQuestionsTask = new Task({
  description: 'Answer questions using the pre-loaded vector store data',
  expectedOutput: 'Accurate answers based on the stored knowledge base',
  agent: knowledgeAssistant
});

// Create a team
const ragTeam = new Team({
  name: 'RAG Retrieval Team',
  agents: [knowledgeAssistant],
  tasks: [answerQuestionsTask],
  inputs: {
    query: 'What questions would you like to ask about the stored data?'
  },
  env: {
    OPENAI_API_KEY: 'your-openai-api-key'
  }
});
```

## Advanced Example with Pinecone

For production use cases, you can configure SimpleRAGRetrieve with a custom Pinecone vector store:

```js
import { SimpleRAGRetrieve } from '@kaibanjs/tools';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

// Configure embeddings
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small'
});

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Get existing index
const pineconeIndex = pinecone.Index('your-index-name');
const pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex
});

// Create the tool with custom configuration
const simpleRAGRetrieveTool = new SimpleRAGRetrieve({
  OPENAI_API_KEY: 'your-openai-api-key',
  chunkOptions: {
    chunkSize: 1000,
    chunkOverlap: 200
  },
  embeddings: embeddings,
  vectorStore: pineconeVectorStore,
  retrieverOptions: {
    k: 4,
    searchType: 'similarity',
    scoreThreshold: 0.7,
    filter: undefined // Can be used for metadata filtering
  }
});

// Use the tool
const result = await simpleRAGRetrieveTool._call({
  query: 'Your question here'
});
console.log(result);
```

## Components

The SimpleRAGRetrieve tool uses the following langchain components by default:

- **OpenAIEmbeddings**: For generating embeddings
- **MemoryVectorStore**: For storing and retrieving vectors
- **ChatOpenAI**: As the language model
- **RecursiveCharacterTextSplitter**: For chunking documents
- **TextInputLoader**: For loading text input
- **RetrieverOptions**: For overriding retrieval options

All components can be customized by passing different instances or options when creating the tool.

## Parameters

- `OPENAI_API_KEY` **Required**. Your OpenAI API key for embeddings and completions.
- `vectorStore` **Required**. A VectorStore instance with pre-loaded data.
- `embeddings` **Optional**. Custom embeddings instance (defaults to OpenAIEmbeddings).
- `chunkOptions` **Optional**. Configuration for text chunking (size and overlap).
- `retrieverOptions` **Optional**. Configuration for retrieval behavior:
  - `k`: Number of documents to retrieve (default: 4)
  - `searchType`: Type of search ('similarity' or 'mmr')
  - `scoreThreshold`: Minimum similarity score threshold
  - `filter`: Metadata filter for document retrieval

## Input Format

The tool expects a JSON object with a "query" field containing the question to ask:

```js
{
  "query": "Your question here"
}
```

## Output

The tool returns the answer to the question, generated using the RAG approach based on the pre-loaded vector store data.

## Server-Side Considerations

:::warning[Important]
Many integrations with the `langchain` library, including Pinecone, only work server-side. Ensure your environment supports server-side execution when using these integrations.
:::

## Differences from SimpleRAG

| Feature      | SimpleRAG                                | SimpleRAGRetrieve                 |
| ------------ | ---------------------------------------- | --------------------------------- |
| Data Source  | Processes new content                    | Uses pre-loaded vector store      |
| Vector Store | Optional (defaults to MemoryVectorStore) | Required parameter                |
| Use Case     | Quick RAG setup with new content         | Querying existing knowledge bases |
| Flexibility  | Content-focused                          | Retrieval-focused                 |

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
