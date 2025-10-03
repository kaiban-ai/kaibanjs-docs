---
title: A2A Protocol Integration
description: Learn how to integrate KaibanJS teams with Google's Agent-to-Agent (A2A) protocol for seamless agent communication and collaboration.
---

> Integrate your KaibanJS teams with Google's Agent-to-Agent (A2A) protocol to enable seamless communication between AI agents across different platforms and providers. This integration allows your agents to collaborate with other A2A-compatible agents in a standardized, secure, and interoperable ecosystem.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Introduction

The Agent-to-Agent (A2A) protocol, developed by Google, provides a standardized framework for AI agents to communicate and collaborate effectively. It addresses the current lack of interoperability between agents built on different platforms and by various providers, enabling seamless collaboration in complex multi-agent workflows.

:::warning[Server-Side Only]
Due to protocol requirements, A2A integration with KaibanJS must be implemented server-side to ensure proper security, authentication, and performance. This integration cannot be used in browser environments.
:::

:::tip[Try the Demo!]
See the A2A Protocol integration in action with our complete demo implementation. [Try it now!](https://github.com/kaiban-ai/a2a-protocol-kaibanjs-demo)
:::

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', marginBottom: '20px'}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/4n8u8T8_eDY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></iframe>
</div>

## Understanding the A2A Protocol

### Key Protocol Components

The A2A protocol consists of several essential components that work together to enable agent communication:

#### 1. Agent Card

An **Agent Card** is a JSON document that describes an agent's identity, capabilities, skills, service URL, and authentication requirements. It serves as the agent's "business card" in the A2A ecosystem.

#### 2. Task Management

Communication between agents is **task-oriented**. A "Task" represents a unit of work or conversation between agents, with defined lifecycle states: `submitted`, `working`, `input-required`, `completed`, `failed`, or `canceled`.

#### 3. Event Bus System

The protocol uses an **ExecutionEventBus** for real-time communication, supporting streaming updates through Server-Sent Events (SSE) for dynamic collaboration.

#### 4. Request Context

Each interaction includes a **RequestContext** containing task ID, context ID, and user message parts, providing structured communication between agents.

## Implementation Guide

### Step 1: Install Dependencies

First, install the required dependencies for A2A protocol integration:

```bash
npm install @a2a-js/sdk express cors dotenv
```

### Step 2: Create the Agent Card

Define your agent's capabilities and metadata in an Agent Card:

```typescript
import { AgentCard } from '@a2a-js/sdk';

export const kaibanjsAgentCard: AgentCard = {
  name: 'Kaibanjs Research Agent',
  description:
    'An AI agent that uses Kaibanjs to research topics and provide comprehensive summaries using web search and content generation capabilities.',
  version: '1.0.0',
  protocolVersion: '1.0.0',
  url: process.env.BASE_URL || 'http://localhost:4000',
  preferredTransport: 'JSONRPC',
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true
  },
  defaultInputModes: ['text/plain'],
  defaultOutputModes: ['text/plain'],
  skills: [
    {
      id: 'research',
      name: 'Research and Summarization',
      description:
        'Research topics using web search and generate comprehensive summaries',
      tags: ['research', 'summarization', 'web-search', 'ai'],
      examples: [
        'What are the latest developments in AI?',
        'Summarize the current state of renewable energy',
        'Research the history of space exploration'
      ]
    }
  ],
  provider: {
    organization: 'KaibanJS',
    url: 'https://github.com/Kaiban-ai/a2a-protocol-kaibanjs-demo'
  }
};
```

### Step 3: Create the KaibanJS Team

Build your KaibanJS team with agents and tasks:

```typescript
import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Define tools
const searchTool = new TavilySearchResults({
  maxResults: 3,
  apiKey: process.env.TAVILY_API_KEY || 'your-tavily-api-key'
});

// Define agents
const searchAgent = new Agent({
  name: 'Scout',
  role: 'Information Gatherer',
  goal: 'Find up-to-date information about the given query.',
  background:
    'Research specialist with expertise in web search and information gathering',
  type: 'ReactChampionAgent',
  tools: [searchTool]
});

const contentCreator = new Agent({
  name: 'Writer',
  role: 'Content Creator',
  goal: 'Generate a comprehensive summary of the gathered information.',
  background: 'Journalist and content creator with expertise in summarization',
  type: 'ReactChampionAgent',
  tools: []
});

// Define tasks
const searchTask = new Task({
  description: `Search for detailed information about: {query}. Current date: {currentDate}. Focus on the most recent and up-to-date information available.`,
  expectedOutput:
    'Detailed information about the topic. Key facts, important details, and relevant information. Include timestamps and dates when available.',
  agent: searchAgent
});

const summarizeTask = new Task({
  description: `Using the gathered information, create a comprehensive summary. Ensure the summary reflects the most current state of the topic.`,
  expectedOutput:
    'A well-structured summary with key points, main findings, and conclusions. Minimum 3 paragraphs. Include relevant dates and timestamps when available.',
  agent: contentCreator
});

// Create team factory function
export function createKaibanjsTeam(query: string) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const team = new Team({
    name: 'Research and Summary Team',
    agents: [searchAgent, contentCreator],
    tasks: [searchTask, summarizeTask],
    inputs: {
      query,
      currentDate
    },
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || ''
    }
  });

  return team;
}
```

### Step 4: Implement the Agent Executor

Create an executor that bridges KaibanJS teams with the A2A protocol:

```typescript
import {
  AgentExecutor,
  RequestContext,
  ExecutionEventBus
} from '@a2a-js/sdk/server';
import {
  TaskStatusUpdateEvent,
  TaskArtifactUpdateEvent,
  Part
} from '@a2a-js/sdk';

import { createKaibanjsTeam } from './kaibanjs-team.js';

export class KaibanjsAgentExecutor implements AgentExecutor {
  public async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    const { taskId, contextId, userMessage } = requestContext;

    try {
      // Extract query from userMessage
      const query = userMessage.parts
        .filter((part: Part) => part.kind === 'text')
        .map((part: Part) => (part as any).text)
        .join(' ');

      if (!query.trim()) {
        throw new Error('No query provided in message');
      }

      // Start the task
      eventBus.publish({
        kind: 'status-update',
        taskId,
        contextId,
        status: { state: 'working', timestamp: new Date().toISOString() },
        final: false
      });

      // Create Kaibanjs team
      const team = createKaibanjsTeam(query);
      const useTeamStore = team.useStore();

      // Subscribe to workflow logs for streaming updates
      const unsubscribe = useTeamStore.subscribe(state => {
        const { workflowLogs } = state;

        // Process latest logs
        workflowLogs.forEach(log => {
          if (log) {
            let logMessage = '';

            if (log.logType === 'TaskStatusUpdate') {
              logMessage = `Task Status: ${log.taskStatus}`;
            } else if (log.logType === 'AgentStatusUpdate') {
              logMessage = `Agent Status: ${log.agentStatus}`;
            } else if (log.logType === 'WorkflowStatusUpdate') {
              logMessage = `Workflow Status: ${log.workflowStatus}`;
            }

            if (logMessage) {
              // Send log as artifact update through the event bus
              eventBus.publish({
                kind: 'artifact-update',
                taskId,
                contextId,
                artifact: {
                  artifactId: `log-${Date.now()}`,
                  parts: [{ kind: 'text', text: log.logDescription }],
                  metadata: {
                    timestamp: new Date().toISOString(),
                    logType: log.logType,
                    logMessage
                  }
                }
              });
            }
          }
        });
      });

      // Execute the team workflow
      await team.start();

      // Wait for final logs to be processed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get final result
      const finalState = useTeamStore.getState();
      const finalResult = finalState.workflowResult;

      // Send final result
      if (finalResult) {
        eventBus.publish({
          kind: 'artifact-update',
          taskId,
          contextId,
          artifact: {
            artifactId: `result-${taskId}`,
            parts: [
              { kind: 'text', text: JSON.stringify(finalResult, null, 2) }
            ],
            metadata: {
              timestamp: new Date().toISOString(),
              type: 'final-result'
            }
          }
        });
      }

      // Unsubscribe from logs
      unsubscribe();

      // Complete the task
      eventBus.publish({
        kind: 'status-update',
        taskId,
        contextId,
        status: { state: 'completed', timestamp: new Date().toISOString() },
        final: true
      });
    } catch (error) {
      console.error('Error in KaibanjsAgentExecutor:', error);

      // Send error as artifact
      eventBus.publish({
        kind: 'artifact-update',
        taskId,
        contextId,
        artifact: {
          artifactId: `error-${taskId}`,
          parts: [
            {
              kind: 'text',
              text: `Error: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            }
          ],
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'error'
          }
        }
      });

      // Mark task as failed
      eventBus.publish({
        kind: 'status-update',
        taskId,
        contextId,
        status: { state: 'failed', timestamp: new Date().toISOString() },
        final: true
      });
    } finally {
      eventBus.finished();
    }
  }

  public async cancelTask(
    taskId: string,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    // Implementation for task cancellation
    console.log(`Task cancellation requested for task: ${taskId}`);
  }
}
```

### Step 5: Set Up the Express Server

Create the main server that handles A2A protocol requests:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { A2AExpressApp } from '@a2a-js/sdk/server/express';
import { DefaultRequestHandler, InMemoryTaskStore } from '@a2a-js/sdk/server';
import { KaibanjsAgentExecutor } from './agent-executor.js';
import { kaibanjsAgentCard } from './agent-card.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Create A2A components
const taskStore = new InMemoryTaskStore();
const agentExecutor = new KaibanjsAgentExecutor();

// Create A2A request handler
const requestHandler = new DefaultRequestHandler(
  kaibanjsAgentCard,
  taskStore,
  agentExecutor
);

// Create A2A Express app
const a2aApp = new A2AExpressApp(requestHandler);

// Setup A2A routes
a2aApp.setupRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agent: kaibanjsAgentCard.name,
    version: kaibanjsAgentCard.version
  });
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 A2A Server running on port ${PORT}`);
    console.log(
      `📋 Agent Card available at: http://localhost:${PORT}/.well-known/agent-card.json`
    );
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Agent: ${kaibanjsAgentCard.name}`);
  });
}

// Export for Vercel serverless
export default app;
```

