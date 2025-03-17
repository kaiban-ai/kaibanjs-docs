---
title: Memory
description: Understanding KaibanJS's Memory System for Task Result Management
---

## What is Memory in KaibanJS?

> Memory in KaibanJS is a powerful feature that controls how task results flow through your workflow. When enabled, it automatically makes all previous task results available to subsequent tasks. When disabled, it requires explicit references to access specific task results, giving you precise control over task dependencies and resource usage.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## How Memory Works

The memory system in KaibanJS operates at the team level and significantly impacts how tasks interact:

- When memory is enabled (default), all previous task results are automatically included in subsequent tasks' context
- When memory is disabled, tasks only receive results that are explicitly referenced using `{taskResult:taskN}`
- This choice affects not just data flow but also token usage, task clarity, and overall workflow design

### Configuring Memory

Memory configuration is a strategic decision when creating a team:

```js
const team = new Team({
  name: 'Content Creation Team',
  agents: [researcher, writer, editor],
  tasks: [researchTask, writingTask, editingTask],
  memory: true,  // All task results available (default)
  // memory: false,  // Only explicitly referenced results available
});
```

## Memory States

### Memory Enabled (Default)

When memory is enabled, tasks have comprehensive access to previous results:

```js
const researchTask = new Task({
  description: 'Research the latest AI developments in healthcare',
  expectedOutput: 'Key findings in JSON format',
  agent: researcher
});

const analysisTask = new Task({
  description: 'Analyze the implications of these findings',
  expectedOutput: 'Analysis report',
  agent: analyst
});

const recommendationTask = new Task({
  description: 'Provide recommendations based on the research and analysis',
  expectedOutput: 'Strategic recommendations',
  agent: advisor
});
```

With `memory: true`:
- Each task automatically receives all previous task results in its context
- Enables fluid information flow in complex workflows
- Allows tasks to reference any previous result without explicit declarations
- Increases token usage proportionally to workflow size

### Memory Disabled

When memory is disabled, you gain precise control over result access:

```js
const team = new Team({
  name: 'Healthcare AI Analysis Team',
  agents: [researcher, analyst, advisor],
  tasks: [researchTask, analysisTask, recommendationTask],
  memory: false  // Explicit result management
});

// Precise control over which results are available
const recommendationTask = new Task({
  description: `Create recommendations using:
    Research findings: {taskResult:task1}
    Analysis: {taskResult:task2}`,
  expectedOutput: 'Strategic recommendations',
  agent: advisor
});
```

Benefits of disabling memory:
- Precise control over task dependencies
- Optimized token usage through selective result access
- Clear and explicit data flow documentation
- Better performance in large or complex workflows

## Strategic Considerations

### When to Enable Memory

Enable memory for workflows where comprehensive result access enhances task execution:

1. **Complex Analysis Workflows**
   - Research projects requiring broad context
   - Multi-faceted evaluations
   - Iterative refinement processes

2. **Creative and Analytical Tasks**
   - Content creation and editing
   - Comprehensive report generation
   - Decision-making processes requiring full context

### When to Disable Memory

Disable memory for workflows where controlled result access is crucial:

1. **Structured Workflows**
   - Clear, linear task dependencies
   - Step-by-step transformations
   - Processes requiring explicit data flow

2. **Performance-Critical Systems**
   - Large-scale operations
   - Token-sensitive workflows
   - High-throughput processes

## Best Practices

1. **Strategic Memory Configuration**
   - Consider workflow complexity and data dependencies
   - Evaluate token usage implications
   - Plan for workflow scalability

2. **Task Design**
   - Design tasks with clear input requirements
   - Document result dependencies explicitly
   - Structure workflows to optimize result usage

3. **Performance Optimization**
   - Monitor and analyze token usage patterns
   - Balance accessibility with efficiency
   - Consider hybrid approaches for complex workflows

4. **Workflow Architecture**
   - Design task sequences with memory implications in mind
   - Plan for result dependency management
   - Document memory-related design decisions

## Conclusion

Memory in KaibanJS is a sophisticated feature that fundamentally affects how information flows through your workflows. While its mechanism is straightforward - controlling access to previous task results - its implications for workflow design, performance, and maintainability are significant. Choose your memory configuration based on careful consideration of your workflow's complexity, performance requirements, and maintenance needs.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 