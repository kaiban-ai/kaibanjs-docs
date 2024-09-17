---
title: Ollama
description: Guide to integrating Ollama models with KaibanJS
---

> KaibanJS allows you to integrate Ollama's powerful language models into your applications. This integration enables you to run various open-source models locally, providing flexibility and control over your AI capabilities.

## Overview

Ollama is a tool that allows you to run open-source large language models locally. By integrating Ollama with KaibanJS, you can leverage these models in your agents, enabling offline operation and customization of your AI assistants.

## Supported Models

Ollama supports a wide range of open-source models, including but not limited to:

- Llama 2 (7B, 13B, 70B)
- Code Llama (7B, 13B, 34B)
- Mistral (7B)
- Phi-2
- Falcon (7B, 40B)
- Orca 2
- Vicuna
- Etc

For the most up-to-date list of available models and their capabilities, please refer to the [official Ollama model library](https://ollama.com/library).

## Integration Steps

To use an Ollama model in your KaibanJS agent, follow these steps:

1. **Install Ollama**: First, ensure you have Ollama installed on your system. Follow the installation instructions on the [Ollama website](https://ollama.ai/).

2. **Install LangChain's Ollama Integration**: Install the necessary package:

   ```bash
   npm install @langchain/ollama
   ```

3. **Import and Configure the Model**: In your KaibanJS project, import and configure the Ollama model:

   ```javascript
   import { ChatOllama } from "@langchain/ollama";

   const ollamaModel = new ChatOllama({
     model: "llama3.1",  // or any other model you've pulled with Ollama
     temperature: 0.7,
     maxRetries: 2,
     // Other Langchain-supported parameters
   });
   ```

4. **Create the Agent**: Use the configured Ollama model in your KaibanJS agent:

   ```javascript
   const agent = new Agent({
     name: 'Ollama Agent',
     role: 'Assistant',
     goal: 'Provide assistance using locally run open-source models.',
     background: 'AI Assistant powered by Ollama',
     llmInstance: ollamaModel
   });
   ```

## Configuration Options and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means you can use all the parameters that Langchain's Ollama integration supports. This provides extensive flexibility in configuring your language models.

Here's an example of using advanced configuration options:

```javascript
import { ChatOllama } from "@langchain/ollama";

const ollamaModel = new ChatOllama({
  model: "llama2",
  temperature: 0.7,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
  // Any other Langchain-supported parameters...
});

const agent = new Agent({
  name: 'Advanced Ollama Agent',
  role: 'Assistant',
  goal: 'Provide advanced assistance using locally run open-source models.',
  background: 'AI Assistant powered by Ollama with advanced configuration',
  llmInstance: ollamaModel
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Ollama Integration Documentation](https://js.langchain.com/docs/integrations/chat/ollama/)

## Best Practices

1. **Model Selection**: Choose an appropriate model based on your task requirements and available system resources.
2. **Resource Management**: Be aware of your system's capabilities when running larger models locally.
3. **Updates**: Regularly update your Ollama installation to access the latest models and improvements.
4. **Experiment with Parameters**: Adjust temperature, top_p, and other parameters to fine-tune model output for your specific use case.

## Limitations

- Performance depends on your local hardware capabilities.
- Some larger models may require significant computational resources.
- Ensure you comply with the licensing terms of the open-source models you use.

## Further Resources

- [Ollama Official Website](https://ollama.ai/)
- [Ollama Model Library](https://ollama.com/library)
- [LangChain Ollama Integration Documentation](https://js.langchain.com/docs/integrations/chat/ollama/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
