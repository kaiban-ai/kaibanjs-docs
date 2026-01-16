---
title: Integrating with KaibanIO Platform
description: Learn how to integrate your KaibanJS teams with the KaibanIO platform using the A2A protocol for enterprise workflow automation and card-based task management.
---

> Integrate your KaibanJS teams with the KaibanIO platform to enable seamless workflow automation, automatic card status management, and real-time collaboration. This integration uses the standardized A2A (Agent-to-Agent) protocol to connect your agents with enterprise workflow management systems.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Introduction

The KaibanIO platform provides enterprise workflow management and agent orchestration capabilities that work seamlessly with agents built using any SDK or framework. Through the standardized A2A protocol, agents implemented with KaibanJS can integrate directly into the KaibanIO platform, enabling powerful workflow automation, card-based task management, and real-time collaboration.

This guide demonstrates how to integrate a KaibanJS team with the KaibanIO platform. When cards are created or updated in a Kaiban board, the platform communicates with your agent via the A2A protocol, triggering your KaibanJS team execution and automatically updating card statuses through the workflow lifecycle (TODO → DOING → DONE → BLOCKED).

:::warning[Server-Side Only]
Due to protocol requirements, KaibanIO platform integration with KaibanJS must be implemented server-side to ensure proper security, authentication, and performance. This integration cannot be used in browser environments.
:::

## Understanding the Integration Architecture

The integration consists of several key components that work together:

### 1. Agent Card
An **Agent Card** is a JSON document that describes your agent's identity, capabilities, skills, service URL, and authentication requirements. It serves as the agent's "business card" in the A2A ecosystem and is served at `/.well-known/agent-card.json`.

### 2. A2A Executor
The **A2A Executor** implements the A2A protocol executor interface, handling task lifecycle and activity processing. It receives activities from the KaibanIO platform and manages the task lifecycle (submitted → working → completed).

### 3. Kaiban Controller
The **Kaiban Controller** orchestrates workflow state management and integrates with KaibanIO platform APIs. It processes card activities, invokes your KaibanJS team, and updates card statuses automatically.

### 4. KaibanJS Team
Your **KaibanJS Team** contains the business logic that processes requests using collaborative AI agents. The team can use any KaibanJS agent types, including `ReactChampionAgent` and `WorkflowDrivenAgent`.

### 5. Kaiban SDK
The **Kaiban SDK** (`@kaiban/sdk`) provides the client library for interacting with KaibanIO platform APIs (cards, activities, boards).

## Prerequisites

Before you begin, ensure you have:

- Node.js 20 or higher installed
- A KaibanIO platform account with access to:
  - Tenant identifier
  - API token
  - Agent ID (created in the platform)
- A publicly accessible URL for your agent (for production) or a tunneling service (for development)

## Installation

First, install the required dependencies:

```bash
npm install @a2a-js/sdk @kaiban/sdk kaibanjs express cors dotenv
```

Or with pnpm:

```bash
pnpm install @a2a-js/sdk @kaiban/sdk kaibanjs express cors dotenv
```

If you're using TypeScript:

```bash
npm install --save-dev typescript @types/express @types/node tsx
```

## Step-by-Step Implementation

### Step 1: Create the Agent Card

The agent card defines your agent's capabilities and metadata for A2A protocol discovery:

```typescript
// src/agents/my-agent/card.ts
import { AgentCard } from '@a2a-js/sdk';

export const myAgentCard = (url: string): AgentCard => ({
  name: 'My KaibanJS Agent',
  description:
    'Agent that processes requests using KaibanJS teams and integrates with KaibanIO platform',
  
  // A2A protocol version this agent supports
  protocolVersion: '0.3.0',
  
  // Agent version for tracking changes and updates
  version: '0.1.0',
  
  // Public endpoint URL - complete agent endpoint URL
  url,
  
  // Agent accepts text-based input from users
  defaultInputModes: ['text'],
  
  // Agent responds with text-based output
  defaultOutputModes: ['text'],
  
  // Skills define what this agent can do
  skills: [
    {
      id: 'my-skill',
      name: 'My Skill',
      description: 'Description of what this agent can do',
      tags: ['tag1', 'tag2', 'tag3'],
    },
  ],
  
  // Agent capabilities for client negotiation
  capabilities: {
    streaming: true, // Supports Server-Sent Events (SSE) for real-time responses
    pushNotifications: false, // Does not support push notifications
    stateTransitionHistory: false, // Does not maintain state history
  },
});
```

