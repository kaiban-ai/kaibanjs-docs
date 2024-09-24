---
title: Google
description: Guide to using Google's Gemini language models in KaibanJS
---

> KaibanJS seamlessly integrates with Google's powerful Gemini language models, allowing you to leverage cutting-edge AI capabilities in your applications. This integration supports various Gemini models, designed for a wide range of natural language processing tasks.

## Supported Models

KaibanJS supports Google's Gemini models available through the Google AI API. These models are designed for versatile natural language understanding and generation tasks. The list of supported models may evolve as Google introduces new models or updates existing ones.

Currently supported Gemini models include:

- gemini-1.5-pro
- gemini-1.5-flash

For the most up-to-date information on available models and their capabilities, please refer to the [official Google AI documentation](https://ai.google.dev/models/gemini).

## Configuration

To use a Gemini model in your KaibanJS agent, configure the `llmConfig` property as follows:

```javascript
const agent = new Agent({
    name: 'Gemini Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'google',
        model: 'gemini-1.5-pro',  // or 'gemini-1.5-flash'
    }
});
```

## API Key Setup

To use Gemini models, you need to provide an API key. There are two recommended ways to do this:

1. **Agent Configuration**: Specify the API key in the `llmConfig` when creating an agent:

```javascript
const agent = new Agent({
    name: 'Gemini Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'google',
        model: 'gemini-1.5-pro',
        apiKey: 'your-api-key-here'
    }
});
```

2. **Team Configuration**: Provide the API key in the `env` property when creating a team:

```javascript
const team = new Team({
    name: 'Gemini Team',
    agents: [agent],
    env: {
        GOOGLE_API_KEY: 'your-api-key-here'
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

KaibanJS uses Langchain under the hood, which means we're compatible with all the parameters that Langchain's Google Generative AI integration supports. This provides you with extensive flexibility in configuring your language models.

For more control over the model's behavior, you can pass additional parameters in the `llmConfig`. These parameters correspond to those supported by [Langchain's Google Generative AI integration](https://js.langchain.com/docs/integrations/chat/google_generativeai/).

Here's an example of how to use advanced configuration options:

```javascript
const agent = new Agent({
    name: 'Advanced Gemini Agent',
    role: 'Assistant',
    llmConfig: {
        provider: 'google',
        model: 'gemini-1.5-pro',
        temperature: 0.7
        // Any other Langchain-supported parameters...
    }
});
```

For a comprehensive list of available parameters and advanced configuration options, please refer to the official Langchain documentation:

[Langchain Google Generative AI Integration Documentation](https://js.langchain.com/docs/integrations/chat/google_generativeai/)

## Best Practices

1. **Model Selection**: Choose the appropriate model based on your task requirements. Use 'gemini-pro' for text-based tasks and 'gemini-pro-vision' for multimodal tasks involving both text and images.
2. **Safety Settings**: Utilize safety settings to control the model's output based on your application's requirements.
3. **Error Handling**: Implement proper error handling to manage API rate limits and other potential issues.

## Limitations

- Token limits may vary. Ensure your inputs don't exceed these limits.
- Costs can accumulate with heavy usage. Monitor your usage closely.
- The Gemini API may have specific rate limits or usage quotas. Check the Google AI documentation for the most current information.

## Further Resources

- [Google AI Gemini API Documentation](https://ai.google.dev/docs)
- [Langchain Google Generative AI Integration Documentation](https://js.langchain.com/docs/integrations/chat/google_generativeai/)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::