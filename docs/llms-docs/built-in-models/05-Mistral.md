---
title: Mistral
description: Guide to using Mistral AI's language models in KaibanJS
---

> KaibanJS seamlessly integrates with Mistral AI's powerful language models, allowing you to leverage advanced AI capabilities in your applications. This integration supports various Mistral models, designed for a wide range of natural language processing tasks.

## Supported Models

KaibanJS supports Mistral AI's models available through the Mistral AI API. These models are designed for versatile natural language understanding and generation tasks. The list of supported models may evolve as Mistral AI introduces new models or updates existing ones.

Currently supported Mistral models include:

- mistral-tiny
- mistral-small
- mistral-medium
- mistral-large-latest

For the most up-to-date information on available models and their capabilities, please refer to the [official Mistral AI documentation](https://docs.mistral.ai/getting-started/models/).

## Configuration

To use a Mistral model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
    name: 'Mistral Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'mistral',
        model: 'mistral-large-latest',  // or any other Mistral model
    }
});
```

## API Key Setup

To use Mistral models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
    name: 'Mistral Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'mistral',
        model: 'mistral-large-latest',
        apiKey: 'your-api-key-here'
    }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
    name: 'Mistral Team',
    agents: [agent],
    env: {
        MISTRAL_API_KEY: 'your-api-key-here'
    }
});
```

:::warning[API Key Security]
Always use environment variables for API keys instead of hardcoding them. This enhances security and simplifies key management across different environments.

**Example:**
```javascript
apiKey: process.env.YOUR_API_KEY
```

Never commit API keys to version control. Use a `.env` file or a secure secrets management system for sensitive information.

Please refer to [API Keys Management](/how-to/API%20Key%20Management) to learn more about handling API Keys safely.
:::

## Advanced Configuration and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's Mistral AI integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's Mistral AI integration](https://js.langchain.com/docs/integrations/chat/mistral/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
    name: 'Advanced Mistral Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'mistral',
        model: 'mistral-large-latest',
        temperature: 0,
        maxRetries: 2,
        // Any other Langchain-supported parameters...
    }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Mistral AI Integration Documentation](https://js.langchain.com/docs/integrations/chat/mistral/)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your task complexity and required capabilities. For example, use `mistral-large-latest` for more complex tasks and `mistral-tiny` for simpler, faster responses.
2. **Cost Management**: Be mindful of token usage, especially with larger models.
3. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.

## Limitations

- Token limits may vary by model. Ensure your inputs don't exceed these limits.
- Costs can accumulate with heavy usage. Monitor your usage closely.
- The Mistral AI API may have specific rate limits or usage quotas. Check the Mistral AI documentation for the most current information.

## Further Resources

- [Mistral AI Models Documentation](https://docs.mistral.ai/getting-started/models/)
- [Langchain Mistral AI Integration Documentation](https://js.langchain.com/docs/integrations/chat/mistral/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::