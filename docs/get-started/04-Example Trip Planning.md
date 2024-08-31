---
title: Example 2 - Trip Planning Team
description: Learn how to assemble a dynamic team for trip planning using AgenticJS and LangChain tools.
---

Explore the process of creating a versatile team capable of planning detailed and personalized trips using the AgenticJS framework and LangChain tools.

:::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.agenticjs.com/share/IeeoriFq3uIXlLkBjXbl)
:::

## Setup

#### Install AgenticJS via npm:

```bash
npm install agenticjs --save
```

#### Install LangChain Tools:

```bash
npm install @langchain/community --save
```

#### Import AgenticJS in your JavaScript file:

```js
// Using ES6 import syntax for NextJS, React, etc.
import { Agent, Task, Team } from 'agenticjs';
```

```js
// Using CommonJS syntax for NodeJS
const { Agent, Task, Team } = require("agenticjs");
```

## Example Usage

This example demonstrates building a dynamic team to automate personalized travel planning. Utilizing specialized agents equipped with search tools, the system identifies ideal travel destinations based on user preferences and crafts detailed travel itineraries.

```js

import { Agent, Task, Team } from 'agenticjs';

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Define tools
const searchTool = new TavilySearchResults({
    maxResults: 3,
    apiKey: 'ENV_TRAVILY_API_KEY',
});

const citySelectorAgent = new Agent({
    name: 'Peter Atlas',
    role: 'City Selection Expert',
    goal: 'Select the best city based on weather, season, and prices',
    background: 'An expert in analyzing travel data to pick ideal destinations',
    type: 'ReactChampionAgent',
    tools: [searchTool],
    maxIterations: 20,
});

const localExpertAgent = new Agent({
    name: 'Sophia Lore',
    role: 'Local Expert at this city',
    goal: 'Provide the BEST insights about the selected city',
    background: `A knowledgeable local guide with extensive information about the city, it's attractions and customs`,
    type: 'ReactChampionAgent',
    tools: [searchTool],
    maxIterations: 5,   
});

const travelConciergeAgent = new Agent({
    name: 'Maxwell Journey',
    role: 'Amazing Travel Concierge',
    goal: `Create the most amazing travel itineraries with budget and packing suggestions for the city`,
    background: `Specialist in travel planning and logistics with decades of experience`,
    type: 'ReactChampionAgent',
    tools: [searchTool],
    maxIterations: 5,   
});

// Define tasks with dynamic input placeholders
const identifyTask = new Task({
    description: `Analyze and select the best city for the trip based on 
    specific criteria such as weather patterns, seasonal events,
    and travel costs. ... 
    Origin: {origin}, City Options: {cities}, 
    Trip Date: {range}, 
    Traveler Interests: {interests}`,
    expectedOutput: `Detailed report on the chosen city,
    including flight costs, 
    weather forecast and attractions`,
    agent: citySelectorAgent
});

const gatherTask = new Task({
    description: `Compile an in-depth guide for the selected city, 
    considering key attractions, local customs, and special events.
    ... Trip Date: {range}, Origin: {origin}, Interests: {interests}`,
    expectedOutput: `A comprehensive city guide,
    rich in cultural insights and practical tips`,
    agent: localExpertAgent
});

const planTask = new Task({
    description: `Develop a full 7-day travel itinerary 
    with detailed daily plans, including places to eat, 
    packing suggestions, and a budget breakdown. ... 
    Trip Date: {range}, Origin: {origin}, Interests: {interests}`,
    expectedOutput: 'A complete expanded travel plan formatted as markdown',
    agent: travelConciergeAgent
});

// Team to coordinate the agents, with dynamic inputs
const team = new Team({
    name: 'Trip Planning Team',
    agents: [citySelectorAgent, localExpertAgent, travelConciergeAgent],
    tasks: [identifyTask, gatherTask, planTask],
    logLevel: 'info',
    inputs: {
        origin: 'New York',
        cities: ['Tokyo', 'Paris', 'Berlin'],
        interests: 'Art and Culture',
        range: '2024-12-01 to 2024-12-15'
    },  // Actual dynamic inputs
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

This example demonstrates how AgenticJS, combined with LangChain tools, efficiently automates sports news generation. By leveraging specialized agents and external tools, developers can create versatile, AI-powered applications tailored to specific tasks, enhancing both productivity and content quality.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/AI-Champions/AgenticJS/issues). We’re all ears!
:::