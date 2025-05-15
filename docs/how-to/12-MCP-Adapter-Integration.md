---
title: MCP Adapter Integration
description: Learn how to integrate Model Context Protocol (MCP) tools with KaibanJS using the LangChain MCP adapter.
---

## Introduction

KaibanJS now supports integration with Model Context Protocol (MCP) tools through the LangChain MCP adapter. This integration is available starting from KaibanJS version 0.20.1. The compatibility is achieved through KaibanJS's integration with LangChain, allowing you to leverage a wide range of MCP tools in your multi-agent systems.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Prerequisites

Before you begin, you need to install the LangChain MCP adapter package:

```bash
npm install @langchain/mcp-adapters
```

## Basic Usage

### Importing the MCP Client

First, import the MultiServerMCPClient from the LangChain MCP adapter:

```javascript
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
```

### Configuring the MCP Client

When configuring the MultiServerMCPClient, it's recommended to set `prefixToolNameWithServerName` to `false` and `additionalToolNamePrefix` to an empty string for better compatibility with KaibanJS. These settings help maintain cleaner tool names and better integration with KaibanJS's tool system.

Here's an example configuration:

```javascript
const mcpClient = new MultiServerMCPClient({
  // Whether to prefix tool names with the server name (optional, default: true)
  prefixToolNameWithServerName: false,
  // Optional additional prefix for tool names (optional, default: "mcp")
  additionalToolNamePrefix: "",
  mcpServers: {
    tavily: {
      command: "npx",
      args: ["-y", "tavily-mcp@0.2.0"],
      env: {
        TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",
        PATH: process.env.PATH || ""
      }
    },
    weather: {
      transport: "sse",
      url: "https://example.com/mcp-weather",
      headers: {
        Authorization: "Bearer token123"
      },
      useNodeEventSource: true,
      reconnect: {
        enabled: true,
        maxAttempts: 5,
        delayMs: 2000
      }
    }
  }
});
```

### Transport Types

The MCP adapter supports two types of server connections:

1. **stdio**: For local MCP servers that run as child processes
2. **sse** (Server-Sent Events): For remote MCP servers that expose an HTTP endpoint

Each transport type has its own configuration options and use cases. The stdio transport is typically used for local tools, while SSE is used for remote services.

### Accessing MCP Tools

Once configured, you can access the MCP tools using the `getTools()` method. The adapter automatically converts MCP tools into LangChain tools that are compatible with KaibanJS agents:

```javascript
const mcpTools = await mcpClient.getTools();
console.log(mcpTools);
```

You can also filter tools by server name:

```javascript
const tavilyTools = await mcpClient.getTools("tavily");
console.log(tavilyTools);
```

### Using MCP Tools with KaibanJS Agents

The MCP tools can be directly used with KaibanJS agents:

```javascript
const searchAgent = new Agent({
  name: "Scout",
  role: "Information Gatherer",
  goal: "Find up-to-date information about the given sports query.",
  background: "Research",
  tools: [...tavilyTools]
});
```

## Important Constraints

### Browser Environment Limitations

The LangChain MCP adapter is currently not compatible with browser environments. This limitation exists because the adapter uses the official Model Context Protocol SDK (`@modelcontextprotocol/sdk`), which is still evolving and doesn't yet have stable client-side support. For now, the MCP adapter should only be used in Node.js environments.

## Complete Example

Here's a complete example showing how to integrate MCP tools with a KaibanJS team:

```javascript
import { Agent, Task, Team } from "kaibanjs";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const mcpClient = new MultiServerMCPClient({
  prefixToolNameWithServerName: false,
  additionalToolNamePrefix: "",
  mcpServers: {
    tavily: {
      command: "npx",
      args: ["-y", "tavily-mcp@0.2.0"],
      env: {
        TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",
        PATH: process.env.PATH || ""
      }
    }
  }
});

const searchTool = await mcpClient.getTools();

// Define agents
const searchAgent = new Agent({
  name: "Scout",
  role: "Information Gatherer",
  goal: "Find up-to-date information about the given sports query.",
  background: "Research",
  tools: [...searchTool]
});

const contentCreator = new Agent({
  name: "Writer",
  role: "Content Creator",
  goal: "Generate a comprehensive articles about any sports event.",
  background: "Journalism",
  tools: []
});

// Define tasks
const searchTask = new Task({
  description: `Search for detailed information about the sports query: {sportsQuery}.`,
  expectedOutput:
    "Detailed information about the sports event. Key players, key moments, final score and other usefull information.",
  agent: searchAgent
});

const writeTask = new Task({
  description: `Using the gathered information, write a detailed article about the sport event.`,
  expectedOutput:
    "A well-structured and engaging sports article. With a title, introduction, body, and conclusion. Min 4 paragrahps long.",
  agent: contentCreator
});

// Team to coordinate the agents
const team = new Team({
  name: "Sports Content Creation Team",
  agents: [searchAgent, contentCreator],
  tasks: [searchTask, writeTask],
  inputs: { sportsQuery: "Who won the Copa America in 2024?" },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
});

// Start the workflow
team
  .start()
  .then(output => {
    console.log("Sports article:", output.result);
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive information like API keys.
2. **Error Handling**: Implement proper error handling for MCP tool operations.
3. **Tool Selection**: Choose the appropriate transport type (stdio or SSE) based on your use case.
4. **Server Configuration**: Configure reconnection settings for SSE transport to handle network issues gracefully.

## Conclusion

The MCP adapter integration provides a powerful way to extend KaibanJS's capabilities with Model Context Protocol tools. By following this guide and best practices, you can create more sophisticated multi-agent systems that leverage the full potential of MCP tools.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
