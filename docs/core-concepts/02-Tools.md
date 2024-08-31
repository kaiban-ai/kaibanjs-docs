---
title: Tools
description: What are Tools and how to use them.
---

## What is a Tool?

> A Tool is a skill or function that agents can utilize to perform various actions:
>
> - Search on the Internet
> - Calculate data or predictions
> - Automate data entry tasks
>
> This includes tools from the [LangChain Tools](https://python.langchain.com/docs/integrations/tools), enabling everything from simple searches to complex interactions and effective teamwork among agents.

### Example: Integrating a Search Tool

To demonstrate the utility of tools, we will integrate a search tool into an agent, enabling it to fetch up-to-date information based on a given query.

Before using the tool, install the necessary package from npm:

```bash
npm i @langchain/community
```

#### Step 1: Define the Tool

First, define the search tool with necessary configurations, including maximum results and API key.

```js
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

const searchTool = new TavilySearchResults({
    maxResults: 1,
    apiKey: 'ENV_TRAVILY_API_KEY',
});
```

#### Step 2: Create the Agent

Create an agent named 'Scout', designed to gather information using the defined search tool.

```js
import { Agent } from 'kaibanjs';

const searchAgent = new Agent({
    name: 'Scout',
    role: 'Information Gatherer',
    goal: 'Find up-to-date information about the given sports query.',
    background: 'Research',
    tools: [searchTool],
});
```

### Integration with LangChain Tools

KaibanJS seamlessly integrates with a variety of [LangChain compatible tools](https://js.langchain.com/v0.2/docs/integrations/tools), empowering your AI agents with capabilities ranging from web browsing and image generation to interacting with cloud services and executing Python code. These tools enrich the agents' functionality, allowing them to perform specialized tasks efficiently and effectively.

Here are some of the tools available for integration:

- **[Tavily Search](https://js.langchain.com/v0.2/docs/integrations/tools/tavily_search/)**: Enhances your agents with robust search capabilities.
- **[Dall-E Tool](https://js.langchain.com/v0.2/docs/integrations/tools/dalle/)**: Enables agents to create images using OpenAI's Dall-E.
- **[Discord Tool](https://js.langchain.com/v0.2/docs/integrations/tools/discord/)**: Allows agents to interact with Discord channels.
- **[Google Calendar Tool](https://js.langchain.com/v0.2/docs/integrations/tools/google_calendar/)**: Manage Google Calendar events.
- **[WolframAlpha Tool](https://js.langchain.com/v0.2/docs/integrations/tools/wolframalpha/)**: Utilizes WolframAlpha for computational intelligence.

These tools provide your agents with the flexibility to perform tasks that are otherwise outside the scope of typical AI functionalities, making them more versatile and capable of handling complex workflows.

### Benefits of Tool Integration

Integrating tools into your agents provides several advantages:
- **Enhanced Precision**: Equip agents with specific skills for accurate task performance.
- **Increased Efficiency**: Streamline operations with automated tools for data and calculations.
- **Expanded Capabilities**: Allow agents to undertake a broader range of activities, from data retrieval to analytical tasks.

For detailed guidance on specific tools and their configurations, refer to the individual tool documentation. This structured approach ensures your agents are equipped with the necessary tools to excel in their designated tasks, enhancing both their functionality and productivity.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
