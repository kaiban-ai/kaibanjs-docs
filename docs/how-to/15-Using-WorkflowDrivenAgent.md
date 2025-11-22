---
title: Using WorkflowDrivenAgent
description: Learn how to create and use WorkflowDrivenAgent with complex workflows, LLM SDKs integration, suspension, and team integration.
---

## Introduction

The `WorkflowDrivenAgent` is a specialized agent that executes workflows instead of using LLM-based reasoning. This agent maintains workflow state and can handle suspension and resumption operations for long-running workflows. Unlike standard agents, `WorkflowDrivenAgent` focuses on deterministic, step-by-step execution while still allowing you to use LLM SDKs within workflow steps.

For a conceptual overview, see [WorkflowDrivenAgent](../core-concepts/10-WorkflowDrivenAgent.md).

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Features

- **Workflow Execution**: Executes workflows defined using the `@kaibanjs/workflow` package
- **State Management**: Maintains workflow state between executions
- **Suspension and Resumption**: Supports workflows that can be suspended and resumed
- **Team Compatibility**: Integrates seamlessly with the existing team system
- **Error Handling**: Robust error handling with detailed logging
- **Real-time Logging**: Specific logs for workflow events mixed with general team logs
- **LLM SDK Integration**: Use LangChain, AI SDK, or other LLM libraries within workflow steps

## Installation

First, ensure you have the required packages installed:

```bash
npm install kaibanjs @kaibanjs/workflow zod
```

Or with pnpm:

```bash
pnpm install kaibanjs @kaibanjs/workflow zod
```

For LLM SDK integration, you may also need:

```bash
npm install @langchain/openai @langchain/community @ai-sdk/openai ai
```

## Basic Usage

### Creating a WorkflowDrivenAgent

```typescript
import { Agent } from 'kaibanjs';
import { createStep, createWorkflow } from '@kaibanjs/workflow';
import { z } from 'zod';

// Create workflow steps
const processStep = createStep({
  id: 'process',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    const { data } = inputData as { data: string };
    return { result: data.toUpperCase() };
  }
});

// Create the workflow
const workflow = createWorkflow({
  id: 'example-workflow',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() })
});

workflow.then(processStep);
workflow.commit();

// Create the WorkflowDrivenAgent using the Agent wrapper
const agent = new Agent({
  type: 'WorkflowDrivenAgent',
  name: 'Workflow Agent',
  workflow: workflow
});

// The agent will be automatically initialized when assigned to a team
```

### Using the Agent in a Team

The `WorkflowDrivenAgent` integrates seamlessly with the existing team system:

```typescript
import { Agent, Task, Team } from 'kaibanjs';

const team = new Team({
  name: 'Workflow Team',
  agents: [
    new Agent({
      type: 'WorkflowDrivenAgent',
      name: 'Data Processor',
      workflow: workflow
    }),
    new Agent({
      type: 'ReactChampionAgent',
      name: 'Analyst',
      role: 'Analyze results',
      goal: 'Provide insights on processed data',
      background: 'Data analysis expert'
    })
  ],
  tasks: [
    new Task({
      description: 'Process the input data using workflow',
      expectedOutput: 'Processed data result',
      agent: 'Data Processor'
    }),
    new Task({
      description: 'Analyze the processed data',
      expectedOutput: 'Analysis insights',
      agent: 'Analyst'
    })
  ]
});

// Execute the team
const result = await team.start({ data: 'input data' });
```

## Using LLM SDKs in Workflow Steps

One of the powerful features of `WorkflowDrivenAgent` is the ability to use LLM SDKs (like LangChain, AI SDK, etc.) within workflow steps. This allows you to combine deterministic workflow orchestration with LLM-powered steps.

### Example: LangChain + AI SDK Integration

Here's a complete example showing how to use both LangChain and Vercel AI SDK within a workflow:

