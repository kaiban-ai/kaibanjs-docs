---
title: Simple RAG Search
description: Simple RAG Search is a foundational RAG implementation tool designed for quick and efficient question-answering systems.
---

# Simple RAG Search Tool

## Description

Simple RAG Search is a powerful Retrieval-Augmented Generation (RAG) tool that provides a streamlined interface for building question-answering systems. It seamlessly integrates with langchain components to deliver accurate and context-aware responses.

![Simple RAG Search Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1733521442/SimpleRAG_df8buq.png)

Enhance your agents with:
- **Quick RAG Setup**: Get started with RAG in minutes using default configurations
- **Flexible Components**: Customize embeddings, vector stores, and language models
- **Efficient Processing**: Smart text chunking and processing for optimal results
- **OpenAI Integration**: Built-in support for state-of-the-art language models

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure you have an OpenAI API key to enable the RAG functionality.

## Example

Here's how to use the SimpleRAG tool to enable your agent to process and answer questions about text content:

```js
import { SimpleRAG } from '@kaibanjs/tools';
import { Agent, Task, Team } from 'kaibanjs';

// Create the tool instance
const simpleRAGTool = new SimpleRAG({
  OPENAI_API_KEY: 'your-openai-api-key',
  content: 'Your text content here'
});

// Create an agent with the tool
const knowledgeAssistant = new Agent({
    name: 'Alex', 
    role: 'Knowledge Assistant', 
    goal: 'Process text content and answer questions accurately using RAG technology', 
    background: 'RAG Specialist',
    tools: [simpleRAGTool]
});

// Create a task for the agent
const answerQuestionsTask = new Task({
    description: 'Answer questions about the provided content using RAG technology',
    expectedOutput: 'Accurate and context-aware answers based on the content',
    agent: knowledgeAssistant
});

// Create a team
const ragTeam = new Team({
    name: 'RAG Analysis Team',
    agents: [knowledgeAssistant],
    tasks: [answerQuestionsTask],
    inputs: {
        content: 'Your text content here',
        query: 'What questions would you like to ask about the content?'
    },
    env: {
        OPENAI_API_KEY: 'your-openai-api-key'
    }
});
```

## Advanced Example with Pinecone

For more advanced use cases, you can configure SimpleRAG with a custom vector store:

```js
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small'
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const pineconeIndex = pinecone.Index('your-index-name');
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex
});

const simpleRAGTool = new SimpleRAG({
  OPENAI_API_KEY: 'your-openai-api-key',
  content: 'Your text content here',
  embeddings: embeddings,
  vectorStore: vectorStore
});
```

## Parameters

- `OPENAI_API_KEY` **Required**. Your OpenAI API key for embeddings and completions.
- `content` **Required**. The text content to process and answer questions about.
- `embeddings` **Optional**. Custom embeddings instance (defaults to OpenAIEmbeddings).
- `vectorStore` **Optional**. Custom vector store instance (defaults to MemoryVectorStore).
- `chunkOptions` **Optional**. Configuration for text chunking (size and overlap).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 