---
title: State Management
description: Explore how state is managed within KaibanJS using the Team Store, including detailed insights on team operations and workflows.
---

:::info[Understanding State Management]

State management is the method by which software keeps track of changes in an application’s state, or condition, over time. It ensures that an application responds predictably as it interacts with user inputs or undergoes internal changes. Effective state management is crucial for applications that handle complex and dynamic data to maintain consistency and prevent errors.

:::

> In KaibanJS, state management is handled by the Team Store, which coordinates the behaviors and statuses of agents and tasks, ensuring seamless operation within teams.


## What is the Team Store?
The Team Store in the KaibanJS framework is a specialized component designed to manage the state and workflows of agents and tasks within a team. 

Acting as the central hub for state management, the Team Store ensures that all activities and data flows within the team are coordinated efficiently and accurately. 

This critical infrastructure piece allows teams to function seamlessly, supporting robust state management and responsive updates to enhance the team's overall performance and capabilities.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Accessing Team State

Once a team is created in KaibanJS, you can access and interact with its internal state through specific methods tailored to different development environments.


```js
const teamStore = myAgentsTeam.useStore();
const { agents, tasks } = teamStore.getState(); 

// Accessing parts of the state directly
console.log(agents, tasks);

```

## Listening to State Changes

Set up listeners to state changes to enable dynamic reactions to updates in the team's operations.

```js
const unsubscribe = myAgentsTeam.useStore().subscribe(() => {
    const updatedState = myAgentsTeam.useStore().getState();
    console.log("Updated State:", updatedState);
});

// Remember to unsubscribe when you're done listening to avoid memory leaks
// unsubscribe();

```

**React Example**

```js
import myAgentsTeam from "./agenticTeam";

const KaibanJSComponent = () => {
  const useTeamStore = myAgentsTeam.useStore();

  const { agents, workflowResult } = useTeamStore(state => ({
    agents: state.agents,
    workflowResult: state.workflowResult,
  }));

  return (
    <div>
      <button onClick={myAgentsTeam.start}>Start Team Workflow</button>
      <p>Workflow Result: {workflowResult}</p>
      <div>
        <h2>🕵️‍♂️ Agents</h2>
        {agents.map(agent => (
          <p key={agent.id}>{agent.name} - {agent.role} - Status: ({agent.status})</p>
        ))}
      </div>
    </div>
  );
};

export default KaibanJSComponent;
```

:::tip[Store Powered by Zustand]

The store is powered by Zustand, offering a full range of features for effective state management. To fully understand these capabilities, check out [Zustand's documentation](https://github.com/pmndrs/zustand).

:::


## Key Store Attributes for Team Workflow Management

#### `teamWorkflowStatus`
This attribute indicates the current state of the team's workflow process. It transitions through various statuses, reflecting different phases of the workflow lifecycle.

- **Type:** `Enum` (WORKFLOW_STATUS_enum)
- **Possible Values:** `INITIAL`, `RUNNING`, `STOPPED`, `ERRORED`, `FINISHED`, `BLOCKED`

#### `workflowResult`
Stores the final result or output of the workflow once it has completed. This attribute is particularly useful for retrieving the outcome of all tasks processing.

- **Type:** `String`
- **Default:** `null`

#### `agents`
An array that lists the agents involved in the team, detailing their roles and responsibilities within the workflow and current status.

- **Type:** `Array of Agents`
- **Default:** `[]`

#### `tasks`
Contains all tasks assigned to the team. Each task is managed according to the workflow defined by the team's operational rules.

- **Type:** `Array of Tasks`
- **Default:** `[]`

#### `workflowContext` (Deprecated)

:::caution[Deprecated]
The `workflowContext` attribute is deprecated and will be removed in future versions. Context is now dynamically derived from the `workflowLogs` array.
:::

Previously, this attribute stored essential context or metadata from the workflow execution. However, the context now varies depending on the task being executed and the status of other tasks. It is dynamically derived from the `workflowLogs` array using:

```js
const currentContext = teamStore.deriveContextFromLogs(teamStore.workflowLogs, currentTaskId);
```

This approach ensures that the context is always up-to-date and relevant to the current task and workflow state. It provides a more flexible and accurate representation of the workflow's context at any given point in time.


#### `workflowLogs`
This is a critical attribute as it records all significant events and changes in the workflow's status. It's invaluable for debugging, auditing, and understanding the sequence of operations within the store.

- **Type:** `Array`
- **Default:** `[]`

#### Example: Subscribing to Workflow Logs Updates
The following example demonstrates how to subscribe to updates in `workflowLogs`, allowing users to monitor changes and respond to various workflow statuses:

```javascript
team.useStore().subscribe(state => state.workflowLogs, (newLogs, previousLogs) => {
    if (newLogs.length > previousLogs.length) {
        const newLog = newLogs[newLogs.length - 1];
        if (newLog.logType === 'WorkflowStatusUpdate') {
            const statusMessage = `Workflow Status: ${newLog.workflowStatus} - ${newLog.logDescription}`;
            console.log(statusMessage);
        }
    }
});
```

**Note:** *This function logs changes in workflow status as they occur, providing real-time feedback on the progress and state of the workflow. For more detailed insights on log types and attributes, refer to the [Observability and Monitoring](./06-Observability%20and%20Monitoring.md) section.*

## Conclusion
The Team Store in KaibanJS plays a pivotal role by efficiently managing and reacting to state changes across agents, tasks, and workflows. This robust system enhances application management by enabling structured state tracking and real-time feedback mechanisms. For further detailed insights into advanced monitoring and debugging techniques, refer to the [Observability and Monitoring](./06-Observability%20and%20Monitoring.md) section.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::