### Step 2: Create Your KaibanJS Team

Build your KaibanJS team with agents and tasks. This can be a simple team or a complex multi-agent system:

```typescript
// src/agents/my-agent/controller/agent.ts
import { Agent, Task, Team } from 'kaibanjs';

// Define your agents
const processingAgent = new Agent({
  name: 'Processing Agent',
  role: 'Data Processor',
  goal: 'Process and analyze data',
  background: 'Expert in data processing and analysis',
  type: 'ReactChampionAgent',
  tools: [], // Add tools as needed
});

// Define tasks
const processTask = new Task({
  description: 'Process the following request: {userMessage}',
  expectedOutput: 'Processed result with analysis',
  agent: processingAgent,
});

// Create team factory function
export const createMyTeam = (userMessage: string) => {
  return new Team({
    name: 'My Processing Team',
    agents: [processingAgent],
    tasks: [processTask],
    inputs: {
      userMessage,
    },
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    },
  });
};

// Process request function
export const processMyRequest = async (userMessage: string) => {
  const team = createMyTeam(userMessage);
  const { result = '' } = await team.start();
  
  if (result && typeof result === 'object') {
    return JSON.stringify(result);
  }
  
  return result as string;
};
```

### Step 3: Create the Kaiban Controller

The Kaiban controller handles card activities and manages the card lifecycle:

```typescript
// src/agents/my-agent/controller/kaiban-controller.ts
import {
  Activity,
  ActivityActor,
  ActivityType,
  CardStatus,
  createKaibanClient,
  KaibanClient,
} from '@kaiban/sdk';
import { processMyRequest } from './agent';

// Kanban board column keys
const TODO_COLUMN_KEY = 'todo';
const DOING_COLUMN_KEY = 'doing';
const DONE_COLUMN_KEY = 'done';
const BLOCKED_COLUMN_KEY = 'blocked';

export class MyKaibanController {
  constructor(
    private readonly kaibanActor: ActivityActor,
    private readonly kaibanClient: KaibanClient,
  ) {}

  /**
   * Factory method to create and initialize the controller
   */
  static async build() {
    const tenant = process.env.KAIBAN_TENANT;
    const token = process.env.KAIBAN_API_TOKEN;
    const agentId = process.env.KAIBAN_AGENT_ID;
    let baseUrl = process.env.KAIBAN_API_URL;

    // Validate required environment configuration
    if (!tenant || !token || !agentId) {
      throw new Error(
        'Kaiban integration configuration is missing. Please set KAIBAN_TENANT, KAIBAN_API_TOKEN, and KAIBAN_AGENT_ID in your .env file.',
      );
    }

    // Set default base URL if not provided
    if (!baseUrl) {
      baseUrl = `https://${tenant}.kaiban.io/api`;
    }

    // Initialize Kaiban SDK client
    const kaibanClient = createKaibanClient({ baseUrl, tenant, token });

    // Verify agent exists in Kaiban platform
    const agent = await kaibanClient.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found in Kaiban platform`);
    }

    // Create actor representation for this agent
    const kaibanActor: ActivityActor = {
      id: agent.id,
      type: 'agent',
      name: agent.name,
    };

    return new MyKaibanController(kaibanActor, kaibanClient);
  }

  /**
   * Entry point for processing Kaiban platform activities
   */
  async processKaibanActivity(activity: Activity) {
    switch (activity.type) {
      case ActivityType.CARD_CREATED:
      case ActivityType.CARD_CLONED:
      case ActivityType.CARD_AGENT_ADDED:
      case ActivityType.CARD_COLUMN_CHANGED:
        await this.processCardCreatedActivity(activity);
        break;
    }
  }

  /**
   * Processes card-related activities through a complete workflow
   */
  private async processCardCreatedActivity(activity: Activity) {
    const card = await this.kaibanClient.cards.get(activity.card_id);

    // Skip processing if card doesn't meet requirements
    if (
      !card?.description ||
      card.column_key !== TODO_COLUMN_KEY ||
      activity.actor.id === this.kaibanActor.id
    ) {
      return;
    }

    // STAGE 1: Transition card to DOING state
    await this.kaibanClient.cards.update(card.id, {
      column_key: DOING_COLUMN_KEY,
      status: CardStatus.DOING,
    });

    // Log transition activities
    await this.kaibanClient.cards.createBatchActivities(card.id, [
      {
        type: ActivityType.CARD_STATUS_CHANGED,
        description: 'Card status changed to doing',
        board_id: activity.board_id,
        team_id: activity.team_id,
        actor: this.kaibanActor,
        changes: [
          {
            field: 'status',
            new_value: CardStatus.DOING,
            old_value: card.status,
          },
        ],
      },
      {
        type: ActivityType.CARD_COLUMN_CHANGED,
        description: 'Card moved to doing column',
        board_id: activity.board_id,
        team_id: activity.team_id,
        actor: this.kaibanActor,
        changes: [
          {
            field: 'column_key',
            new_value: DOING_COLUMN_KEY,
            old_value: card.column_key,
          },
        ],
      },
    ]);

    try {
      // STAGE 2: Invoke your KaibanJS team to process the card's request
      const result = await processMyRequest(card.description);

      // STAGE 3: Update card with agent's response and mark as complete
      await this.kaibanClient.cards.update(card.id, {
        result: result,
        column_key: DONE_COLUMN_KEY,
        status: CardStatus.DONE,
      });

      // Log completion activities
      await this.kaibanClient.cards.createBatchActivities(card.id, [
        {
          type: ActivityType.CARD_STATUS_CHANGED,
          description: 'Card status changed to done',
          board_id: activity.board_id,
          team_id: activity.team_id,
          actor: this.kaibanActor,
          changes: [
            {
              field: 'status',
              new_value: CardStatus.DONE,
              old_value: CardStatus.DOING,
            },
          ],
        },
        {
          type: ActivityType.CARD_COLUMN_CHANGED,
          description: 'Card moved to done column',
          board_id: activity.board_id,
          team_id: activity.team_id,
          actor: this.kaibanActor,
          changes: [
            {
              field: 'column_key',
              new_value: DONE_COLUMN_KEY,
              old_value: DOING_COLUMN_KEY,
            },
          ],
        },
      ]);
    } catch (error) {
      // ERROR HANDLING: Move card to BLOCKED state for manual review
      await this.kaibanClient.cards.update(card.id, {
        column_key: BLOCKED_COLUMN_KEY,
        status: CardStatus.BLOCKED,
      });

      // Log error state transition
      await this.kaibanClient.cards.createBatchActivities(card.id, [
        {
          type: ActivityType.CARD_STATUS_CHANGED,
          description: 'Card status changed to blocked',
          board_id: activity.board_id,
          team_id: activity.team_id,
          actor: this.kaibanActor,
          changes: [
            {
              field: 'status',
              new_value: CardStatus.BLOCKED,
              old_value: CardStatus.DOING,
            },
          ],
        },
        {
          type: ActivityType.CARD_COLUMN_CHANGED,
          description: 'Card moved to blocked column',
          board_id: activity.board_id,
          team_id: activity.team_id,
          actor: this.kaibanActor,
          changes: [
            {
              field: 'column_key',
              new_value: BLOCKED_COLUMN_KEY,
              old_value: DOING_COLUMN_KEY,
            },
          ],
        },
      ]);

      console.error('Failed to process card:', error);
    }
  }
}
```

