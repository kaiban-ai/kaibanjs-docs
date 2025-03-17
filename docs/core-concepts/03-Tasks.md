---
title: Tasks
description: What are Tasks and how to use them.
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/qhpchYMZr-w?si=L_9Mz7FagIIDkNd4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></iframe>
</div>

## What is a Task?

> A Task is a **defined piece of work** assigned to agents, characterized by:
>
> - Clear Instructions: Details exactly what needs to be accomplished.
> - Defined Outcome: Specifies the expected result upon completion.
> - Assigned Responsibility: Allocated to a specific agent equipped to handle the task.
>
> Tasks are essential in organizing efforts and driving projects towards successful outcomes.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Creating a Task

To create a task, you start by initializing an instance of the `Task` class with the necessary properties. Here's how you can do it:

```js
import { Task } from 'kaibanjs';

const searchTask = new Task({
    description: 'Search for detailed information about the sports query: {sportsQuery}.',
    expectedOutput: `Detailed information about the sports event, 
    including key players, key moments, 
    final score, and other useful information.`,
    agent: searchAgent  // Ensure searchAgent is defined and imported if needed
});
```

This example demonstrates how to define a task with a clear description, expected outcomes, and an associated agent responsible for its execution.


## Task Attributes

#### `title` (optional)
The title of the task, which can be used as a concise summary or label.
- **Type:** String
- **Example:** *Update Client Data*
- **Default:** *'' (empty string)*

#### `description`
Describes what the task entails and the work to be performed.
- **Type:** String
- **Example:** *Search for detailed information about the sports query.*

#### `expectedOutput`
Specifies the anticipated result or product from completing the task.
- **Type:** String
- **Example:** *Detailed report including key players, key moments, and final score.*

#### `isDeliverable`
Specifies if the task outcome should be considered a final deliverable. Typically, KaibanJS treats the result of the last task as the deliverable, but this can be set to true for tasks whose results are critical at other stages.
- **Type:** Boolean
- **Example:** *true*
- **Default:** *false*

#### `agent`
The agent assigned to execute the task.
- **Type:** `Agent`
- **Example:** *Refer to a specific Agent object instance, such as `searchAgent`.*

#### `status`
Indicates the current operational state of the task. This property is read-only and provides insights into the task's lifecycle.
- **Type:** Enum (Read-only)
- **Example:** *[TODO, DOING, BLOCKED, REVISE, DONE, AWAITING_VALIDATION, VALIDATED]*
- **Enum Defined At:** [Tasks Status Definitions](https://github.com/kaiban-ai/KaibanJS/blob/main/src/utils/enums.js#L47)

#### `externalValidationRequired`
Indicates whether the task requires external validation before being considered complete.
- **Type:** Boolean
- **Default:** false

#### `feedbackHistory`
An array that stores the history of feedback provided for the task.
- **Type:** Array (Read-only)
- **Default:** []

Each Feedback object in the `feedbackHistory` array has the following structure:
- `content`: String - The feedback message
- `status`: Enum - The status of the feedback (PENDING or PROCESSED)
- `timestamp`: Number - Unix timestamp of when the feedback was provided

#### `allowParallelExecution`
Determines whether the task can be executed concurrently with other tasks when dependencies are met. When set to true, the task may run in parallel with other tasks that have this flag enabled. When false or not set, the task will execute sequentially based on its position in the tasks array.
- **Type:** Boolean
- **Example:** *true*
- **Default:** *false*

#### `referenceId`
A user-defined identifier that can be used for external references (e.g., database keys, external system IDs). This ID is separate from the system-generated internal ID and can be used for integration with external systems.
- **Type:** String (optional)
- **Example:** *"TASK-123", "PRJ-456-T1"*
- **Default:** *undefined*

#### `id`
A system-generated unique identifier for the task. This is automatically created using UUID v4 and should not be manually set. For external references, use `referenceId` instead.
- **Type:** String (Read-only)
- **Example:** `"579db4dd-deea-4e09-904d-a436a38e65cf"`

## Task Result Passing

Tasks in KaibanJS can access and utilize results from previous tasks, enabling complex workflows where tasks build upon each other's outputs. This feature is essential for creating sophisticated, multi-step processes.

### Using Task Results

To reference a previous task's result in your task description, use the `{taskResult:taskN}` syntax, where N is the task's position in the workflow (1-based indexing).

```js
// First task
const dataCollectionTask = new Task({
  description: 'Collect and analyze user data from the database',
  expectedOutput: 'JSON object containing user analytics',
  agent: dataAnalyst
});

// Second task using first task's result
const reportGenerationTask = new Task({
  description: 'Generate a detailed report based on this data: {taskResult:task1}',
  expectedOutput: 'A comprehensive PDF report',
  agent: reportWriter
});
```

### Task Result Interpolation

When a task is executed, its description is automatically interpolated with:
- Input variables using `{variableName}` syntax
- Previous task results using `{taskResult:taskN}` syntax

The interpolation happens at runtime, ensuring that tasks have access to the most current data and results.

### Task Context and Memory

Tasks can operate with or without memory of previous task executions, controlled by the team's `memory` configuration:

```js
const team = new Team({
  name: 'Content Creation Team',
  agents: [researcher, writer, editor],
  tasks: [researchTask, writingTask, editingTask],
  memory: true, // Enable task context sharing (default)
  // memory: false, // Disable task context sharing
});
```

When memory is enabled (default):
- Tasks have access to the full workflow history
- Agents can understand the context of previous task executions
- Better for complex workflows where context improves task execution
- May use more tokens due to additional context

When memory is disabled:
- Tasks operate in isolation
- Only explicit task results are passed between tasks
- Better for independent tasks or when minimizing token usage
- Reduces context but may affect task coherence

### Best Practices

1. **Clear Dependencies**: Make task dependencies explicit in your task descriptions
2. **Result Format**: Ensure task results are in a format that can be easily used by subsequent tasks
3. **Error Handling**: Consider what happens if a referenced task result is unavailable
4. **Documentation**: Document the expected format of task results for better maintainability
5. **Memory Usage**: Consider enabling/disabling memory based on:
   - Workflow complexity and interdependence
   - Token usage requirements
   - Need for contextual awareness between tasks

## Human-in-the-Loop (HITL) Features

KaibanJS supports Human-in-the-Loop functionality for tasks, allowing for manual intervention and validation when necessary. This feature enhances the accuracy and reliability of task outcomes by incorporating human oversight into the workflow.

Key HITL features for tasks include:

- External validation requirements
- Feedback provision and history
- Task revision based on human input

These features enable more complex workflows where human expertise or judgment is necessary, ensuring higher quality results and more reliable task completion.

For a detailed explanation of HITL features and how to implement them in your KaibanJS projects, please refer to our [Human-in-the-Loop (HITL) documentation](/core-concepts/Human-in-the-Loop).


## Conclusion

Tasks drive the actions of agents in KaibanJS. By clearly defining tasks and their expected outcomes, you help AI agents work efficiently, whether alone or in teams. Understanding how tasks are carried out ensures that agents are well-prepared and that tasks are completed correctly.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::