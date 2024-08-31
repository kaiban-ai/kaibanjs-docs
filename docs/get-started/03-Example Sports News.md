---
title: Example 1 - Sport News Team
description:  Learn how to use KaibanJS and LangChain Tools to develop a sports news reporting application.
---

Explore how to combine KaibanJS with powerful LangChain tools to create a sophisticated sports news reporting team. This example demonstrates setting up agents that gather up-to-date sports information and generate comprehensive sports articles.

:::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.kaibanjs.com/share/9lyzu1VjBFPOl6FRgNWu)
:::

## Setup

#### Install KaibanJS via npm:

```bash
npm install kaibanjs
```

#### Install LangChain Tools:

```bash
npm install @langchain/community
```

#### Import KaibanJS in your JavaScript file:

```js
// Using ES6 import syntax for NextJS, React, etc.
import { Agent, Task, Team } from 'kaibanjs';
```

```js
// Using CommonJS syntax for NodeJS
const { Agent, Task, Team } = require("kaibanjs");
```

## Example Usage

This example shows how to construct a dynamic team capable of generating timely and engaging sports news articles. By leveraging specific tools and the expertise of specialized agents, the system autonomously searches for sports data and crafts detailed narratives.

```js
import { Agent, Task, Team } from 'kaibanjs';

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Define tools
const searchTool = new TavilySearchResults({
    maxResults: 1,
    apiKey: 'ENV_TRAVILY_API_KEY',
});

// Define agents
const searchAgent = new Agent({
    name: 'Scout',
    role: 'Information Gatherer',
    goal: 'Find up-to-date information about the given sports query.',
    background: 'Research',
    tools: [searchTool],
});

const contentCreator = new Agent({
    name: 'Writer',
    role: 'Content Creator',
    goal: 'Generate a comprehensive articles about any sports event.',
    background: 'Journalism',
    tools: [searchTool]    
});

// Define tasks
const searchTask = new Task({
    description: `Search for detailed information about the sports query: {sportsQuery}.`,
    expectedOutput: 'Detailed information about the sports event. Key players, key moments, final score and other usefull information.',
    agent: searchAgent
});

const writeTask = new Task({
    description: `Using the gathered information, write a detailed article about the sport event.`,
    expectedOutput: 'A well-structured and engaging sports article. With a title, introduction, body, and conclusion. Markdown format.',
    agent: contentCreator
});

// Team to coordinate the agents
const team = new Team({
    name: 'Sports News Team',
    agents: [searchAgent,contentCreator ],
    tasks: [searchTask, writeTask],
    inputs: { sportsQuery: 'Who won the Copa America in 2024?' },
    env: {OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'}
});

// Listen to the workflow status changes
// team.onWorkflowStatusChange((status) => {
//   console.log("Workflow status:", status);
// });

team.start()
  .then((output) => {
    console.log("Workflow status:", output.status);
    console.log("Result:", output.result);
  })
  .catch((error) => {
    console.error("Workflow encountered an error:", error);
  });
```

## Conclusion

This example demonstrates how KaibanJS, combined with LangChain tools, efficiently automates sports news generation. By leveraging specialized agents and external tools, developers can create versatile, AI-powered applications tailored to specific tasks, enhancing both productivity and content quality.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::