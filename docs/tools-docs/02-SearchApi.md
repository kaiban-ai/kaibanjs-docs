---
title: SearchApi Tool
description: SearchApi is a versatile search engine API that allows developers to integrate search capabilities into their applications.
---

# SearchApi Tool

## Description

[SearchApi](https://www.searchapi.io/) is a versatile search engine API that allows developers to integrate search capabilities into their applications. It supports various search engines, making it a flexible tool for retrieving relevant information from different sources.

Enhance your agents with:
- **Multi-Engine Search**: Use different search engines like Google News, Bing, and more, depending on your needs.
- **Customizable Queries**: Easily configure your search queries with various parameters to tailor the results.

## Installation

Before using the tool, ensure that you have created an API Key at [SearchApi](https://www.searchapi.io/) to enable search functionality.

## Example

Utilize the SearchApi tool as follows to enable your agent to perform searches with customizable engines:

```js
import { SearchApi } from '@langchain/community/tools/searchapi';

const searchTool = new SearchApi('ENV_SEARCH_API_KEY', {
  engine: "google_news",
});

const informationRetriever = new Agent({
    name: 'Mary', 
    role: 'Information Retriever', 
    goal: 'Gather and present the most relevant and up-to-date information from various online sources.', 
    background: 'Search Specialist',
    tools: [searchTool]
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [SearchApi](https://www.searchapi.io/). Set `'ENV_SEARCH_API_KEY'` as an environment variable or replace it directly with your API key.
- `engine` **Optional**. The search engine you want to use. Some options include `"google_news"`, `"bing"`, and others, depending on what is supported by SearchApi.
