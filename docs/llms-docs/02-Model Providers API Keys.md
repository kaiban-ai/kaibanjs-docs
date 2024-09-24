---
title: Model Providers API Keys
description: Learn how to manage API keys for different language model providers in KaibanJS.
---

When working with multiple language models in KaibanJS, you need to manage API keys for different providers. This guide explains two approaches to configuring API keys: directly in the `llmConfig` of each agent, or globally through the `env` property when creating a team.

:::warning[API Key Security]
Always use environment variables for API keys instead of hardcoding them. This enhances security and simplifies key management across different environments.

**Example:**
```javascript
apiKey: process.env.YOUR_API_KEY
```

Never commit API keys to version control. Use a `.env` file or a secure secrets management system for sensitive information.

Please refer to [API Keys Management](/how-to/API%20Key%20Management) to learn more about handling API Keys safely.
:::

## Specifying API Keys Directly in llmConfig

You can include the API key directly in the `llmConfig` of each agent. This method is useful when agents use different providers or when you prefer to encapsulate the key with the agent configuration.

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

## Using the `env` Property for Team-Wide Configuration

If all agents in your team use the same AI provider, or you prefer a centralized location for managing API keys, use the `env` property when defining the team. This method simplifies management, especially when using environment variables or configuration files.

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

## Choosing the Right Approach

Both approaches for managing API keys are valid, and the choice between them depends on your project's structure and your preference for managing API keys.

- Use the `llmConfig` approach when:
  - Your agents use different providers
  - You want to keep API keys closely associated with specific agents
  - You need fine-grained control over API key usage

- Use the `env` property approach when:
  - All or most agents use the same provider
  - You prefer centralized management of API keys
  - You're using environment variables or configuration files for sensitive information

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::