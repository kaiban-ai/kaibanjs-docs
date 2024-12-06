---
title: Website RAG Search
description: Website RAG Search is a specialized RAG tool for conducting semantic searches within website content.
---

# Website RAG Search Tool

## Description

Website RAG Search is a powerful tool that enables semantic search capabilities within website content. It combines HTML parsing with RAG technology to provide intelligent answers based on web content.

![Website RAG Search Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1733521441/WebsiteSearch_uy83jj.png)

Enhance your agents with:
- **Smart Web Parsing**: Efficiently extracts and processes web content
- **Semantic Search**: Find relevant information beyond keyword matching
- **HTML Support**: Built-in HTML parsing with cheerio
- **Flexible Configuration**: Customize embeddings and vector stores for your needs

## Installation

First, install the KaibanJS tools package and cheerio:

```bash
npm install @kaibanjs/tools cheerio
```

## API Key
Before using the tool, ensure you have an OpenAI API key to enable the semantic search functionality.

## Example

Here's how to use the WebsiteSearch tool to enable your agent to search and analyze web content:

```js
import { WebsiteSearch } from '@kaibanjs/tools';
import { Agent, Task, Team } from 'kaibanjs';

// Create the tool instance
const websiteSearchTool = new WebsiteSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  url: 'https://example.com'
});

// Create an agent with the tool
const webAnalyst = new Agent({
    name: 'Emma', 
    role: 'Web Content Analyst', 
    goal: 'Extract and analyze information from websites using semantic search', 
    background: 'Web Content Specialist',
    tools: [websiteSearchTool]
});

// Create a task for the agent
const websiteAnalysisTask = new Task({
    description: 'Search and analyze the content of {url} to answer: {query}',
    expectedOutput: 'Detailed answers based on the website content',
    agent: webAnalyst
});

// Create a team
const webSearchTeam = new Team({
    name: 'Web Analysis Team',
    agents: [webAnalyst],
    tasks: [websiteAnalysisTask],
    inputs: {
        url: 'https://example.com',
        query: 'What would you like to know about this website?'
    },
    env: {
        OPENAI_API_KEY: 'your-openai-api-key'
    }
});
```

## Advanced Example with Pinecone

For more advanced use cases, you can configure WebsiteSearch with a custom vector store:

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

const websiteSearchTool = new WebsiteSearch({
  OPENAI_API_KEY: 'your-openai-api-key',
  url: 'https://example.com',
  embeddings: embeddings,
  vectorStore: vectorStore
});
```

## Parameters

- `OPENAI_API_KEY` **Required**. Your OpenAI API key for embeddings and completions.
- `url` **Required**. The website URL to search within.
- `embeddings` **Optional**. Custom embeddings instance (defaults to OpenAIEmbeddings).
- `vectorStore` **Optional**. Custom vector store instance (defaults to MemoryVectorStore).
- `chunkOptions` **Optional**. Configuration for text chunking (size and overlap).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 