```typescript
import { Agent, Task, Team } from 'kaibanjs';
import { createStep, createWorkflow } from '@kaibanjs/workflow';
import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from '@langchain/core/prompts';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Step 1: LangChain-based search agent
const searchStep = createStep({
  id: 'search',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({
    searchResults: z.string(),
    sources: z.array(z.string())
  }),
  execute: async ({ inputData }) => {
    const { query } = inputData;

    // Create search tool
    const searchTool = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY || ''
    });

    // Create search agent with LangChain
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY || ''
    });

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are a search agent that helps find relevant information on the internet.
        Your task is to search for information about the given topic and return the most relevant results.
        Be thorough and comprehensive in your search.
        Focus on finding factual, up-to-date information.`
      ),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
      new MessagesPlaceholder('agent_scratchpad')
    ]);

    const agent = createToolCallingAgent({
      llm: model,
      tools: [searchTool],
      prompt
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools: [searchTool]
    });

    const result = await agentExecutor.invoke({
      input: query
    });

    // Extract sources from the search results
    const sources =
      result.intermediateSteps?.map(
        step => step.action?.toolInput?.query || 'Unknown source'
      ) || [];

    return {
      searchResults: result.output,
      sources: sources.slice(0, 5) // Limit to 5 sources
    };
  }
});

