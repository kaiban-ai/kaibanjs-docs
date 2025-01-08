---
title: Multiple LLMs Support
description: Leverage multiple language models to enhance the capabilities of your AI agents in KaibanJS.
---

> Multiple LLMs Support in KaibanJS allows you to integrate a range of specialized AI models, each expertly tailored to excel in distinct aspects of your projects. By employing various models, you can optimize your AI solutions to achieve more accurate, efficient, and tailored outcomes.

:::tip[Tip]
Please refer to [LLMs Docs](/category/llms-docs) for a comprehensive overview of KaibanJS support for LLMs.
:::

## Implementing Multiple LLMs

### Using Built-in Models

To utilize multiple built-in language models (LLMs), you start by configuring each agent with a unique `llmConfig`. This configuration specifies the model provider and the specific model to be used, enabling agents to perform their tasks with precision.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

Here's how to set up agents with different LLM configurations:

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
        apiKey: 'YOUR_API_KEY', // You can also set the API key globally through the env property when creating the team
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
        apiKey: 'YOUR_API_KEY', // You can also set the API key globally through the env property when creating the team
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
        apiKey: 'YOUR_API_KEY', // You can also set the API key globally through the env property when creating the team
    }
});
```

### Using Custom Integrations

For custom integrations, you'll need to import and configure the specific LLM before passing it to your agent:

```js
import { SomeLLM } from "some-llm-package";

const customLLM = new SomeLLM({
    // LLM-specific configuration
});

const agent = new Agent({
    name: 'Custom AI Assistant',
    role: 'Specialized Helper',
    llmInstance: customLLM
});
```

## Model Providers API Keys

> You can specify the API key for each agent directly in their `llmConfig` or globally through the `env` property when creating the team. Both methods provide flexibility depending on whether all agents use the same provider or different ones.

Please refer to [Model Providers API Keys](/llms-docs/Model%20Providers%20API%20Keys) for more details.

## Conclusion
Incorporating multiple LLMs into your KaibanJS framework significantly enhances the versatility and effectiveness of your AI agents. By strategically aligning specific models, including custom integrations, with the unique needs of each agent, your AI solutions become more robust, capable, and aligned with your project's objectives.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::