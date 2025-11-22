---
title: WorkflowDrivenAgent
description: Learn about WorkflowDrivenAgent, a specialized agent that executes workflows instead of using LLM-based reasoning.
---

## What is a WorkflowDrivenAgent?

> A **WorkflowDrivenAgent** is a specialized agent that executes predefined workflows instead of using traditional LLM-based reasoning. Unlike standard agents that use language models to make decisions, WorkflowDrivenAgents follow a deterministic workflow pattern, making them ideal for structured, repeatable processes.

The `WorkflowDrivenAgent` is designed for scenarios where you need:
- **Deterministic execution**: Predictable, step-by-step processes
- **Complex orchestration**: Multi-step workflows with conditional logic, parallel processing, and loops
- **State management**: Maintain workflow state between executions
- **Suspension and resumption**: Handle long-running workflows that may require manual intervention

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Key Differences from Standard Agents

| Feature | Standard Agent (ReactChampionAgent) | WorkflowDrivenAgent |
|---------|-----------------------------------|---------------------|
| **Reasoning** | LLM-based decision making | Workflow-driven execution |
| **Configuration** | Requires `role`, `goal`, `background` | Requires `workflow` definition |
| **Execution** | Dynamic, LLM-guided | Deterministic, step-by-step |
| **State** | Agent state | Workflow state + Agent state |
| **Suspension** | Limited support | Native suspend/resume support |

## Basic Example

Here's a simple example of creating and using a `WorkflowDrivenAgent`:

```typescript
import { Agent } from 'kaibanjs';
import { createStep, createWorkflow } from '@kaibanjs/workflow';
import { z } from 'zod';

// Create a workflow step
const processStep = createStep({
  id: 'process',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    const { data } = inputData as { data: string };
    return { result: data.toUpperCase() };
  },
});

// Create the workflow
const workflow = createWorkflow({
  id: 'example-workflow',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
});

workflow.then(processStep);
workflow.commit();

// Create the WorkflowDrivenAgent
const agent = new Agent({
  type: 'WorkflowDrivenAgent',
  name: 'Data Processor',
  workflow: workflow,
});
```

## How It Works

1. **Workflow Definition**: You define a workflow using the `@kaibanjs/workflow` package with steps, input/output schemas, and execution logic.

2. **Agent Creation**: The agent is created with the workflow assigned to it, replacing the traditional `role`, `goal`, and `background` configuration.

3. **Task Execution**: When assigned a task, the agent executes the workflow with the task's input data, following the defined steps sequentially, in parallel, or conditionally.

4. **State Management**: The agent maintains workflow state internally, tracking execution progress, results, and any suspension points.

5. **Team Integration**: The agent integrates seamlessly with teams, working alongside standard LLM-based agents.

## When to Use WorkflowDrivenAgent

Consider using a `WorkflowDrivenAgent` when:

- ✅ You have a well-defined, repeatable process
- ✅ You need deterministic execution (same input = same output)
- ✅ You require complex orchestration (parallel steps, conditionals, loops)
- ✅ You need to suspend and resume workflows
- ✅ You want to avoid LLM costs for structured processes
- ✅ You need type-safe workflow definitions

Use standard agents when:
- ❌ You need creative problem-solving
- ❌ The process requires dynamic decision-making
- ❌ You need natural language understanding
- ❌ The workflow is too complex to define upfront

## Team Compatibility

`WorkflowDrivenAgent` integrates seamlessly with the existing team system:

```typescript
import { Agent, Task, Team } from 'kaibanjs';

const team = new Team({
  name: 'Mixed Team',
  agents: [
    new Agent({
      type: 'WorkflowDrivenAgent',
      name: 'Data Processor',
      workflow: dataProcessingWorkflow,
    }),
    new Agent({
      type: 'ReactChampionAgent',
      name: 'Analyst',
      role: 'Analyze results',
      goal: 'Provide insights on processed data',
      background: 'Data analysis expert',
    }),
  ],
  tasks: [
    new Task({
      description: 'Process the input data using workflow',
      expectedOutput: 'Processed data result',
      agent: 'Data Processor',
    }),
    new Task({
      description: 'Analyze the processed data',
      expectedOutput: 'Analysis insights',
      agent: 'Analyst',
    }),
  ],
});
```

## Next Steps

To learn more about creating and using `WorkflowDrivenAgent` in detail, check out the [Using WorkflowDrivenAgent](../how-to/15-Using-WorkflowDrivenAgent.md) guide, which covers:

- Creating complex workflows with multiple patterns
- Handling suspension and resumption
- State management and monitoring
- Error handling
- Advanced workflow patterns

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::

