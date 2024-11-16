---
title: Exa Search
description: Exa is an AI-powered search API that provides comprehensive research capabilities with neural search and content summarization.
---

# Exa Search Tool

## Description

[Exa](https://exa.ai/) is an advanced search API that combines neural search with content processing capabilities. It's particularly effective for in-depth research, academic content, and comprehensive data gathering.

Enhance your agents with:
- **Neural Search**: Advanced semantic understanding of search queries
- **Content Processing**: Get full text, summaries, and highlights
- **Auto-prompt Enhancement**: Automatic query improvement
- **Structured Results**: Well-organized content with metadata

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure that you have created an API Key at [Exa](https://exa.ai/) to enable search functionality.

## Example

Here's how to use the Exa tool to create a research and writing team:

```javascript
import { ExaSearch } from '@kaibanjs/tools';

// Configure Exa tool
const exaSearch = new ExaSearch({
  apiKey: 'your-exa-api-key',
  type: 'neural',
  contents: {
    text: true,
    summary: true,
    highlights: true
  },
  useAutoprompt: true,
  limit: 10
});

// Create a research agent
const researcher = new Agent({
  name: 'DataMiner',
  role: 'Research Specialist',
  goal: 'Gather comprehensive information from reliable sources',
  background: 'Expert in data collection and research',
  tools: [exaSearch]
});

// Create a team
const team = new Team({
  name: 'Research Team',
  agents: [researcher],
  tasks: [/* your tasks */],
  inputs: {
    topic: 'Your research topic'
  }
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [Exa](https://exa.ai/). Provide your API key directly as a string.
- `type` **Optional**. The type of search to perform. Options:
  - `'neural'`: Semantic search using AI
  - `'keyword'`: Traditional keyword-based search
  Defaults to `'neural'`.
- `contents` **Optional**. Configure what content to retrieve:
  - `text`: Get full text content
  - `summary`: Get AI-generated summaries
  - `highlights`: Get relevant text highlights
- `useAutoprompt` **Optional**. Enable AI query enhancement
- `limit` **Optional**. Number of results to return. Default is 10.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::