// Step 2: AI SDK-based analysis and summarization
const analyzeStep = createStep({
  id: 'analyze',
  inputSchema: z.object({
    searchResults: z.string(),
    sources: z.array(z.string())
  }),
  outputSchema: z.object({
    analysis: z.string(),
    keyPoints: z.array(z.string()),
    summary: z.string(),
    confidence: z.number()
  }),
  execute: async ({ inputData, getInitData }) => {
    const { searchResults, sources } = inputData;
    const { query } = getInitData();

    // Use Vercel AI SDK for analysis
    const { text: response } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are an expert analyst that processes search results and provides comprehensive analysis.
      Your task is to:
      1. Analyze the search results for the query: "${query}"
      2. Extract key points and insights
      3. Provide a concise summary
      4. Assess the confidence level of the information (0-1 scale)
      
      Be objective, factual, and highlight the most important information.`,
      prompt: `Search Results: ${searchResults}
      
      Sources: ${sources.join(', ')}
      
      Please provide:
      1. A detailed analysis of the findings
      2. Key points as a bulleted list
      3. A concise summary
      4. Confidence level (0-1)`,
      temperature: 0.3
    });

    // Parse the response to extract structured data
    const analysis =
      response
        .split('\n')
        .find(
          line => line.includes('Analysis:') || line.includes('analysis:')
        ) || response;
    const keyPointsMatch = response.match(
      /Key Points?:?\s*([\s\S]*?)(?=Summary:|$)/i
    );
    const summaryMatch = response.match(
      /Summary:?\s*([\s\S]*?)(?=Confidence:|$)/i
    );
    const confidenceMatch = response.match(/Confidence:?\s*([0-9.]+)/i);

    const keyPoints = keyPointsMatch
      ? keyPointsMatch[1]
          .split('\n')
          .filter(
            line => line.trim().startsWith('-') || line.trim().startsWith('•')
          )
          .map(point => point.replace(/^[-•]\s*/, '').trim())
          .filter(point => point.length > 0)
      : ['No key points extracted'];

    const summary = summaryMatch
      ? summaryMatch[1].trim()
      : 'Summary not available';
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7;

    return {
      analysis: analysis.replace(/Analysis:?\s*/i, '').trim(),
      keyPoints: keyPoints.slice(0, 5), // Limit to 5 key points
      summary,
      confidence: Math.min(Math.max(confidence, 0), 1) // Ensure between 0 and 1
    };
  }
});

// Create the workflow
const researchWorkflow = createWorkflow({
  id: 'research-workflow',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({
    analysis: z.string(),
    keyPoints: z.array(z.string()),
    summary: z.string(),
    confidence: z.number(),
    sources: z.array(z.string())
  })
});

// Build the workflow: search -> analyze
researchWorkflow.then(searchStep).then(analyzeStep);
researchWorkflow.commit();

// Define the workflow-driven agent
const researchAgent = new Agent({
  name: 'Research Agent',
  type: 'WorkflowDrivenAgent',
  workflow: researchWorkflow
});

// Define the LLM-based insights agent
const insightsAgent = new Agent({
  name: 'Insights Generator',
  role: 'Research Insights Expert',
  goal: 'Generate additional insights and recommendations based on research findings',
  background:
    'Expert in research analysis, trend identification, and strategic recommendations',
  type: 'ReactChampionAgent',
  tools: []
});

// Create a mixed team
const team = new Team({
  name: 'Research Team',
  agents: [researchAgent, insightsAgent],
  tasks: [
    new Task({
      description: 'Research and analyze information about: {query}',
      expectedOutput:
        'Comprehensive research analysis with key points, summary, and confidence assessment',
      agent: researchAgent
    }),
    new Task({
      description:
        'Generate strategic insights and recommendations based on the research findings',
      expectedOutput:
        'Strategic insights, recommendations, and actionable next steps',
      agent: insightsAgent
    })
  ],
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY
  }
});
```

### Benefits of Using LLM SDKs in Workflows

- **Flexibility**: Use any LLM SDK (LangChain, AI SDK, OpenAI SDK, etc.) within workflow steps
- **Type Safety**: Maintain type safety with Zod schemas for inputs and outputs
- **Orchestration**: Combine multiple LLM calls in a structured, deterministic workflow
- **Error Handling**: Built-in error handling and retry logic at the workflow level
- **State Management**: Track the state of complex LLM-powered workflows
- **Monitoring**: Real-time logging and monitoring of each step in the workflow

## Complex Workflows

The `WorkflowDrivenAgent` can handle complex workflows with multiple patterns:

### Sequential Execution

```typescript
const addStep = createStep({
  id: 'add',
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  outputSchema: z.number(),
  execute: async ({ inputData }) => {
    const { a, b } = inputData as { a: number; b: number };
    return a + b;
  }
});

const multiplyStep = createStep({
  id: 'multiply',
  inputSchema: z.number(),
  outputSchema: z.number(),
  execute: async ({ inputData, getInitData }) => {
    const sum = inputData as number;
    const { a, b } = getInitData() as { a: number; b: number };
    return sum * a * b;
  }
});

const workflow = createWorkflow({
  id: 'math-workflow',
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  outputSchema: z.number()
});

// Sequential execution: add -> multiply
workflow.then(addStep).then(multiplyStep);
workflow.commit();
```

### Conditional Branching

```typescript
const evenStep = createStep({
  id: 'even',
  inputSchema: z.number(),
  outputSchema: z.string(),
  execute: async ({ inputData }) => {
    const num = inputData as number;
    return `even: ${num}`;
  }
});

const oddStep = createStep({
  id: 'odd',
  inputSchema: z.number(),
  outputSchema: z.string(),
  execute: async ({ inputData }) => {
    const num = inputData as number;
    return `odd: ${num}`;
  }
});

const workflow = createWorkflow({
  id: 'conditional-workflow',
  inputSchema: z.number(),
  outputSchema: z.string()
});

// Conditional branching based on input
workflow.branch([
  [async ({ inputData }) => (inputData as number) % 2 === 0, evenStep],
  [async () => true, oddStep] // fallback
]);
workflow.commit();
```

### Parallel Execution

```typescript
const fetchUserStep = createStep({
  id: 'fetchUser',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ user: z.object({ name: z.string() }) }),
  execute: async ({ inputData }) => {
    // Fetch user data
    return { user: { name: 'John Doe' } };
  }
});

const fetchPostsStep = createStep({
  id: 'fetchPosts',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({ posts: z.array(z.string()) }),
  execute: async ({ inputData }) => {
    // Fetch posts
    return { posts: ['Post 1', 'Post 2'] };
  }
});

const combineStep = createStep({
  id: 'combine',
  inputSchema: z.any(),
  outputSchema: z.object({
    user: z.object({ name: z.string() }),
    posts: z.array(z.string())
  }),
  execute: async ({ getStepResult }) => {
    const userResult = getStepResult('fetchUser') as { user: { name: string } };
    const postsResult = getStepResult('fetchPosts') as { posts: string[] };
    return {
      user: userResult.user,
      posts: postsResult.posts
    };
  }
});

const workflow = createWorkflow({
  id: 'parallel-workflow',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({
    user: z.object({ name: z.string() }),
    posts: z.array(z.string())
  })
});

// Parallel execution: fetchUser and fetchPosts run simultaneously
workflow.parallel([fetchUserStep, fetchPostsStep]).then(combineStep);
workflow.commit();
```

### Loops

```typescript
const processItemStep = createStep({
  id: 'processItem',
  inputSchema: z.object({ item: z.string(), index: z.number() }),
  outputSchema: z.object({ processed: z.string() }),
  execute: async ({ inputData }) => {
    const { item, index } = inputData as { item: string; index: number };
    return { processed: `${item}-${index}` };
  }
});

// Do-while loop
const workflow = createWorkflow({
  id: 'loop-workflow',
  inputSchema: z.object({ items: z.array(z.string()) }),
  outputSchema: z.array(z.string())
});

workflow.dowhile(processItemStep, async ({ getStepResult }) => {
  const result = getStepResult('processItem');
  // Continue while condition is true
  return (result as any).index < 5;
});
workflow.commit();

// Foreach loop with concurrency
const foreachWorkflow = createWorkflow({
  id: 'foreach-workflow',
  inputSchema: z.array(z.string()),
  outputSchema: z.array(z.string())
});

foreachWorkflow.foreach(processItemStep, { concurrency: 3 });
foreachWorkflow.commit();
```

## Agent Methods

The `WorkflowDrivenAgent` provides several key methods for managing workflow execution:

### `workOnTask(task, inputs, context)`

Executes the assigned workflow with task inputs. This is the main method called by the team system when a task is assigned to the agent.

```typescript
const result = await workflowAgent.workOnTask(
  task,
  { data: 'input' },
  'context'
);
```

### `workOnTaskResume(task)`

Resumes a suspended workflow. Use this method when a workflow has been suspended and you want to continue execution.

```typescript
// When a workflow suspends, you can resume it later
await workflowAgent.workOnTaskResume(task);
```

### `workOnFeedback(task, feedbackList, context)`

Not applicable for workflow-based agents. This method returns an error indicating that feedback processing is not implemented for workflow-driven agents.

### `reset()`

Resets the agent and workflow state. This clears the current run ID, workflow status, and all execution metadata.

```typescript
workflowAgent.reset();
```

### `getCleanedAgent()`

Returns a clean version of the agent without sensitive information. Useful for logging or debugging.

```typescript
const cleaned = workflowAgent.getCleanedAgent();
```

## Suspension and Resumption

The `WorkflowDrivenAgent` supports workflows that can suspend and resume, which is useful for workflows requiring manual approval or external input.

### Creating a Suspendable Workflow

```typescript
const approvalStep = createStep({
  id: 'approval',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ approved: z.boolean() }),
  suspendSchema: z.object({ reason: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  execute: async ({ inputData, suspend, isResuming, resumeData }) => {
    if (isResuming) {
      return { approved: resumeData.approved };
    }

    // Suspend for manual approval
    await suspend({ reason: 'requires_manual_approval' });
    return { approved: false };
  }
});

const approvalWorkflow = createWorkflow({
  id: 'approval-workflow',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ approved: z.boolean() })
});

approvalWorkflow.then(approvalStep);
approvalWorkflow.commit();

const approvalAgent = new Agent({
  type: 'WorkflowDrivenAgent',
  name: 'Approval Agent',
  workflow: approvalWorkflow
});
```

### Resuming a Suspended Workflow

When a workflow suspends, the agent's status is set to `PAUSED` and the workflow status becomes `suspended`. You can resume it using the `workOnTaskResume` method:

```typescript
// When a workflow suspends, you can resume it later
const task = new Task({
  description: 'Approve the data',
  expectedOutput: 'Approval result',
  agent: 'Approval Agent',
  inputs: { approved: true } // Resume data
});

// Resume the workflow using the agent's method
await approvalAgent.workOnTaskResume(task);
```

## Agent State Management

The `WorkflowDrivenAgent` maintains workflow state internally:

- **currentRunId**: ID of the current workflow run
- **workflowStatus**: Current workflow status (`idle`, `running`, `suspended`, `completed`, `failed`)
- **lastResult**: Last workflow result
- **lastError**: Last workflow error
- **metadata**: Execution metadata (iterations, times, etc.)

The agent automatically manages this state during workflow execution. The state is reset when the agent is reset or when a new workflow execution begins.

## Runtime Context

The `WorkflowDrivenAgent` automatically creates a runtime context that includes:

- Task data (id, description, status, inputs)
- Agent information (name)
- Task context

This context is automatically provided to all workflow steps by the agent, allowing steps to access task and agent information:

```typescript
const contextAwareStep = createStep({
  id: 'contextStep',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.string(),
  execute: async ({ inputData, runtimeContext }) => {
    const taskId = runtimeContext?.get('task.id');
    const taskDescription = runtimeContext?.get('task.description');
    const agentName = runtimeContext?.get('agent.name');

    // Use context in your step logic
    return `Processed ${inputData.data} for task ${taskId} by ${agentName}: ${taskDescription}`;
  }
});
```

The agent automatically populates this context when executing workflows, so you don't need to manually create or pass it.

## Monitoring and Logging

The `WorkflowDrivenAgent` automatically subscribes to workflow events and generates specific logs that integrate with the team's logging system:

- 🚀 WorkflowDrivenAgent started workflow execution
- ⚡ WorkflowDrivenAgent started step: [stepId]
- ✅ WorkflowDrivenAgent completed step: [stepId]
- ❌ WorkflowDrivenAgent failed step: [stepId]
- ✅ WorkflowDrivenAgent completed workflow execution
- 🏁 WorkflowDrivenAgent completed task successfully

### Logging Features

- **Real-time logs**: Each workflow event is logged immediately
- **Specific logs**: `WorkflowAgentStatusUpdate` category to distinguish from other agents
- **Backward compatibility**: `ReactChampionAgent` logs maintain their original format
- **Integration with workflowLogs**: Logs appear mixed in the general team flow

### Accessing Workflow Logs

```typescript
const team = new Team({
  name: 'Logging Team',
  agents: [workflowAgent],
  tasks: [task]
});

const result = await team.start({ data: 'test' });

// Access workflow logs from the team store
const workflowLogs = team.store.getState().workflowLogs;
const workflowAgentLogs = workflowLogs.filter(
  log => log.logType === 'WorkflowAgentStatusUpdate'
);

console.log('Workflow logs:', workflowAgentLogs);
```

## Error Handling

The `WorkflowDrivenAgent` handles different types of errors gracefully:

### Types of Errors Handled

- **Workflow Failed**: When the workflow fails during execution
- **Workflow Suspended**: When the workflow suspends for manual intervention
- **Execution Error**: Errors during workflow execution
- **Step Failed**: When a specific workflow step fails

### Error Handling Behavior

When an error occurs:

1. The agent's status is set to `TASK_ABORTED`
2. The workflow status is set to `failed`
3. The error is stored in `lastError`
4. The error is logged with the `WorkflowAgentStatusUpdate` log type
5. The team's error handling system is notified

### Example: Error Handling in Workflow Steps

```typescript
const errorHandlingStep = createStep({
  id: 'errorStep',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.string(),
  execute: async ({ inputData }) => {
    if (!inputData.data) {
      throw new Error('Data is required');
    }
    return inputData.data;
  }
});

// Errors are automatically caught and handled by the agent
// The workflow status will be set to 'failed'
// The error is stored in the agent's lastError property
```

### Handling Failed Workflows

```typescript
// After execution, check the result
const result = await team.start({ data: 'test' });

// If the workflow failed, the agent's status will be TASK_ABORTED
// You can access the error through the team's state or agent's lastError
const agentState = workflowAgent.getCleanedAgent();
// The error information is available in the agent's state
```

## Advanced Patterns

### Data Mapping Between Steps

```typescript
const userStep = createStep({
  id: 'user',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({
    user: z.object({ id: z.string(), name: z.string() })
  }),
  execute: async ({ inputData }) => {
    return { user: { id: inputData.userId, name: 'John' } };
  }
});

const profileStep = createStep({
  id: 'profile',
  inputSchema: z.object({
    profile: z.object({ id: z.string(), name: z.string() })
  }),
  outputSchema: z.string(),
  execute: async ({ inputData }) => {
    return `Profile: ${inputData.profile.name}`;
  }
});

const workflow = createWorkflow({
  id: 'mapping-workflow',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.string()
});

// Map data between steps
workflow
  .then(userStep)
  .map(async ({ getStepResult }) => {
    const userResult = getStepResult('user') as {
      user: { id: string; name: string };
    };
    return {
      profile: {
        id: userResult.user.id,
        name: userResult.user.name
      }
    };
  })
  .then(profileStep);
workflow.commit();
```

### Nested Workflows

```typescript
const nestedWorkflow = createWorkflow({
  id: 'nested',
  inputSchema: z.number(),
  outputSchema: z.number()
});

const doubleStep = createStep({
  id: 'double',
  inputSchema: z.number(),
  outputSchema: z.number(),
  execute: async ({ inputData }) => {
    return (inputData as number) * 2;
  }
});

nestedWorkflow.then(doubleStep);
nestedWorkflow.commit();

const mainWorkflow = createWorkflow({
  id: 'main',
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  outputSchema: z.number()
});

const addStep = createStep({
  id: 'add',
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  outputSchema: z.number(),
  execute: async ({ inputData }) => {
    const { a, b } = inputData as { a: number; b: number };
    return a + b;
  }
});

mainWorkflow.then(addStep).then(nestedWorkflow);
mainWorkflow.commit();
```

## Best Practices

1. **Always commit workflows**: Call `workflow.commit()` after defining your workflow steps.

2. **Use type-safe schemas**: Leverage Zod schemas for input/output validation to catch errors early.

3. **Handle errors gracefully**: Implement proper error handling in your step execution functions.

4. **Use runtime context**: Take advantage of the runtime context to access task and agent information.

5. **Monitor workflow state**: Use the logging system to track workflow execution and debug issues.

6. **Test workflows independently**: Test your workflows before integrating them into agents.

7. **Keep steps focused**: Each step should have a single, well-defined responsibility.

## Differences from ReactChampionAgent

| Aspect            | ReactChampionAgent                    | WorkflowDrivenAgent              |
| ----------------- | ------------------------------------- | -------------------------------- |
| **Reasoning**     | LLM-based decision making             | Workflow-driven execution        |
| **Configuration** | Requires `role`, `goal`, `background` | Requires `workflow` definition   |
| **Execution**     | Dynamic, LLM-guided                   | Deterministic, step-by-step      |
| **State**         | Agent state only                      | Workflow state + Agent state     |
| **Logging**       | `ReactChampionAgent` logs             | `WorkflowAgentStatusUpdate` logs |
| **Feedback**      | Supports `workOnFeedback`             | Not applicable (returns error)   |
| **Suspension**    | Limited support                       | Native suspend/resume support    |
| **LLM Usage**     | Built-in LLM reasoning                | Can use LLM SDKs in steps        |

## Compatibility

The `WorkflowDrivenAgent` is fully compatible with:

- Existing team system
- Logging and monitoring system
- Error handling system
- Agent state system
- Backward compatibility with `ReactChampionAgent`

## Conclusion

The `WorkflowDrivenAgent` provides a powerful way to execute deterministic, structured workflows within the KaibanJS framework. By combining workflow patterns with team integration and the ability to use LLM SDKs within workflow steps, you can build complex, reliable processes that work seamlessly alongside LLM-based agents.

Key advantages:

- **Deterministic execution**: Predictable, repeatable workflows
- **LLM integration**: Use LangChain, AI SDK, or other LLM libraries within steps
- **State management**: Built-in workflow state tracking
- **Team integration**: Works seamlessly with ReactChampionAgent in mixed teams
- **Error handling**: Robust error handling with detailed logging

For more information about workflows, see the [@kaibanjs/workflow documentation](https://github.com/kaiban-ai/KaibanJS/tree/main/packages/workflow).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
