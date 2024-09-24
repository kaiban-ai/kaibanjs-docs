---
title: OpenAI
description: Guide to using OpenAI's language models in KaibanJS
---

> KaibanJS seamlessly integrates with OpenAI's powerful language models, allowing you to leverage state-of-the-art AI capabilities in your applications. This integration supports various OpenAI models, including GPT-4o and GPT-4o-mini.

## Supported Models

KaibanJS supports all of OpenAI's chat models available through the OpenAI API. These chat models are designed for natural language conversations and are ideal for a wide range of applications. The list of supported models is dynamic and may change as OpenAI introduces new chat models or retires older ones.

Here are some examples of popular OpenAI chat models:

- GPT-4o
- GPT-4o-mini
- GPT-4
- gpt-3.5-turbo
- etc

For a comprehensive list of available models and their capabilities, please refer to the [official OpenAI documentation](https://platform.openai.com/docs/models).

## Configuration

To use an OpenAI model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
    name: 'OpenAI Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'openai',
        model: 'gpt-4o',  // or 'gpt-4o-mini', etc.
    }
});
```

## API Key Setup

To use OpenAI models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
    name: 'OpenAI Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'openai',
        model: 'gpt-4o', // or 'gpt-4o-mini', etc.
        apiKey: 'your-api-key-here'
    }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
    name: 'OpenAI Team',
    agents: [agent],
    env: {
        OPENAI_API_KEY: 'your-api-key-here'
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

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's OpenAI integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's OpenAI integration](https://js.langchain.com/docs/integrations/chat/openai/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
    name: 'Advanced OpenAI Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        // Any other Langchain-supported parameters...
    }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain OpenAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/openai/)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your task complexity and required capabilities.
2. **Cost Management**: Be mindful of token usage, especially with more powerful models like GPT-4.
3. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.

## Limitations

- Token limits vary by model. Ensure your inputs don't exceed these limits.
- Costs can accumulate quickly with heavy usage. Monitor your usage closely.

## Further Resources

- [OpenAI Models Overview](https://platform.openai.com/docs/models)
- [Langchain OpenAI Integration Documentation](https://js.langchain.com/docs/integrations/chat/openai/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