### Step 4: Create the A2A Executor

The executor processes incoming A2A requests and delegates to the Kaiban controller:

```typescript
// src/agents/my-agent/executor.ts
import {
  AgentExecutor,
  ExecutionEventBus,
  InMemoryTaskStore,
  RequestContext,
} from '@a2a-js/sdk/server';
import { A2ADataPartType, KaibanActivityPart } from '@kaiban/sdk';
import { MyKaibanController } from './controller/kaiban-controller';

export const tasksStore = new InMemoryTaskStore();

class MyAgentExecutor implements AgentExecutor {
  async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus,
  ): Promise<void> {
    const { taskId, contextId, userMessage } = requestContext;

    // PHASE 1: Acknowledge task receipt
    eventBus.publish({
      kind: 'task',
      id: taskId,
      contextId: contextId,
      status: {
        state: 'submitted',
        timestamp: new Date().toISOString(),
      },
    });

    // Extract data parts from user message
    const userMessageData = userMessage.parts.filter(
      (part) => part.kind === 'data',
    );

    if (userMessageData.length > 0) {
      // PHASE 2: Signal that agent is actively processing
      eventBus.publish({
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: 'working',
          timestamp: new Date().toISOString(),
        },
        final: false,
      });

      // Initialize Kaiban controller
      const kaibanController = await MyKaibanController.build();

      // PHASE 3: Process each Kaiban activity from the message
      for (const messageData of userMessageData) {
        switch (messageData.data.type) {
          case A2ADataPartType.KAIBAN_ACTIVITY:
            const part = messageData as KaibanActivityPart;
            console.log(
              'Processing Kaiban activity:',
              part.data.activity.type,
            );
            await kaibanController.processKaibanActivity(part.data.activity);
            break;
        }
      }
    }

    // PHASE 4: Signal successful task completion
    eventBus.publish({
      kind: 'status-update',
      taskId: taskId,
      contextId: contextId,
      status: {
        state: 'completed',
        timestamp: new Date().toISOString(),
      },
      final: true,
    });

    // Finalize event bus communication
    eventBus.finished();
  }

  async cancelTask(
    taskId: string,
    _eventBus: ExecutionEventBus,
  ): Promise<void> {
    console.log('Task cancellation requested:', taskId);
    throw new Error('Task cancellation is not yet implemented');
  }
}

export const myAgentExecutor = new MyAgentExecutor();
```

### Step 5: Create the A2A Handler

The handler assembles the A2A request handler by combining the agent card, task store, and executor:

```typescript
// src/agents/my-agent/handler.ts
import { DefaultRequestHandler } from '@a2a-js/sdk/server';
import { A2AExpressApp } from '@a2a-js/sdk/server/express';
import express from 'express';
import { myAgentCard } from './card';
import { tasksStore, myAgentExecutor } from './executor';

export const createMyAgentHandler = (agentUrl: string) => {
  return new DefaultRequestHandler(
    myAgentCard(agentUrl),
    tasksStore,
    myAgentExecutor,
  );
};

export const setupMyAgentRoutes = (
  app: express.Express,
  baseUrl: string,
) => {
  const agentPath = '/myAgent/a2a';
  const agentUrl = `${baseUrl}${agentPath}`;

  // Setup A2A routes
  new A2AExpressApp(createMyAgentHandler(agentUrl)).setupRoutes(
    app,
    agentPath,
  );

  return {
    agentUrl,
    cardUrl: `${agentUrl}/.well-known/agent-card.json`,
  };
};
```

### Step 6: Set Up the Express Server

Create the main server that handles A2A protocol requests:

```typescript
// src/index.ts
import 'dotenv/config';
import express from 'express';
import { setupMyAgentRoutes } from './agents/my-agent/handler';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const port = process.env.PORT || 4000;
const baseUrl = process.env.A2A_BASE_URL || `http://localhost:${port}`;

