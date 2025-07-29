---
title: XAI
description: Guide to using XAI's language models in KaibanJS
---

> KaibanJS seamlessly integrates with XAI's powerful language models, allowing you to leverage advanced AI capabilities in your applications. This integration supports XAI's chat and reasoning models through the Langchain integration.

## Supported Models

KaibanJS supports XAI's models available through the Langchain integration. These models are designed for natural language conversations and complex reasoning tasks. The supported models include:

- grok-4: A powerful chat model optimized for conversational AI and complex reasoning tasks
- grok-3: A powerful chat model optimized for conversational AI
- grok-3-mini-fast: A specialized model designed for complex reasoning tasks, but faster than grok-3

For more information about these models and their capabilities, please refer to the [official XAI models documentation](https://docs.x.ai/docs/models).

## Configuration

To use a XAI model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
  name: 'XAI Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'xai',
    model: 'grok-4' // or 'grok-3-mini-fast'
  }
});
```

## API Key Setup

To use XAI models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
  name: 'XAI Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'xai',
    model: 'grok-4',
    apiKey: 'your-api-key-here'
  }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
  name: 'XAI Team',
  agents: [agent],
  env: {
    XAI_API_KEY: 'your-api-key-here'
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

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's XAI integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's XAI integration](https://js.langchain.com/docs/integrations/chat/xai/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
  name: 'Advanced XAI Agent',
  role: 'Assistant',
  llmConfig: {
    provider: 'xai',
    model: 'grok-4',
    temperature: 0.7
    // Any other Langchain-supported parameters...
  }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain XAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/xai/)

## Model Features

XAI models support various advanced features:

- **Tool Calling**: Models support function calling capabilities
- **Structured Output**: Generate structured JSON responses
- **Token-level Streaming**: Real-time token streaming for faster responses
- **Token Usage Tracking**: Monitor and track token usage
- **Logprobs**: Access to token probability information

:::warning[XAI API Key]
XAI API keys are not available for free. You need to sign up for a XAI account and get an API key.

You can sign up for a XAI account [here](https://x.ai/signup).
:::

## Best Practices

1. **Model Selection**: Choose between `grok-4` and `grok-3-mini-fast` based on your specific use case
2. **Cost Management**: Monitor your API usage and implement appropriate rate limiting
3. **Error Handling**: Implement proper error handling for API rate limits and other potential issues

## Limitations

- Token limits vary by model. Ensure your inputs don't exceed these limits
- Some features may not be available across all models
- API rate limits may apply based on your subscription tier

## Further Resources

- [XAI API Documentation](https://docs.x.ai/docs/overview)
- [Langchain XAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/xai/)
- [XAI Pricing](https://x.ai/pricing)

  :::tip[We Love Feedback!]
  Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
  :::