## Key Integration Points

### 1. Request Processing

The A2A protocol receives requests through the `RequestContext`, which contains:

- **Task ID**: Unique identifier for the current task
- **Context ID**: Session or conversation context
- **User Message**: The input message with parts (text, images, etc.)

```typescript
// Extract query from userMessage
const query = userMessage.parts
  .filter((part: Part) => part.kind === 'text')
  .map((part: Part) => (part as any).text)
  .join(' ');
```

### 2. Streaming Workflow Logs

The integration uses KaibanJS's store subscription to stream workflow logs through the A2A event bus:

```typescript
// Subscribe to workflow logs
const unsubscribe = useTeamStore.subscribe(state => {
  const { workflowLogs } = state;

  workflowLogs.forEach(log => {
    if (log) {
      // Send log as artifact update
      eventBus.publish({
        kind: 'artifact-update',
        taskId,
        contextId,
        artifact: {
          artifactId: `log-${Date.now()}`,
          parts: [{ kind: 'text', text: log.logDescription }],
          metadata: {
            timestamp: new Date().toISOString(),
            logType: log.logType,
            logMessage
          }
        }
      });
    }
  });
});
```

### 3. Status Updates

The protocol requires status updates throughout the task lifecycle:

```typescript
// Start the task
eventBus.publish({
  kind: 'status-update',
  taskId,
  contextId,
  status: { state: 'working', timestamp: new Date().toISOString() },
  final: false
});

// Complete the task
eventBus.publish({
  kind: 'status-update',
  taskId,
  contextId,
  status: { state: 'completed', timestamp: new Date().toISOString() },
  final: true
});
```

