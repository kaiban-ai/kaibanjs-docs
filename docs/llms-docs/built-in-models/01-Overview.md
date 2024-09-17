---
title: Overview
description: An introduction to pre-integrated Language Models in KaibanJS
---

> KaibanJS offers seamless integration with several leading LLM providers, allowing you to quickly implement powerful AI capabilities in your applications.

## What are Built-in Models?

Built-in models in KaibanJS are pre-integrated language models that require minimal setup to use. These models are ready to go with just a few lines of configuration, making it easy to get started with AI-powered agents.

## Available Built-in Models

KaibanJS currently supports the following built-in models:

1. **OpenAI**: Access to state-of-the-art models like GPT-4 and GPT-3.5-turbo.
2. **Anthropic**: Integration with Claude models, known for their strong performance and safety features.
3. **Google**: Utilize Google's Gemini models, offering cutting-edge natural language processing capabilities.
4. **Mistral**: Leverage Mistral AI's efficient language models, designed for various NLP tasks.

## Key Benefits

- **Easy Setup**: Minimal configuration required to start using these models.
- **Consistent API**: Uniform interface across different model providers.
- **Automatic Updates**: Stay current with the latest model versions and features.

## Getting Started

To use a built-in model, simply specify the provider and model name in your agent's `llmConfig`:

```javascript
const agent = new Agent({
    name: 'AI Assistant',
    role: 'Helper',
    llmConfig: {
        provider: 'openai',  // or 'anthropic', 'google', 'mistral'
        model: 'gpt-4',      // specific model name
    }
});
```

Explore the individual model pages for detailed setup instructions and advanced configuration options.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::