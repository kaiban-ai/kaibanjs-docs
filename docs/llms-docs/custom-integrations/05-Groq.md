---
title: Groq
description: Guide to integrating Groq's language models with KaibanJS
---

> KaibanJS allows you to integrate Groq's high-performance language models into your applications. This integration enables you to leverage Groq's ultra-fast inference capabilities for various natural language processing tasks.

## Overview

Groq provides access to large language models (LLMs) with extremely low latency, making it ideal for applications that require real-time AI responses. By integrating Groq with KaibanJS, you can enhance your agents with rapid and efficient language processing capabilities.

## Supported Models

Groq offers access to several open-source LLMs, optimized for high-speed inference. Some of the supported models include:

- LLaMA 3.1 (7B, 70B)
- Mixtral 8x7B
- Gemma 7B
- Etc

For the most up-to-date information on available models and their capabilities, please refer to the [official Groq documentation](https://console.groq.com/docs/models).

## Integration Steps

To use a Groq model in your KaibanJS agent, follow these steps:

1. **Sign up for Groq**: First, ensure you have a Groq account and API key. Sign up at [Groq's website](https://www.groq.com/).

2. **Install LangChain's Groq Integration**: Install the necessary package:

   ```bash
   npm install @langchain/groq
   ```

3. **Import and Configure the Model**: In your KaibanJS project, import and configure the Groq model:

   ```javascript
   import { ChatGroq } from "@langchain/groq";

   const groqModel = new ChatGroq({
     model: "llama2-70b-4096",
     apiKey: 'your-api-key',
   });
   ```

4. **Create the Agent**: Use the configured Groq model in your KaibanJS agent:

   ```javascript
   const agent = new Agent({
     name: 'Groq Agent',
     role: 'Assistant',
     goal: 'Provide rapid assistance using Groq's high-performance language models.',
     background: 'AI Assistant powered by Groq',
     llmInstance: groqModel
   });
   ```

## Configuration Options and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means you can use all the parameters that Langchain's Groq integration supports. This provides extensive flexibility in configuring your language models.

Here's an example of using advanced configuration options:

```javascript
import { ChatGroq } from "@langchain/groq";

const groqModel = new ChatGroq({
  model: "llama2-70b-4096",
  apiKey: 'your-api-key',
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 30,
  // Any other Langchain-supported parameters...
});

const agent = new Agent({
  name: 'Advanced Groq Agent',
  role: 'Assistant',
  goal: 'Provide advanced and rapid assistance using Groq's language models.',
  background: 'AI Assistant powered by Groq with advanced configuration',
  llmInstance: groqModel
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Groq Integration Documentation](https://js.langchain.com/docs/integrations/chat/groq)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your specific use case and performance requirements.
2. **API Key Security**: Always use environment variables or a secure secret management system to store your Groq API key.
3. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.
4. **Latency Optimization**: Leverage Groq's low-latency capabilities by designing your application to take advantage of rapid response times.

## Pricing and Limitations

Groq offers different pricing tiers based on usage:

- Free Tier: Limited number of API calls
- Pay-as-you-go: Charged based on the number of tokens processed
- Enterprise: Custom pricing for high-volume users

For the most current pricing information, visit the [Groq Pricing Page](https://groq.com/pricing/).

Keep in mind:
- API rate limits may apply depending on your plan.
- Pricing may vary based on the specific model and number of tokens processed.

## Further Resources

- [Groq Official Website](https://groq.com/)
- [Groq API Documentation](https://console.groq.com/docs/quickstart)
- [Langchain Groq Integration Documentation](https://js.langchain.com/docs/integrations/chat/groq)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
