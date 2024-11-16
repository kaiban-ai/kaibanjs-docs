---
title: Serper Search
description: Serper is a Google Search API that provides fast, reliable access to Google search results.
---

# Serper Search Tool

## Description

[Serper](https://serper.dev/) is a powerful Google Search API that provides quick and reliable access to Google search results. It's particularly useful for gathering current news, web content, and comprehensive search data.

Enhance your agents with:
- **Google Search Results**: Access Google's search engine capabilities
- **News Search**: Dedicated news search functionality
- **Multiple Search Types**: Support for web, news, and image searches
- **Structured Data**: Well-formatted JSON responses ready for LLM processing

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure that you have created an API Key at [Serper](https://serper.dev/) to enable search functionality.

## Example

Here's how to use the Serper tool to create a news gathering and processing team:

```javascript
import { Serper } from '@kaibanjs/tools';

// Configure Serper tool
const serperTool = new Serper({
  apiKey: 'your-serper-api-key',
  type: 'news'  // Can be 'news', 'search', or 'images'
});

// Create an agent with the serper tool
const newsGatherer = new Agent({
  name: 'Echo',
  role: 'News Gatherer',
  goal: 'Collect recent news articles about specific events',
  background: 'Journalism',
  tools: [serperTool]
});

// Create a team
const team = new Team({
  name: 'News Research Team',
  agents: [newsGatherer],
  tasks: [/* your tasks */],
  inputs: {
    query: 'Your search query'
  }
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [Serper](https://serper.dev/). Provide your API key directly as a string.
- `type` **Optional**. The type of search to perform. Options:
  - `'news'`: Search news articles
  - `'search'`: Regular web search
  - `'images'`: Image search
  Defaults to `'search'`.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::