app.listen(port, () => {
  const routes = setupMyAgentRoutes(app, baseUrl);

  console.log(`
🚀 A2A Server running on port ${port}
📋 Agent Card: ${routes.cardUrl}
🤖 Agent Endpoint: ${routes.agentUrl}
  `);
});
```

## Environment Configuration

Create a `.env` file with the required environment variables:

```env
# Server Configuration
PORT=4000
A2A_BASE_URL=http://localhost:4000

# KaibanIO Platform Configuration
KAIBAN_TENANT=your-tenant
KAIBAN_API_TOKEN=your-api-token
KAIBAN_AGENT_ID=your-agent-id
KAIBAN_API_URL=https://your-tenant.kaiban.io/api

# LLM API Keys
OPENAI_API_KEY=your-openai-api-key
```

## Registering Your Agent in KaibanIO Platform

1. **Create an Agent in KaibanIO Platform**:
   - Log in to your KaibanIO platform dashboard
   - Navigate to Agents section
   - Create a new agent and note the Agent ID

2. **Get Your Agent Card URL**:
   - Start your server locally or deploy it
   - If running locally, use a tunneling service (like ngrok or localtunnel) to expose your server
   - Your agent card will be available at: `https://your-url.com/myAgent/a2a/.well-known/agent-card.json`

3. **Register the Agent**:
   - In the KaibanIO platform, register your agent using:
     - **Agent Card URL**: `https://your-url.com/myAgent/a2a/.well-known/agent-card.json`
     - **Agent Endpoint URL**: `https://your-url.com/myAgent/a2a`

4. **Assign to a Board**:
   - Assign your agent to a Kaiban board
   - When cards are created or updated, the platform will send activities to your agent

## Workflow Lifecycle

The integration follows a standard workflow lifecycle:

### TODO → DOING → DONE (or BLOCKED)

1. **TODO**: User creates a card in the Kaiban board with a description
2. **DOING**: The agent receives the activity, moves the card to DOING, and begins processing
3. **DONE**: Upon successful completion, the card is updated with results and moved to DONE
4. **BLOCKED**: If processing fails, the card is moved to BLOCKED for manual review

## Using WorkflowDrivenAgent

You can also use `WorkflowDrivenAgent` in your integration for more deterministic workflows:

```typescript
// src/agents/my-agent/controller/agent.ts
import { Agent, Task, Team } from 'kaibanjs';
import { createStep, createWorkflow } from '@kaibanjs/workflow';
import { z } from 'zod';

// Create workflow steps
const processStep = createStep({
  id: 'process',
  inputSchema: z.object({ userMessage: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    const { userMessage } = inputData as { userMessage: string };
    // Process the message
    return { result: `Processed: ${userMessage}` };
  },
});

// Create the workflow
const workflow = createWorkflow({
  id: 'my-workflow',
  inputSchema: z.object({ userMessage: z.string() }),
  outputSchema: z.object({ result: z.string() }),
});

workflow.then(processStep);
workflow.commit();

// Create WorkflowDrivenAgent
const workflowAgent = new Agent({
  type: 'WorkflowDrivenAgent',
  name: 'Workflow Agent',
  workflow: workflow,
});

const workflowTask = new Task({
  description: 'Process request: {userMessage}',
  expectedOutput: 'Processed result',
  agent: workflowAgent,
});

export const createMyTeam = (userMessage: string) => {
  return new Team({
    name: 'My Workflow Team',
    agents: [workflowAgent],
    tasks: [workflowTask],
    inputs: {
      userMessage,
    },
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    },
  });
};

export const processMyRequest = async (userMessage: string) => {
  const team = createMyTeam(userMessage);
  const { result = '' } = await team.start();
  
  if (result && typeof result === 'object') {
    return JSON.stringify(result);
  }
  
  return result as string;
};
```

## Best Practices

### 1. Error Handling

Implement comprehensive error handling in your Kaiban controller:

