---
title: Serper Tool
description: Serper is a versatile search engine tool that supports a wide range of search types, including general search, image search, video search, and more.
---

# Serper Tool

## Description

[Serper](https://serper.dev/) is a versatile search engine tool that supports a wide range of search types, including general search, image search, video search, and more. This tool is exclusively available for use in the [KaibanJS Playground](https://www.kaibanjs.com/playground).

Enhance your agents with:
- **Flexible Search Capabilities**: Supports various search types such as general search, image search, video search, location-based search, and more.
- **Dynamic Query Handling**: Automatically adjusts the request parameters based on the specified search type.

## Installation

No installation is required for this tool as it is available directly in the [KaibanJS Playground](https://www.kaibanjs.com/playground). However, you must sign up at [Serper](https://serper.dev/) to obtain an API key.

## Example

Utilize the SerperTool as follows to enable your agent to perform searches with various types:

```js
// No need to import; available in the KaibanJS Playground
const tool = new SerperTool({
  apiKey: "ENV_SERPER_API_KEY",
  type: "webpage"
});

const contentScraper = new Agent({
    name: 'Alice', 
    role: 'Content Scraper', 
    goal: 'Scrape and analyze relevant information from specified web pages.', 
    background: 'Web Analyst',
    tools: [tool]
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [Serper](https://serper.dev/). Set `'ENV_SERPER_API_KEY'` as an environment variable or replace it directly with your API key.
- `type` **Optional**. The type of search to perform. Available options include:
  - `"search"` (default): For general search queries.
  - `"images"`: For image search.
  - `"videos"`: For video search.
  - `"places"`: For location-based search.
  - `"maps"`: For map search.
  - `"news"`: For news search.
  - `"shopping"`: For shopping search.
  - `"scholar"`: For academic publications search.
  - `"patents"`: For patents search.
  - `"webpage"`: For scraping webpages. *Note: The Scraper option is in Beta and may be subject to changes.*

This tool dynamically adjusts the request URL and body based on the specified type, making it versatile for various search needs.
