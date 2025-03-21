---
title: Agents
description: What are Agents and how to use them.
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/uQxzZu9YlkA?si=LIi8xzyt6GkGe-Io" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></iframe>
</div>

## What is an Agent?

> An agent is an **autonomous entity** designed to:
>
> - Execute specific tasks
> - Make independent decisions
> - Interact with other agents
>
> Consider an agent as a specialized team member, equipped with unique skills and designated responsibilities. Agents can assume various roles such as 'Developer', 'Tester', or 'Project Manager', each playing a crucial part in achieving the team's collective objectives.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Creating an Agent

To create an agent, you start by initializing an instance of the `Agent` class with the necessary properties. Here's how you can do it:

```js
import { Agent } from 'kaibanjs';

const searchAgent = new Agent({
    name: 'Scout',
    role: 'Information Gatherer',
    goal: 'Find up-to-date information about the given sports query.',
    background: 'Research',
    tools: [searchTool],
    kanbanTools: ['block_task'], // Optional: Enable workflow control tools like 'block_task'
});
```

## Agent Attributes


#### `name`
A descriptive or friendly identifier for easier recognition of the agent.

- **Type:** String
- **Example:** *Jonh Smith*

#### `role`
Defines the agent's function within the team, determining the kind of tasks it is best suited for.
- **Type:** String
- **Example:** *Coordinator*

#### `goal`
Specifies the individual objective the agent aims to achieve, guiding its decision-making process.
- **Type:** String
- **Example:** *Achieve sales target*

#### `background`
Provides context that enriches the agent's role and goal, enhancing interaction and collaboration dynamics.
- **Type:** String
- **Example:** *Has extensive experience in market analysis and strategic planning*

#### `tools`
A set of capabilities or functions the agent can use, initialized with a default empty list.
- **Type:** Array of `Tool` objects.
- **Example:** *[SearchTool, CalculatorTool, etc]*
- **Default:** []

#### `kanbanTools` (optional)
Special tools for workflow control and task management, such as task blocking.
- **Type:** Array of strings
- **Example:** *['block_task']*
- **Default:** []
- **Available Tools:** See [Kanban Tools](../how-to/09-Kanban-Tools.md) for details and usage

#### `llmConfig` (optional)
Configures the underlying language model used by the agent.

- **Type:** Object

```js
/**
 * 
 * @property {('openai' | 'google' | 'anthropic' | 'mistral')} provider - The provider of the language model, defaults to "openai".
 * @property {string} model - Specific language model to use, defaults to "gpt-4o-mini".
 * @property {number} maxRetries - Number of retries for calling the model, defaults to 1.
 * @property {string} apiBaseUrl - Optional custom endpoint URL for the LLM API.
 *
 */
{
  provider: "openai",  // Default provider
  model: "gpt-4o-mini",  // Default model
  maxRetries: 1,  // Default number of retries
  apiBaseUrl: "https://your-custom-llm-endpoint.com"  // Optional: Custom LLM endpoint URL
};
```

The `apiBaseUrl` field allows you to specify a custom endpoint for the LLM API. This is particularly useful when:
- Using a proxy server for API calls
- Working with self-hosted models
- Implementing custom routing or load balancing
- Dealing with regional API endpoints

**Note:** All properties within `llmConfig` are passed to the language model constructor using the Langchain standard. For detailed information on how these properties are utilized, refer to the [Langchain Model Constructor Documentation](https://v02.api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html).

#### `maxIterations` (optional)
Specifies the maximum number of iterations the agent is allowed to perform before stopping, controlling execution length and preventing infinite loops.
- **Type:** Integer
- **Example:** *25, 50, etc*
- **Default:** `10`

#### `forceFinalAnswer`
Controls whether the agent should deliver a final answer as it approaches the maximum number of allowed iterations. This is useful in scenarios where the agent has a satisfactory answer but might otherwise continue refining it.
- **Type:** Boolean
- **Example:** `false`
- **Default:** `true`

#### `status`
Indicates the current operational state of the agent. This property is read-only and provides insights into the agent's lifecycle within tasks.
- **Type:** Enum (Read-only)
- **Example:** *[INITIAL, THINKING, EXECUTING_ACTION, etc]*
- **Enum Defined At:** [Agent Status Definitions](https://github.com/kaiban-ai/KaibanJS/blob/main/src/utils/enums.js#L1)

#### `id`
A unique identifier for the agent, autogenerated by the system. This property is read-only.
- **Type:** String (Read-only)
- **Example:** `"579db4dd-deea-4e09-904d-a436a38e65cf"`

## Conclusion
Agents are the building blocks of the KaibanJS framework. By understanding how to define and interact with agents, you can create sophisticated AI systems that leverage the power of collaborative intelligence.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