```typescript
try {
  const result = await processMyRequest(card.description);
  // Update card with success
} catch (error) {
  // Log error details
  console.error('Processing error:', error);
  
  // Move card to BLOCKED with error details
  await this.kaibanClient.cards.update(card.id, {
    column_key: BLOCKED_COLUMN_KEY,
    status: CardStatus.BLOCKED,
    result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
  });
}
```

### 2. Activity Logging

Always log activities for audit trails:

```typescript
await this.kaibanClient.cards.createBatchActivities(card.id, [
  {
    type: ActivityType.CARD_STATUS_CHANGED,
    description: 'Card status changed',
    board_id: activity.board_id,
    team_id: activity.team_id,
    actor: this.kaibanActor,
    changes: [
      {
        field: 'status',
        new_value: CardStatus.DONE,
        old_value: CardStatus.DOING,
      },
    ],
  },
]);
```

### 3. Validation

Validate card requirements before processing:

```typescript
if (
  !card?.description ||
  card.column_key !== TODO_COLUMN_KEY ||
  activity.actor.id === this.kaibanActor.id
) {
  return; // Skip processing
}
```

### 4. Security

- Use HTTPS in production
- Validate all incoming requests
- Store API keys securely in environment variables
- Implement proper CORS configuration for production

### 5. Performance

- Use appropriate timeouts for long-running tasks
- Implement proper cleanup of resources
- Monitor memory usage for large workflow executions

## Troubleshooting

### Common Issues

1. **Agent Not Found Error**:
   - Verify `KAIBAN_AGENT_ID` matches the agent ID in the platform
   - Ensure the agent exists in your KaibanIO tenant

2. **CORS Errors**:
   - Ensure proper CORS configuration
   - For production, specify allowed origins instead of using `*`

3. **Card Not Processing**:
   - Verify the card is in the TODO column
   - Check that the card has a description
   - Ensure the agent is assigned to the board

4. **Connection Errors**:
   - Verify `KAIBAN_API_URL` is correct
   - Check that `KAIBAN_TENANT` and `KAIBAN_API_TOKEN` are valid
   - Ensure your server is accessible from the internet (for production)

### Debug Tips

- Enable detailed logging for A2A protocol interactions
- Monitor the event bus for proper message flow
- Test with simple card descriptions before complex workflows
- Check the KaibanIO platform activity logs for card updates

## Deployment Considerations

### Development

For local development, use a tunneling service to expose your server:

```bash
# Using ngrok
ngrok http 4000

# Using localtunnel
npx localtunnel --port 4000
```

Update your `A2A_BASE_URL` environment variable with the tunnel URL.

### Production

For production deployment:

1. **Deploy your server** to a hosting platform (Vercel, Railway, Google Cloud Run, etc.)
2. **Set environment variables** in your hosting platform
3. **Update agent registration** in KaibanIO platform with production URLs
4. **Configure CORS** to allow only KaibanIO platform origins
5. **Use HTTPS** for secure communication

## Example: Complete Integration

See the [kaiban-agents-starter](https://github.com/kaiban-ai/kaiban-agents-starter) repository for complete working examples:

- **Airline Revenue Management**: Demonstrates Excel file processing and revenue analysis
- **Pilot Sourcing**: Shows freelance pilot sourcing from Excel data

These examples provide full implementations of the integration pattern described in this guide.

## Conclusion

Integrating KaibanJS teams with the KaibanIO platform enables powerful enterprise workflow automation. By following this guide, you can:

- **Integrate seamlessly** with existing enterprise workflows
- **Maintain full governance** and visibility into agent execution
- **Scale safely** from single agents to connected multi-agent ecosystems
- **Deliver measurable value** through standardized processes and performance tracking

The standardized A2A protocol ensures interoperability between KaibanJS agents and the KaibanIO platform, while KaibanJS provides a powerful framework for building multi-agent AI systems. Together, they enable developers to transform AI agents from isolated experiments into reliable, governed, and high-impact operational capabilities.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
