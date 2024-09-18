---
title: Azure OpenAI
description: Guide to integrating Azure OpenAI models with KaibanJS
---

> KaibanJS allows you to integrate Azure OpenAI's powerful language models into your applications. This integration enables you to leverage OpenAI's models through Microsoft Azure's cloud platform, providing enterprise-grade security, compliance, and regional availability.

## Overview

Azure OpenAI Service provides API access to OpenAI's powerful language models like GPT-4, GPT-3.5-Turbo, and Embeddings model series. By integrating Azure OpenAI with KaibanJS, you can leverage these models in your agents while benefiting from Azure's scalability and security features.

## Supported Models

Azure OpenAI supports a range of OpenAI models, including:

- GPT-4 and GPT-4 Turbo
- GPT-3.5-Turbo

For the most up-to-date list of available models and their capabilities, please refer to the [official Azure OpenAI documentation](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/).

## Integration Steps

To use an Azure OpenAI model in your KaibanJS agent, follow these steps:

1. **Set up Azure OpenAI**: First, ensure you have an Azure account and have set up the Azure OpenAI service. Follow the instructions in the [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

2. **Install LangChain's OpenAI Integration**: Install the necessary package:

   ```bash
   npm install @langchain/openai
   ```

3. **Import and Configure the Model**: In your KaibanJS project, import and configure the Azure OpenAI model:

   ```javascript
   import { AzureChatOpenAI } from "@langchain/openai";

   const azureOpenAIModel = new AzureChatOpenAI({
     model: "gpt-4",
     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
     azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
     azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
     azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
   });
   ```

4. **Create the Agent**: Use the configured Azure OpenAI model in your KaibanJS agent:

   ```javascript
   const agent = new Agent({
     name: 'Azure OpenAI Agent',
     role: 'Assistant',
     goal: 'Provide assistance using Azure-hosted OpenAI models.',
     background: 'AI Assistant powered by Azure OpenAI',
     llmInstance: azureOpenAIModel
   });
   ```

## Configuration Options and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means you can use all the parameters that Langchain's Azure OpenAI integration supports. This provides extensive flexibility in configuring your language models.

Here's an example of using advanced configuration options:

```javascript
import { AzureChatOpenAI } from "@langchain/openai";

const azureOpenAIModel = new AzureChatOpenAI({
  model: "gpt-4",
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // Any other Langchain-supported parameters...
});

const agent = new Agent({
  name: 'Advanced Azure OpenAI Agent',
  role: 'Assistant',
  goal: 'Provide advanced assistance using Azure-hosted OpenAI models.',
  background: 'AI Assistant powered by Azure OpenAI with advanced configuration',
  llmInstance: azureOpenAIModel
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Azure OpenAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/azure)

## Best Practices

1. **Security**: Always use environment variables or a secure secret management system to store your Azure OpenAI API keys and other sensitive information.
2. **Model Selection**: Choose an appropriate model based on your task requirements and available resources.
3. **Monitoring**: Utilize Azure's monitoring and logging capabilities to track usage and performance.
4. **Cost Management**: Be aware of the pricing model and monitor your usage to manage costs effectively.

## Limitations

- Access to Azure OpenAI is currently limited and requires an application process.
- Some features or the latest models might be available on OpenAI before they are available on Azure OpenAI.
- Ensure compliance with Azure's usage policies and any applicable regulations in your region.

## Further Resources

- [Azure OpenAI Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure OpenAI Models Overview](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)
- [LangChain Azure OpenAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/azure)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::