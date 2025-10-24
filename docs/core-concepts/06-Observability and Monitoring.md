---
title: Observability and Monitoring
description: Built into KaibanJS, the observability features enable you to track every state change with detailed stats and logs, ensuring full transparency and control. This functionality provides real-time insights into token usage, operational costs, and state changes, enhancing system reliability and enabling informed decision-making through comprehensive data visibility.
---

### Introduction to Observability and Monitoring

> Observability in KaibanJS is foundational, ensuring clarity and explainability not just for developers but for everyone interacting with AI systems. This feature extends beyond technical oversight; it is integral to building trust and transparency across all user interactions. By implementing a robust state management system, KaibanJS tracks every state change within the application, reflecting the principles of Flux where the state flows in one direction—predictable and transparent.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

#### The workflowLogs Array

A pivotal element of the Team Store is the workflowLogs array, which acts much like a **blockchain ledger** by recording all significant operations within the state. This mechanism serves as a detailed chronological record, offering insights into operational sequences, token usage, and associated costs.

Below a couple of examples of how to use it...

### Example: Retrieving Task Statistics from Logs

This example shows how to extract task completion statistics directly from the workflowLogs by finding the appropriate log for a completed task.

```js
function getTaskCompletionStats(taskId, teamStore) {
  // Retrieve all workflow logs from the store
  const logs = teamStore.getState().workflowLogs;

  // Find the log entry where the task is marked as completed
  const completedLog = logs.find(
    log =>
      log.task &&
      log.task.id === taskId &&
      log.logType === 'TaskStatusUpdate' &&
      log.task.status === 'DONE'
  );

  if (completedLog) {
    const {
      startTime,
      endTime,
      duration,
      llmUsageStats,
      iterationCount,
      costDetails
    } = completedLog.metadata;

    // Displaying the gathered statistics
    console.log(`Task ${taskId} completed stats:`);
    console.log(`Start Time: ${new Date(startTime).toLocaleString()}`);
    console.log(`End Time: ${new Date(endTime).toLocaleString()}`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Iterations: ${iterationCount}`);
    console.log(
      `Token Usage: Input - ${llmUsageStats.inputTokens}, Output - ${llmUsageStats.outputTokens}`
    );
    console.log(`Cost Details: ${JSON.stringify(costDetails)}`);

    return completedLog.metadata;
  } else {
    console.log(`No completed log found for task ID ${taskId}`);
    return null;
  }
}

// Example usage
const taskId = '123'; // replace with actual task ID
const taskStats = getTaskCompletionStats(taskId, teamStore);
```

### Example: Counting Agent Errors

This example shows how to count the number of THINKING_ERROR statuses an agent named "Scout" has encountered by examining the workflowLogs.

```js
function countAgentThinkingErrors(agentName, teamStore) {
  // Retrieve all workflow logs from the store
  const logs = teamStore.getState().workflowLogs;

  // Filter the logs to find entries where the agent encountered a THINKING_ERROR
  const errorLogs = logs.filter(
    log =>
      log.agent &&
      log.agent.name === agentName &&
      log.logType === 'AgentStatusUpdate' &&
      log.agentStatus === 'THINKING_ERROR'
  );

  // Display and return the count of error logs
  console.log(
    `Agent ${agentName} encountered THINKING_ERROR ${errorLogs.length} times.`
  );
  return errorLogs.length;
}

