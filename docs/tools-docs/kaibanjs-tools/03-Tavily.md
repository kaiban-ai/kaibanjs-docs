---
title: Tavily Search
description: Tavily is an advanced search engine optimized for comprehensive, accurate, and trusted results.
---

# Tavily Search Results Tool

## Description

[Tavily](https://tavily.com/) is an advanced search engine specifically designed for AI applications. It excels at providing comprehensive and accurate search results, with a particular focus on current events and real-time information.

![Tavily Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1731856690/Tavily_aipoyp.png)

:::tip[Try it in the Kaiban Board!]
Want to see this tool in action? Check out our interactive Kaiban Board! [Try it now!](https://www.kaibanjs.com/share/mffyPAxJqLi9s5H27t9p)
:::

Enhance your agents with:
- **Trusted Results**: Get accurate and reliable search results
- **Real-Time Information**: Access current events and up-to-date data
- **LLM-Ready Output**: Receive well-structured JSON data ready for consumption
- **Smart Filtering**: Benefit from content relevance scoring and filtering

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure that you have created an API Key at [Tavily](https://tavily.com/) to enable search functionality.

## Example

Utilize the Tavily Search Results tool as follows to enable your agent to search for current information:

```js
import { TavilySearchResults } from '@kaibanjs/tools';

const tavilyTool = new TavilySearchResults({ 
    apiKey: 'your-tavily-api-key',
    maxResults: 5 
});

const newsAnalyzer = new Agent({
    name: 'Sarah', 
    role: 'News Analyst', 
    goal: 'Find and analyze current events and trending topics', 
    background: 'Research Specialist',
    tools: [tavilyTool]
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [Tavily](https://tavily.com/). Provide your API key directly as a string.
- `maxResults` **Optional**. The maximum number of search results to return. Defaults to `5`.


:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::