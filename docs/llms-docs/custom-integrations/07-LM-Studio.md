---
title: LM Studio
description: Guide to integrating LM Studio's local LLM server with KaibanJS
---

# LM Studio

> KaibanJS allows you to integrate LM Studio's local LLM server into your applications. This integration enables you to run AI models locally on your machine, providing a self-hosted alternative to cloud-based LLM services.

## Overview

LM Studio is a desktop application that allows you to run Large Language Models locally on your computer. By integrating LM Studio with KaibanJS, you can create AI agents that operate completely offline using your local computing resources.

## Prerequisites

1. Download and install [LM Studio](https://lmstudio.ai/) on your machine
2. Download and set up your desired model in LM Studio
3. Start the local server in LM Studio with CORS enabled

## Configuration

To use LM Studio with KaibanJS, configure your agent with the local server endpoint:

```javascript
const localAssistant = new Agent({
   name: 'LocalAssistant',
   role: 'General Assistant',
   goal: 'Help users with various tasks using local LLM',
   background: 'Local AI Assistant',
   tools: [],
   llmConfig: {
     provider: "openai", // Keep this as "openai" since LM Studio uses OpenAI-compatible endpoint
     model: "local-model", // Your local model name
     apiBaseUrl: "http://localhost:1234/v1", // Default LM Studio server URL
     apiKey: "not-needed" // LM Studio doesn't require an API key
   }
});
```

## Server Configuration

1. In LM Studio, load your desired model
2. Go to the "Server" tab
3. Enable CORS in the server settings
4. Click "Start Server"

## Best Practices

1. **Model Selection**
   - Choose models that fit your hardware capabilities
   - Consider model size vs performance trade-offs
   - Test different models locally before deployment

2. **Server Management**
   - Ensure the LM Studio server is running before making requests
   - Monitor system resources (RAM, CPU usage)
   - Configure appropriate timeout values for longer inference times

3. **Error Handling**
   - Implement connection error handling
   - Add fallback options for server unavailability
   - Monitor model loading status

## Troubleshooting

If you encounter issues:

1. Verify the LM Studio server is running
2. Check if CORS is enabled in LM Studio server settings
3. Confirm the correct local URL is configured
4. Ensure the model is properly loaded in LM Studio
5. Monitor system resources for potential bottlenecks

## Example Usage

Here's a complete example of using LM Studio with KaibanJS:

```javascript
import { Agent } from 'kaibanjs';

// Create an agent with LM Studio configuration
const assistant = new Agent({
  name: 'LocalAssistant',
  role: 'General Assistant',
  goal: 'Help users with various tasks',
  background: 'Local AI Assistant',
  tools: [],
  llmConfig: {
    provider: "openai",
    model: "meta-llama/llama-3.1-8b-instruct", // Example model name
    apiBaseUrl: "http://localhost:1234/v1",
    apiKey: "not-needed"
  }
});

// Use the agent
try {
  const response = await assistant.chat("Tell me about climate change");
  console.log(response);
} catch (error) {
  console.error("Error connecting to LM Studio:", error);
}
```

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 