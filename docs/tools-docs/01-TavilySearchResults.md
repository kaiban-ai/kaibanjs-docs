---
title: TavilySearchResults Tool
description: Tavily Search is a platform that offers advanced search capabilities, designed to efficiently retrieve up-to-date information.
---

# TavilySearchResults Tool

## Description

[Tavily](https://app.tavily.com/) is a platform that offers advanced search capabilities, designed to efficiently retrieve up-to-date information.

Enhance your agents with:
- **Custom Search**: Quickly and accurately retrieve relevant search results.
- **Simple Integration**: Easily configure your search tool with adjustable parameters.

## Installation

Before using the tool, make sure to create an API Key at [Tavily](https://app.tavily.com/) to enable search functionality.

## Example

Utilize the TavilySearchResults tool as follows to enable your agent to search for up-to-date information:

```js
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

const searchTool = new TavilySearchResults({
    maxResults: 1,
    apiKey: 'ENV_TRAVILY_API_KEY',
});

const newsAggregator = new Agent({
    name: 'Mary', 
    role: 'News Aggregator', 
    goal: 'Aggregate and deliver the most relevant news and updates based on specific queries.', 
    background: 'Media Analyst',
    tools: [searchTool]
});
```

## Parameters

- `maxResults` **Required**. The maximum number of results you want to retrieve.
- `apiKey` **Required**. The API key generated from [Tavily](https://app.tavily.com/). Set `'ENV_TRAVILY_API_KEY'` as an environment variable or replace it directly with your API key.
