---
title: OpenRouter
description: Guide to integrating OpenRouter's unified AI model gateway with KaibanJS
---

# OpenRouter

> KaibanJS allows you to integrate OpenRouter's unified API gateway into your applications. This integration enables you to access multiple AI models from different providers through a single endpoint, simplifying model management and experimentation.

## Overview

OpenRouter is a unified API gateway that provides access to multiple AI models through a single endpoint. This integration allows KaibanJS users to easily access various AI models from different providers without managing multiple API keys or endpoints.

## Benefits

- Access to multiple AI models through a single API endpoint
- Simplified model switching and testing
- Consistent API interface across different model providers
- Cost-effective access to various AI models
- No need to manage multiple API keys for different providers

## Configuration

To use OpenRouter with KaibanJS, you'll need to:

1. Sign up for an account at [OpenRouter](https://openrouter.ai/)
2. Get your API key from the OpenRouter dashboard
3. Configure your agent with OpenRouter settings

Here's how to configure an agent to use OpenRouter:

```javascript
const profileAnalyst = new Agent({
   name: 'Mary',
   role: 'Profile Analyst',
   goal: 'Extract structured information from conversational user input.',
   background: 'Data Processor',
   tools: [],
   llmConfig: {
     provider: "openai", // Keep this as "openai" since OpenRouter uses OpenAI-compatible endpoint
     model: "meta-llama/llama-3.1-8b-instruct:free", // Use the exact model name from OpenRouter
     apiBaseUrl: "https://openrouter.ai/api/v1",
     apiKey: process.env.OPENROUTER_API_KEY // Use environment variable for security
   }
});
```

## Environment Variables

It's recommended to use environment variables for your API key. Add this to your `.env` file:

```bash
OPENROUTER_API_KEY=your_api_key_here
```

## Available Models

OpenRouter provides access to various models from different providers. Here are some examples:

- `meta-llama/llama-3.1-8b-instruct:free`
- `anthropic/claude-2`
- `google/palm-2`
- `meta-llama/codellama-34b`
- And many more...

Visit the [OpenRouter models page](https://openrouter.ai/models) for a complete list of available models and their capabilities.

## Best Practices

1. **API Key Security**
   - Always use environment variables for API keys
   - Never commit API keys to version control

2. **Model Selection**
   - Choose models based on your specific use case
   - Consider the cost and performance trade-offs
   - Test different models to find the best fit

3. **Error Handling**
   - Implement proper error handling for API calls
   - Have fallback models configured when possible


## Troubleshooting

If you encounter issues:

1. Verify your API key is correct
2. Check if the selected model is available in your OpenRouter plan
3. Ensure your API base URL is correct
4. Verify your network connection and firewall settings

For more help, visit the [OpenRouter documentation](https://openrouter.ai/docs) or the [KaibanJS community](https://github.com/kaibanjs/kaiban/discussions). 

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::