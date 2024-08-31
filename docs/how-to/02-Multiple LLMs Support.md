---
title: Multiple LLMs Support
description: Leverage multiple language models to enhance the capabilities of your AI agents in KaibanJS.
---

> Multiple LLMs Support in KaibanJS allows you to integrate a range of specialized AI models, each expertly tailored to excel in distinct aspects of your projects. By employing various models, you can optimize your AI solutions to achieve more accurate, efficient, and tailored outcomes.

#### Currently Supported Models:

- OpenAI
- Anthropic
- Google
- Mistral

If you require integration with a specific model not yet supported, please submit a request on [GitHub](https://github.com/kaiban-ai/KaibanJS/issues) to help us prioritize future additions.

## Implementing Multiple LLMs

To utilize multiple language learning models (LLMs), you start by configuring each agent with a unique `llmConfig`. This configuration specifies the model provider and the specific model to be used, enabling agents to perform their tasks with precision.

Here’s how to set up agents with different LLM configurations:

```js
import { Agent } from 'kaibanjs';

// Agent with Google's Gemini model
const emma = new Agent({
    name: 'Emma',
    role: 'Initial Drafting',
    goal: 'Outline core functionalities',
    llmConfig: {
        provider: 'google',
        model: 'gemini-1.5-pro',
    }
});

// Agent with Anthropic's Claude model
const lucas = new Agent({
    name: 'Lucas',
    role: 'Technical Specification',
    goal: 'Draft detailed technical specifications',
    llmConfig: {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20240620',
    }
});

// Agent with OpenAI's GPT-4o-mini model
const mia = new Agent({
    name: 'Mia',
    role: 'Final Review',
    goal: 'Ensure accuracy and completeness of the final document',
    llmConfig: {
        provider: 'openai',
        model: 'gpt-4o-mini',
    }
});

```

## Model Providers API Keys...

You can specify the API key for each agent directly in their `llmConfig` or globally through the `env` property when creating the team. Both methods provide flexibility depending on whether all agents use the same provider or different ones. Here’s how you can do it:

### Specifying API Keys Directly in llmConfig

You can include the API key directly in the `llmConfig` of each agent if they use different providers or you prefer to encapsulate the key with the agent configuration.

```js
import { Agent } from 'kaibanjs';

// Agent with Google's Gemini model
const emma = new Agent({
    name: 'Emma',
    role: 'Initial Drafting',
    goal: 'Outline core functionalities',
    llmConfig: {
        provider: 'google',
        model: 'gemini-1.5-pro',
        apiKey: 'ENV_GOOGLE_API_KEY'
    }
});

// Agent with Anthropic's Claude model
const lucas = new Agent({
    name: 'Lucas',
    role: 'Technical Specification',
    goal: 'Draft detailed technical specifications',
    llmConfig: {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20240620',
        apiKey: 'ENV_ANTHROPIC_API_KEY'
    }
});

// Agent with OpenAI's GPT-4 model
const mia = new Agent({
    name: 'Mia',
    role: 'Final Review',
    goal: 'Ensure accuracy and completeness of the final document',
    llmConfig: {
        provider: 'openai',
        model: 'gpt-4o',
        apiKey: 'ENV_OPENAI_API_KEY'
    }
});
```

### Using the `env` Property for Team-Wide Configuration

If all agents in your team use the same AI provider, or you prefer a centralized location for managing API keys, use the `env` property when defining the team. This method simplifies management especially when using environment variables or configuration files.

```js
import { Agent, Task, Team } from 'kaibanjs';

const team = new Team({
    name: 'Multi-Model Support Team',
    agents: [emma, lucas, mia],
    tasks: [], // Define tasks here
    env: {
        OPENAI_API_KEY: 'your-open-ai-api-key',
        ANTHROPIC_API_KEY: 'your-anthropic-api-key',
        GOOGLE_API_KEY: 'your-google-api-key'
    } // Centralized environment variables for the team
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

**Note:** Both approaches are valid, and the choice between them depends on your project's structure and your preference for managing API keys.

## Conclusion
Incorporating multiple LLMs into your KaibanJS framework significantly enhances the versatility and effectiveness of your AI agents. By strategically aligning specific models with the unique needs of each agent, your AI solutions become more robust, capable, and aligned with your project's objectives.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
