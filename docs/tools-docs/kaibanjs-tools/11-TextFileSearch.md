---
title: TextFile RAG Search
description: TextFile RAG Search is a specialized RAG tool for conducting semantic searches within plain text files.
---

# TextFile RAG Search Tool

## Description

TextFile RAG Search is a specialized tool that enables semantic search capabilities within plain text files. It's designed to process and analyze text documents efficiently using RAG technology.

![TextFile RAG Search Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1733521441/TextFileSearch_luicts.png)

Enhance your agents with:
- **Text Processing**: Efficient analysis of plain text documents
- **Smart Chunking**: Intelligent text segmentation for optimal results
- **Semantic Search**: Find relevant information beyond keyword matching
- **Flexible Integration**: Easy integration with existing text workflows

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure you have an OpenAI API key to enable the semantic search functionality.

## Example

Here's how to use the TextFileSearch tool to enable your agent to search and analyze text content:

```js
import { TextFileSearch } from '@kaibanjs/tools';
import { Agent, Task, Team } from 'kaibanjs';

// Create the tool instance
const textSearchTool = new TextFileSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  file: 'https://example.com/documents/sample.txt'
});

// Create an agent with the tool
const textAnalyst = new Agent({
    name: 'Sarah', 
    role: 'Text Analyst', 
    goal: 'Extract and analyze information from text documents using semantic search', 
    background: 'Text Content Specialist',
    tools: [textSearchTool]
});

// Create a task for the agent
const textAnalysisTask = new Task({
    description: 'Analyze the text file at {file} and answer: {query}',
    expectedOutput: 'Detailed answers based on the text content',
    agent: textAnalyst
});

// Create a team
const textAnalysisTeam = new Team({
    name: 'Text Analysis Team',
    agents: [textAnalyst],
    tasks: [textAnalysisTask],
    inputs: {
        file: 'https://example.com/documents/sample.txt',
        query: 'What would you like to know about this text file?'
    },
    env: {
        OPENAI_API_KEY: 'your-openai-api-key'
    }
});
```

## Advanced Example with Pinecone

For more advanced use cases, you can configure TextFileSearch with a custom vector store:

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

const textSearchTool = new TextFileSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  file: 'https://example.com/documents/sample.txt',
  embeddings: embeddings,
  vectorStore: vectorStore
});
```

## Parameters

- `OPENAI_API_KEY` **Required**. Your OpenAI API key for embeddings and completions.
- `file` **Required**. URL or local path to the text file to analyze.
- `embeddings` **Optional**. Custom embeddings instance (defaults to OpenAIEmbeddings).
- `vectorStore` **Optional**. Custom vector store instance (defaults to MemoryVectorStore).
- `chunkOptions` **Optional**. Configuration for text chunking (size and overlap).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 