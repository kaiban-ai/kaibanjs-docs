---
title: Overview
description: An introduction to integrating additional Language Models with KaibanJS
---

> KaibanJS supports integration with a variety of additional LLM providers and services, allowing you to expand your AI capabilities beyond the built-in options.

## What are Custom Integrations?

Custom integrations in KaibanJS allow you to use language models that aren't pre-integrated into the framework. These integrations require some additional setup but offer greater flexibility and access to specialized models.

## Available Custom Integrations

KaibanJS supports custom integrations with:

1. **Ollama**: Run open-source models locally.
2. **Cohere**: Access Cohere's suite of language models.
3. **Azure OpenAI**: Use OpenAI models through Azure's cloud platform.
4. **Cloudflare**: Integrate with Cloudflare's AI services.
5. **Groq**: Utilize Groq's high-performance inference engines.
6. **Other Integrations**: Explore additional options for specialized needs.

## Key Benefits

- **Flexibility**: Choose from a wider range of model providers.
- **Local Deployment**: Options for running models on your own infrastructure.
- **Specialized Models**: Access to models optimized for specific tasks or industries.

## Getting Started

To use a custom integration, you'll typically need to import the specific LLM package and configure it before passing it to your agent:

```javascript
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

Explore the individual integration pages for detailed setup instructions and configuration options for each supported LLM.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::