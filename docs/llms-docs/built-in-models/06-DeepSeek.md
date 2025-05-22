---
title: DeepSeek
description: Guide to using DeepSeek's language models in KaibanJS
---

> KaibanJS seamlessly integrates with DeepSeek's powerful language models, allowing you to leverage advanced AI capabilities in your applications. This integration supports DeepSeek's chat and reasoning models through the Langchain integration.

## Supported Models

KaibanJS supports DeepSeek's models available through the Langchain integration. These models are designed for natural language conversations and complex reasoning tasks. The supported models include:

- deepseek-chat: A powerful chat model optimized for conversational AI
- deepseek-reasoner: A specialized model designed for complex reasoning tasks

For more information about these models and their capabilities, please refer to the [official DeepSeek documentation](https://api-docs.deepseek.com/).

## Configuration

To use a DeepSeek model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
  name: 'DeepSeek Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'deepseek',
    model: 'deepseek-chat' // or 'deepseek-reasoner'
  }
});
```

## API Key Setup

To use DeepSeek models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
  name: 'DeepSeek Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey: 'your-api-key-here'
  }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
  name: 'DeepSeek Team',
  agents: [agent],
  env: {
    DEEPSEEK_API_KEY: 'your-api-key-here'
  }
});
```

:::warning[API Key Security]
Always use environment variables for API keys instead of hardcoding them. This enhances security and simplifies key management across different environments.

**Example:**

```javascript
apiKey: process.env.YOUR_API_KEY;
```

Never commit API keys to version control. Use a `.env` file or a secure secrets management system for sensitive information.

Please refer to [API Keys Management](/how-to/API%20Key%20Management) to learn more about handling API Keys safely.
:::

## Advanced Configuration and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's DeepSeek integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's DeepSeek integration](https://js.langchain.com/docs/integrations/chat/deepseek/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
  name: 'Advanced DeepSeek Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.7
    // Any other Langchain-supported parameters...
  }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain DeepSeek Integration Documentation](https://js.langchain.com/docs/integrations/chat/deepseek/)

## Model Features

DeepSeek models support various advanced features:

- **Tool Calling**: Both models support function calling capabilities
- **Structured Output**: Generate structured JSON responses
- **Token-level Streaming**: Real-time token streaming for faster responses
- **Token Usage Tracking**: Monitor and track token usage
- **Logprobs**: Access to token probability information

Note: As of January 2025, tool calling and structured output are not currently supported for `deepseek-reasoner`.

## Best Practices

1. **Model Selection**: Choose between `deepseek-chat` and `deepseek-reasoner` based on your specific use case
2. **Cost Management**: Monitor your API usage and implement appropriate rate limiting
3. **Error Handling**: Implement proper error handling for API rate limits and other potential issues

## Limitations

- Token limits vary by model. Ensure your inputs don't exceed these limits
- Some features may not be available across all models
- API rate limits may apply based on your subscription tier

## Further Resources

- [DeepSeek API Documentation](https://api-docs.deepseek.com/)
- [Langchain DeepSeek Integration Documentation](https://js.langchain.com/docs/integrations/chat/deepseek/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
