---
title: Anthropic
description: Guide to using Anthropic's language models in KaibanJS
---

> KaibanJS seamlessly integrates with Anthropic's powerful language models, allowing you to leverage advanced AI capabilities in your applications. This integration supports various Anthropic models, including Claude 3 Opus, Claude 3 Sonnet, and Claude 3 Haiku.

## Supported Models

KaibanJS supports all of Anthropic's chat models available through the Anthropic API. These models are designed for natural language conversations and are ideal for a wide range of applications. The list of supported models is dynamic and may change as Anthropic introduces new models or retires older ones.

Here are some examples of popular Anthropic models:

- claude-3-5-sonnet-20240620
- claude-3-opus-20240229
- claude-3-haiku-20240307

For a comprehensive list of available models and their capabilities, please refer to the [official Anthropic documentation](https://docs.anthropic.com/en/docs/about-claude/models).

## Configuration

To use an Anthropic model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
    name: 'Anthropic Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20240620',  // or any other Anthropic model
        apiKey: 'your-api-key-here'
    }
});
```

## API Key Setup

To use Anthropic models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
    name: 'Anthropic Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'anthropic',
        model: 'claude-3-opus-20240229',
        apiKey: 'your-api-key-here'
    }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
    name: 'Anthropic Team',
    agents: [agent],
    env: {
        ANTHROPIC_API_KEY: 'your-api-key-here'
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
:::

## Advanced Configuration and Langchain Compatibility

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's Anthropic integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's Anthropic integration](https://js.langchain.com/docs/integrations/chat/anthropic/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
    name: 'Advanced Anthropic Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'anthropic',
        model: 'claude-3-opus-20240229',
        temperature: 0.7,
        maxTokens: 1000,
        // Any other Langchain-supported parameters...
    }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Anthropic Integration Documentation](https://js.langchain.com/docs/integrations/chat/anthropic/)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your task complexity and required capabilities. For example, use Claude 3 Opus for complex tasks, Claude 3 Sonnet for a balance of performance and efficiency, and Claude 3 Haiku for faster, simpler tasks.
2. **Cost Management**: Be mindful of token usage, especially with more powerful models like Claude 3 Opus.
3. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.

## Limitations

- Token limits vary by model. Ensure your inputs don't exceed these limits.
- Costs can accumulate quickly with heavy usage. Monitor your usage closely.

## Further Resources

- [Anthropic Models Overview](https://docs.anthropic.com/en/docs/about-claude/models)
- [Langchain Anthropic Integration Documentation](https://js.langchain.com/docs/integrations/chat/anthropic/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::