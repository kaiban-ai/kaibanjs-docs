---
title: Firecrawl
description: Firecrawl is a web scraping and crawling service designed to turn websites into LLM-ready data.
---

# Firecrawl Tool

## Description

[Firecrawl](https://www.firecrawl.dev/) is a powerful web scraping and crawling service designed specifically for AI applications. It excels at converting web content into clean, well-formatted data that's optimized for Large Language Models (LLMs).

Enhance your agents with:
- **Dynamic Content Handling**: Scrape websites with dynamic content and JavaScript rendering
- **LLM-Ready Output**: Get clean, well-formatted markdown or structured data
- **Anti-Bot Protection**: Handles rate limits and anti-bot mechanisms automatically
- **Flexible Formats**: Choose between markdown and other structured data formats

<!-- :::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.kaibanjs.com/share/FirecrawlDemo)
::: -->

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure that you have created an API Key at [Firecrawl](https://www.firecrawl.dev/) to enable web scraping functionality.

## Example

Utilize the Firecrawl tool as follows to enable your agent to extract content from websites:

```js
import { Firecrawl } from '@kaibanjs/tools';

const firecrawlTool = new Firecrawl({
  apiKey: `FIRECRAWL_API_KEY`,
  format: 'markdown'
});

const informationRetriever = new Agent({
    name: 'Mary', 
    role: 'Information Retriever', 
    goal: 'Gather and present the most relevant and up-to-date information from various online sources.', 
    background: 'Search Specialist',
    tools: [firecrawlTool]
});
```

## Parameters

- `apiKey` **Required**. The API key generated from [Firecrawl](https://www.firecrawl.dev/). Set `'ENV_FIRECRAWL_API_KEY'` as an environment variable or replace it directly with your API key.
- `format` **Optional**. The output format for the scraped content. Accepts either `'markdown'` (default) or `'html'`.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::