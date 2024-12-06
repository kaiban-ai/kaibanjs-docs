---
title: PDF RAG Search
description: PDF RAG Search is a specialized RAG tool for conducting semantic searches within PDF documents.
---

# PDF RAG Search Tool

## Description

PDF RAG Search is a versatile tool that enables semantic search capabilities within PDF documents. It supports both Node.js and browser environments, making it perfect for various PDF analysis scenarios.

![PDF RAG Search Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1733521441/PDFSearch_qkwuun.png)

Enhance your agents with:
- **PDF Processing**: Efficient extraction and analysis of PDF content
- **Cross-Platform**: Works in both Node.js and browser environments
- **Smart Chunking**: Intelligent document segmentation for optimal results
- **Semantic Search**: Find relevant information beyond keyword matching

## Installation

First, install the KaibanJS tools package and the required PDF processing library:

For Node.js:
```bash
npm install @kaibanjs/tools pdf-parse
```

For Browser:
```bash
npm install @kaibanjs/tools pdfjs-dist
```

## API Key
Before using the tool, ensure you have an OpenAI API key to enable the semantic search functionality.

## Example

Here's how to use the PDFSearch tool to enable your agent to search and analyze PDF content:

```js
import { PDFSearch } from '@kaibanjs/tools';
import { Agent, Task, Team } from 'kaibanjs';

// Create the tool instance
const pdfSearchTool = new PDFSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  file: 'https://example.com/documents/sample.pdf'
});

// Create an agent with the tool
const documentAnalyst = new Agent({
    name: 'David', 
    role: 'Document Analyst', 
    goal: 'Extract and analyze information from PDF documents using semantic search', 
    background: 'PDF Content Specialist',
    tools: [pdfSearchTool]
});

// Create a task for the agent
const pdfAnalysisTask = new Task({
    description: 'Analyze the PDF document at {file} and answer: {query}',
    expectedOutput: 'Detailed answers based on the PDF content',
    agent: documentAnalyst
});

// Create a team
const pdfAnalysisTeam = new Team({
    name: 'PDF Analysis Team',
    agents: [documentAnalyst],
    tasks: [pdfAnalysisTask],
    inputs: {
        file: 'https://example.com/documents/sample.pdf',
        query: 'What would you like to know about this PDF?'
    },
    env: {
        OPENAI_API_KEY: 'your-openai-api-key'
    }
});
```

## Advanced Example with Pinecone

For more advanced use cases, you can configure PDFSearch with a custom vector store:

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

const pdfSearchTool = new PDFSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  file: 'https://example.com/documents/sample.pdf',
  embeddings: embeddings,
  vectorStore: vectorStore
});
```

## Parameters

- `OPENAI_API_KEY` **Required**. Your OpenAI API key for embeddings and completions.
- `file` **Required**. URL or local path to the PDF file to analyze.
- `embeddings` **Optional**. Custom embeddings instance (defaults to OpenAIEmbeddings).
- `vectorStore` **Optional**. Custom vector store instance (defaults to MemoryVectorStore).
- `chunkOptions` **Optional**. Configuration for text chunking (size and overlap).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 