### 4. Artifact Management

Results and intermediate outputs are sent as artifacts:

```typescript
// Send final result
eventBus.publish({
  kind: 'artifact-update',
  taskId,
  contextId,
  artifact: {
    artifactId: `result-${taskId}`,
    parts: [{ kind: 'text', text: JSON.stringify(finalResult, null, 2) }],
    metadata: {
      timestamp: new Date().toISOString(),
      type: 'final-result'
    }
  }
});
```

## Environment Configuration

Create a `.env` file with the required environment variables:

```env
# Server Configuration
PORT=4000
BASE_URL=http://localhost:4000
NODE_ENV=development

# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Deployment Considerations

### Server-Side Requirements

- **Node.js Environment**: A2A integration requires a server-side Node.js environment
- **HTTPS**: Production deployments should use HTTPS for secure communication
- **Environment Variables**: Secure API key management through environment variables

### Production Deployment

For production deployment, consider using platforms like:

- **Vercel**: Serverless deployment with automatic scaling
- **Railway**: Simple deployment with built-in environment management
- **Google Cloud Run**: Containerized deployment with auto-scaling

## Best Practices

### 1. Error Handling

- Implement comprehensive error handling for all A2A protocol interactions
- Provide meaningful error messages through the event bus
- Handle task cancellation gracefully

### 2. Performance Optimization

- Use appropriate timeouts for long-running tasks
- Implement proper cleanup of subscriptions and resources
- Monitor memory usage for large workflow executions

### 3. Security

- Validate all incoming requests
- Implement proper authentication and authorization
- Use HTTPS in production environments

### 4. Monitoring

- Log all A2A protocol interactions
- Monitor task execution times and success rates
- Implement health checks and status endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proper CORS configuration for cross-origin requests
2. **Authentication Failures**: Verify API keys and authentication tokens
3. **Task Timeouts**: Implement appropriate timeout handling for long-running tasks
4. **Memory Leaks**: Ensure proper cleanup of subscriptions and event listeners

### Debug Tips

- Enable detailed logging for A2A protocol interactions
- Use the health check endpoint to verify server status
- Monitor the event bus for proper message flow
- Test with simple queries before complex workflows

## Conclusion

Integrating KaibanJS teams with the A2A protocol enables powerful agent-to-agent communication and collaboration. By following this guide, you can create interoperable AI agents that can seamlessly work with other A2A-compatible agents across different platforms and providers.

The key to successful integration lies in understanding the protocol's components, implementing proper event handling, and ensuring robust error management. With this foundation, your KaibanJS agents can participate in the broader ecosystem of AI agent collaboration.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
