---
title: State Management
description: Explore how state is managed within AgenticJS using the Team Store, including detailed insights on team operations and workflows.
---

:::info[Understanding State Management]

State management is the method by which software keeps track of changes in an application’s state, or condition, over time. It ensures that an application responds predictably as it interacts with user inputs or undergoes internal changes. Effective state management is crucial for applications that handle complex and dynamic data to maintain consistency and prevent errors.

:::

> In AgenticJS, state management is handled by the Team Store, which coordinates the behaviors and statuses of agents and tasks, ensuring seamless operation within teams.


## What is the Team Store?
The Team Store in the AgenticJS framework is a specialized component designed to manage the state and workflows of agents and tasks within a team. 

Acting as the central hub for state management, the Team Store ensures that all activities and data flows within the team are coordinated efficiently and accurately. 

This critical infrastructure piece allows teams to function seamlessly, supporting robust state management and responsive updates to enhance the team's overall performance and capabilities.

## Accessing Team State

Once a team is created in AgenticJS, you can access and interact with its internal state through specific methods tailored to different development environments.


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

const AgenticJSComponent = () => {
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

export default AgenticJSComponent;
```

:::tip[Store Powered by Zustand]

The store is powered by Zustand, offering a full range of features for effective state management. To fully understand these capabilities, check out [Zustand's documentation](https://github.com/pmndrs/zustand).

:::


## Key Store Attributes for Team Workflow Management

#### `teamWorkflowStatus`
This attribute indicates the current state of the team's workflow process. It transitions through various statuses, reflecting different phases of the workflow lifecycle.

- **Type:** `Enum` (WORKFLOW_STATUS_enum)
- **Possible Values:** `INITIAL`, `RUNNING`, `STOPPING`, `STOPPED`, `ERRORED`, `FINISHED`, `BLOCKED`

#### `workflowResult`
Stores the final result or output of the workflow once it has completed. This attribute is particularly useful for retrieving the outcome of all tasks processing.

- **Type:** `Object`
- **Default:** `null`

#### `agents`
An array that lists the agents involved in the team, detailing their roles and responsibilities within the workflow and current status.

- **Type:** `Array of Agents`
- **Default:** `[]`

#### `tasks`
Contains all tasks assigned to the team. Each task is managed according to the workflow defined by the team's operational rules.

- **Type:** `Array of Tasks`
- **Default:** `[]`

#### `workflowContext`
Stores essential context or metadata from the workflow execution, such as task outputs and intermediate results. This attribute acts as a contextual memory, allowing agents to access and utilize past interactions and decisions throughout the workflow. It enhances agents' ability to make informed decisions based on the historical context of the workflow.

- **Type:** `String`
- **Default:** Empty string `''`

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
The Team Store in AgenticJS plays a pivotal role by efficiently managing and reacting to state changes across agents, tasks, and workflows. This robust system enhances application management by enabling structured state tracking and real-time feedback mechanisms. For further detailed insights into advanced monitoring and debugging techniques, refer to the [Observability and Monitoring](./06-Observability%20and%20Monitoring.md) section.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/AI-Champions/AgenticJS/issues). We’re all ears!
:::