// Example usage
const agentName = 'Scout'; // replace with actual agent name
const errorCount = countAgentThinkingErrors(agentName, teamStore);
```

### Example: Retrieving Workflow Completion Statistics

This example demonstrates how to retrieve statistics from the log entry recorded when a workflow is completed.

```js
function getWorkflowCompletionStats(teamStore) {
  // Retrieve all workflow logs from the store
  const logs = teamStore.getState().workflowLogs;

  // Find the log entry for when the workflow was marked as finished
  const completionLog = logs.find(
    log =>
      log.logType === 'WorkflowStatusUpdate' &&
      log.workflowStatus === 'FINISHED'
  );

  // Check if a completion log exists and display the statistics
  if (completionLog) {
    const stats = completionLog.metadata;
    console.log(
      `Workflow completed for team ${stats.teamName} with the following stats:`
    );
    console.log(`Start Time: ${new Date(stats.startTime).toLocaleString()}`);
    console.log(`End Time: ${new Date(stats.endTime).toLocaleString()}`);
    console.log(`Duration: ${stats.duration} seconds`);
    console.log(`Number of Tasks: ${stats.taskCount}`);
    console.log(`Number of Agents: ${stats.agentCount}`);
    console.log(`LLM Usage Stats:`, stats.llmUsageStats);
    console.log(`Cost Details:`, stats.costDetails);

    return stats;
  } else {
    console.log('No workflow completion log found.');
    return null;
  }
}

// Example usage
const workflowStats = getWorkflowCompletionStats(teamStore);
```

### Example: Counting Human in the Loop (HITL) Interactions

This example demonstrates how to count the number of validations and revisions in a workflow by examining the workflowLogs.

```js
function countHITLInteractions(teamStore) {
  const logs = teamStore.getState().workflowLogs;
  const validations = logs.filter(
    log => log.logType === 'TaskStatusUpdate' && log.taskStatus === 'VALIDATED'
  ).length;
  const revisions = logs.filter(
    log => log.logType === 'TaskStatusUpdate' && log.taskStatus === 'REVISE'
  ).length;
  console.log(`Total validations: ${validations}`);
  console.log(`Total revisions: ${revisions}`);
  return { validations, revisions };
}

// Example usage
const hitlStats = countHITLInteractions(teamStore);
```

### Log Types and Attributes

There are three primary types of logs, each corresponding to different aspects of the system's operation:

```js
const logType =
  'AgentStatusUpdate' || 'TaskStatusUpdate' || 'WorkflowStatusUpdate';
```

#### AgentStatusUpdate

This log type records any changes to an agent's status as they process tasks. The statuses recorded can vary depending on the agent's activity and any challenges they encounter.

- **Key Attributes:**
  - `agent`: The agent associated with the log.
  - `task`: The task the agent is working on when the log is recorded.
  - `agentStatus`: Current status of the agent, which reflects their activity or state change.
  - `logDescription`: Descriptive text about the agent's status change.
  - `metadata`: Additional data relevant to the agent's status, such as error details or iteration counts.

#### TaskStatusUpdate

Logs under this category track the lifecycle of tasks from start to completion, including any interruptions or issues.

- **Key Attributes:**
  - `task`: Reference to the specific task being logged.
  - `agent`: The agent assigned to the task, if applicable.
  - `taskStatus`: The current state of the task, detailing progress or any blocks.
  - `logDescription`: Detailed explanation of the event or status update.
  - `metadata`: Contains specifics like output data, error messages, or other pertinent information related to the task's execution.

#### WorkflowStatusUpdate

These logs are vital for monitoring the overall progress and status of workflows. They provide a macro view of the workflow's lifecycle, including initiation, any stops, errors, or completion.

- **Key Attributes:**
  - `workflowStatus`: The overarching status of the workflow at the time of the log.
  - `logDescription`: A summary or detailed explanation of the workflow's condition or changes.
  - `metadata`: Additional details that might include workflow results, operational stats, and other relevant data.

For a comprehensive list of possible status values and their meanings for each type of log, please refer to the enums file in the KaibanJS repository:

[KaibanJS Enums File](https://github.com/kaiban-ai/KaibanJS/blob/main/src/utils/enums.js)

---

## OpenTelemetry Integration

KaibanJS provides a seamless integration with OpenTelemetry, allowing you to trace and monitor your workflows in real-time.

Read more about the OpenTelemetry integration in the [Exporting Traces with OpenTelemetry](../how-to/13-Exporting-Traces-with-OpenTelemetry.md) guide.

## Conclusion

These logs serve as a foundational element for observability within KaibanJS, allowing developers and system administrators to trace actions, pinpoint issues, and understand the dynamics of agent interactions and task executions. They form an integral part of the system's accountability and operational insight mechanisms.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
