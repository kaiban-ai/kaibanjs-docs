---
title: Cohere
description: Guide to integrating Cohere's language models with KaibanJS
---

> KaibanJS allows you to integrate Cohere's powerful language models into your applications. This integration enables you to leverage Cohere's state-of-the-art models for various natural language processing tasks.

## Overview

Cohere provides a range of powerful language models that can significantly enhance KaibanJS agents. By integrating Cohere with KaibanJS, you can create more capable and versatile AI agents for various tasks.

## Supported Models

Cohere offers several chat-type models, each optimized for specific use cases:

- Command-R-Plus-08-2024: Latest update of Command R+ (August 2024), best for complex RAG workflows and multi-step tool use
- Command-R-Plus-04-2024: High-quality instruction-following model with 128k context length
- Command-R-08-2024: Updated version of Command R (August 2024)
- Command-R-03-2024: Versatile model for complex tasks like code generation, RAG, and agents
- Etc

All these models have a 128k token context length and can generate up to 4k tokens of output. They are accessible through the Chat endpoint.

For the most up-to-date information on available models and their capabilities, please refer to the [official Cohere documentation](https://docs.cohere.com/docs/models).

## Integration Steps

To use a Cohere model in your KaibanJS agent, follow these steps:

1. **Sign up for Cohere**: First, ensure you have a Cohere account and API key. Sign up at [Cohere's website](https://cohere.com/).

2. **Install LangChain's Cohere Integration**: Install the necessary package:

   ```bash
   npm install @langchain/cohere
   ```

3. **Import and Configure the Model**: In your KaibanJS project, import and configure the Cohere model:

   ```javascript
   import { ChatCohere } from "@langchain/cohere";

   const cohereModel = new ChatCohere({
     model: "command-r-plus",  // or any other Cohere model
     apiKey: 'your-api-key'
   });
   ```

4. **Create the Agent**: Use the configured Cohere model in your KaibanJS agent:

   ```javascript
   const agent = new Agent({
     name: 'Cohere Agent',
     role: 'Assistant',
     goal: 'Provide assistance using Cohere's language models.',
     background: 'AI Assistant powered by Cohere',
     llmInstance: cohereModel
   });
   ```

## Configuration Options and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means you can use all the parameters that Langchain's Cohere integration supports. This provides extensive flexibility in configuring your language models.

Here's an example of using advanced configuration options:

```javascript
import { ChatCohere } from "@langchain/cohere";

const cohereModel = new ChatCohere({
  model: "command-r-plus",  // or any other Cohere model
  apiKey: 'your-api-key'
  temperature: 0,
  maxRetries: 2,
  // Any other Langchain-supported parameters...
});

const agent = new Agent({
  name: 'Advanced Cohere Agent',
  role: 'Assistant',
  goal: 'Provide advanced assistance using Cohere's language models.',
  background: 'AI Assistant powered by Cohere with advanced configuration',
  llmInstance: cohereModel
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Cohere Integration Documentation](https://js.langchain.com/docs/integrations/chat/cohere)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your specific use case (e.g., Command for general tasks, Base for embeddings and similarity).
2. **API Key Security**: Always use environment variables or a secure secret management system to store your Cohere API key.
3. **Token Management**: Be mindful of token usage, especially when using the maxTokens parameter, to optimize costs and performance.
4. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.

## Pricing and Limitations

Cohere offers different pricing tiers based on usage:

- Free Tier: Limited number of API calls per month
- Pay-as-you-go: Charged based on the number of tokens processed
- Enterprise: Custom pricing for high-volume users

For the most current pricing information, visit the [Cohere Pricing Page](https://cohere.com/pricing).

Keep in mind:
- API rate limits may apply depending on your plan.
- Some advanced features may require higher-tier plans.

## Further Resources

- [Cohere Official Website](https://cohere.com/)
- [Cohere API Documentation](https://docs.cohere.com/reference/about)
- [Langchain Cohere Integration Documentation](https://js.langchain.com/docs/integrations/chat/cohere)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::