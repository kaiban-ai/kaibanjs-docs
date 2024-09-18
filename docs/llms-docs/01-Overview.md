---
title: Overview
description: An overview of Language Model support and integration in KaibanJS
---

> KaibanJS provides robust support for a wide range of Language Models (LLMs), enabling you to harness the power of state-of-the-art AI in your applications. This section of the documentation covers both built-in models and custom integrations, giving you the flexibility to choose the best LLM for your specific needs.

## Structure of LLMs Documentation

Our LLMs documentation is organized into two main categories:

1. **Built-in Models**: These are LLMs that come pre-integrated with KaibanJS, offering a streamlined setup process.
2. **Custom Integrations**: These are additional LLMs that require some manual configuration but expand your options for specialized use cases.

### Built-in Models

KaibanJS provides out-of-the-box support for several leading LLM providers:

- **OpenAI**: Access to models like GPT-4 and GPT-3.5-turbo.
- **Anthropic**: Integration with Claude models.
- **Google**: Utilize Google's Gemini models.
- **Mistral**: Leverage Mistral AI's efficient language models.

These built-in integrations offer a simplified setup process, allowing you to quickly incorporate powerful AI capabilities into your agents.

### Custom Integrations

For users requiring specialized models or specific configurations, KaibanJS supports custom integrations with various LLM providers:

- **Ollama**: Run open-source models locally.
- **Cohere**: Access Cohere's suite of language models.
- **Azure OpenAI**: Use OpenAI models through Azure's cloud platform.
- **Cloudflare**: Integrate with Cloudflare's AI services.
- **Groq**: Utilize Groq's high-performance inference engines.
- **Other Integrations**: Explore additional options for specialized needs.

These custom integrations provide flexibility for advanced use cases, allowing you to tailor your LLM setup to your specific requirements.

## Key Features

- **Flexibility**: Choose from a wide range of models to suit your specific use case.
- **Scalability**: Easily switch between different models as your needs evolve.
- **Customization**: Fine-tune model parameters for optimal performance.
- **Langchain Compatibility**: Leverage the full power of Langchain's LLM integrations.

## Getting Started

To begin using LLMs in KaibanJS:

1. Decide whether a built-in model or custom integration best suits your needs.
2. Follow the setup instructions for your chosen model in the relevant documentation section.
3. Configure your agent with the appropriate LLM settings.

For built-in models, you can typically get started with just a few lines of code:

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

For custom integrations, you'll need to import and configure the specific LLM before passing it to your agent:

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

## Next Steps

Explore the subsections for detailed information on each built-in model and custom integration. Each page provides specific setup instructions, configuration options, and best practices for using that particular LLM with KaibanJS.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::