---
title: Human in the Loop (HITL)
description: AgenticJS incorporates Human-in-the-Loop (HITL) functionality, allowing for seamless integration of human expertise and oversight in AI-driven workflows. This feature enables manual intervention at critical points, ensuring accuracy, reliability, and ethical considerations in complex tasks. HITL in AgenticJS facilitates human validation, feedback processing, and task revision, creating a collaborative environment between AI agents and human operators for optimal decision-making and quality assurance.
---

# Human in the Loop (HITL)

## Overview
Human in the Loop (HITL) is a core feature in AgenticJS that enables manual intervention and oversight in AI-driven tasks. It provides a mechanism for human operators to review, provide input, or make decisions at critical points in the workflow, ensuring accuracy, reliability, and ethical considerations in complex or sensitive operations.

## Purpose
The HITL feature addresses the need for human judgment in scenarios where:
- Tasks reach a complexity level beyond AI capabilities
- Sensitive decisions require human oversight
- Quality assurance is critical
- Ethical considerations necessitate human involvement

## Human in the Loop (HITL)

Imagine a Kanban board for a software development team:

```
| To Do | In Progress | Code Review | Testing | Done |
|-------|-------------|-------------|---------|------|
| Task 1 | Task 2     | Task 3      | Task 4  | Task 5 |
|       |             | <Needs      |         |      |
|       |             |  Human      |         |      |
|       |             |  Review>    |         |      |
```

In this scenario, Task 3 in the "Code Review" column requires human intervention. This is similar to how HITL works in AI workflows, where certain tasks need human input or validation before proceeding.

### How HITL Works in AgenticJS

1. **Task Creation**: Tasks are created and can be flagged to require human validation.

2. **AI Processing**: AI agents work on tasks, moving them through different states (like "To Do" to "In Progress").

3. **Human Intervention Points**: 
   - Tasks enter 'AWAITING_VALIDATION' state when they need human review.
   - Humans can provide feedback on tasks in 'BLOCKED', 'AWAITING_VALIDATION', or even 'DONE' states.

4. **Feedback or Validation**: 
   - Humans can validate (approve) a task or provide feedback for revisions.
   - Feedback can be given to guide the AI's next steps or to request changes.

5. **Feedback Processing**: 
   - If feedback is provided, the task moves to 'REVISE' state.
   - The AI agent then addresses the feedback, potentially moving the task back to 'DOING'.

6. **Completion**: Once validated, tasks move to the 'DONE' state.

This process ensures that human expertise is incorporated at crucial points, improving the overall quality and reliability of the AI-driven workflow.

### This HITL workflow can be easily implemented using AgenticJS. 

The library provides methods and status to manage the entire process programmatically:

- Methods: `validateTask()`, `provideFeedback()`, `getTasksByStatus()`
- Task Statuses: TODO, DOING, BLOCKED, REVISE, AWAITING_VALIDATION, VALIDATED, DONE
- Workflow Status: INITIAL, RUNNING, BLOCKED, FINISHED
- Feedback History: Each task contains a `feedbackHistory` array, with entries consisting of:
  - `content`: The human input or decision
  - `status`: PENDING or PROCESSED
  - `timestamp`: When the feedback was created or last updated

## Example Usage

Here's an example of how to set up and manage a HITL workflow using AgenticJS:

```js
// Creating a task that requires validation
const task = new Task({
    title: "Analyze market trends",
    description: "Research and summarize current market trends for our product",
    assignedTo: "Alice",
    externalValidationRequired: true
});

// Set up the workflow status change listener before starting
team.onWorkflowStatusChange((status) => {
  if (status === 'BLOCKED') {
    // Check for tasks awaiting validation
    const tasksAwaitingValidation = team.getTasksByStatus('AWAITING_VALIDATION');
    
    tasksAwaitingValidation.forEach(task => {
      console.log(`Task awaiting validation: ${task.title}`);
      
      // Example: Automatically validate the task
      team.validateTask(task.id);
      
    // Alternatively, provide feedback if the task needs revision
    // This could be based on human review or automated criteria
    // team.provideFeedback(task.id, "Please include more data on competitor pricing.");
    });
  } else if (status === 'FINISHED') {
    console.log('Workflow completed successfully!');
    console.log('Final result:', team.getWorkflowResult());
  }
});

// Start the workflow and handle the promise
team.start()
  .then((output) => {
    if (output.status === 'FINISHED') {
      console.log('Workflow completed with result:', output.result);
    }
  })
  .catch(error => {
    console.error('Workflow encountered an error:', error);
  });
```
## Task Statuses
The system includes the following task statuses, which apply to all tasks throughout the entire workflow, including but not limited to HITL processes:

- `TODO`: Task is queued for initiation, awaiting processing.
- `DOING`: Task is actively being worked on by an agent.
- `BLOCKED`: Progress on the task is halted due to dependencies or obstacles.
- `REVISE`: Task requires additional review or adjustments based on feedback.
- `AWAITING_VALIDATION`: Task is completed but requires validation or approval.
- `VALIDATED`: Task has been validated and confirmed as correctly completed.
- `DONE`: Task is fully completed and requires no further action.

These statuses are defined in the [TASK_STATUS_enum](https://github.com/AI-Champions/AgenticJS/blob/main/src/utils/enums.js#L58) and can be accessed throughout the system for consistency.

## Task State Flow Diagram

Below is a text-based representation of the task state flow diagram:

```
                 +---------+
                 |   TODO  |
                 +---------+
                      |
                      v
                 +---------+
            +--->|  DOING  |
            |    +---------+
            |         |
            |    +----+----+----+----+
            |    |         |         |
            v    v         v         v
     +-------------+  +---------+  +------------------+
     |   BLOCKED   |  |  REVISE |  | AWAITING_        |
     +-------------+  +---------+  | VALIDATION       |
            |              |       +------------------+
            |              |                |
            |              |                v
            |              |         +--------------+
            |              |         |  VALIDATED   |
            |              |         +--------------+
            |              |                |
            |              |                v
            +--------------+----------------+ 
                                     |
                                     v
                                +---------+
                                |   DONE  |
                                +---------+

```

## Task State Transitions

1. **TODO to DOING**: 
   - When a task is picked up by an agent to work on.

2. **DOING to BLOCKED**: 
   - If the task encounters an obstacle or dependency that prevents progress.

3. **DOING to AWAITING_VALIDATION**: 
   - Only for tasks created with `externalValidationRequired = true`.
   - Occurs when the agent completes the task but it needs human validation.

4. **DOING to DONE**: 
   - For tasks that don't require external validation.
   - When the agent successfully completes the task.

5. **AWAITING_VALIDATION to VALIDATED**: 
   - When a human approves the task without changes.

6. **AWAITING_VALIDATION to REVISE**: 
   - If the human provides feedback or requests changes during validation.

7. **VALIDATED to DONE**: 
   - Automatic transition after successful validation.

8. **REVISE to DOING**: 
   - When the agent starts working on the task again after receiving feedback.

9. **BLOCKED to DOING**: 
    - When the obstacle is removed and the task can proceed.

## HITL Workflow Integration

1. **Requiring External Validation**: 
   - Set `externalValidationRequired: true` when creating a task to ensure it goes through human validation before completion.

2. **Initiating HITL**: 
   - Use `team.provideFeedback(taskId, feedbackContent)` at any point to move a task to REVISE state.

3. **Validating Tasks**:
   - Use `team.validateTask(taskId)` to approve a task, moving it from AWAITING_VALIDATION to VALIDATED, then to DONE.
   - Use `team.provideFeedback(taskId, feedbackContent)` to request revisions, moving the task from AWAITING_VALIDATION to REVISE.

4. **Processing Feedback**:
   - The system automatically processes feedback given through the `provideFeedback()` method.
   - Agents handle pending feedback before continuing with the task.

## Feedback in HITL

In AgenticJS, human interventions are implemented through a feedback system. Each task maintains a `feedbackHistory` array to track these interactions.

### Feedback Structure

Each feedback entry in the `feedbackHistory` consists of:
- `content`: The human input or decision
- `status`: The current state of the feedback
- `timestamp`: When the feedback was created or last updated

### Feedback Statuses
AgenticJS uses two primary statuses for feedback:
- `PENDING`: Newly added feedback that hasn't been addressed yet
- `PROCESSED`: Feedback that has been successfully addressed and incorporated

This structure allows for clear tracking of human interventions and their resolution throughout the task lifecycle.

## React Example

```jsx
import React, { useState, useEffect } from 'react';
import { team } from './teamSetup'; // Assume this is where your team is initialized

function WorkflowBoard() {
  const [tasks, setTasks] = useState([]);
  const [workflowStatus, setWorkflowStatus] = useState('');
  const store = team.useStore();

  useEffect(() => {
    const unsubscribeTasks = store.subscribe(
      state => state.tasks,
      (tasks) => setTasks(tasks)
    );

    const unsubscribeStatus = store.subscribe(
      state => state.teamWorkflowStatus,
      (status) => setWorkflowStatus(status)
    );

    return () => {
      unsubscribeTasks();
      unsubscribeStatus();
    };
  }, []);

  const renderTaskColumn = (status, title) => (
    <div className="task-column">
      <h2>{title}</h2>
      {tasks.filter(task => task.status === status).map(task => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          {status === 'AWAITING_VALIDATION' && (
            <button onClick={() => store.getState().validateTask(task.id)}>
              Validate
            </button>
          )}
          <button onClick={() => store.getState().provideFeedback(task.id, "Sample feedback")}>
            Provide Feedback
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="task-board">
      <h1>Task Board - Workflow Status: {workflowStatus}</h1>
      <div className="columns-container">
        {renderTaskColumn('TODO', 'To Do')}
        {renderTaskColumn('DOING', 'In Progress')}
        {renderTaskColumn('BLOCKED', 'Blocked')}
        {renderTaskColumn('AWAITING_VALIDATION', 'Waiting for Feedback')}
        {renderTaskColumn('DONE', 'Done')}
      </div>
      <button onClick={() => store.getState().startWorkflow()}>Start Workflow</button>
    </div>
  );
}

export default WorkflowBoard;
```

## Conclusion

By implementing Human in the Loop through AgenticJS's feedback and validation system, you can create a more robust, ethical, and accurate task processing workflow. This feature ensures that critical decisions benefit from human judgment while maintaining the efficiency of automated processes for routine operations.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/AI-Champions/AgenticJS/issues). We’re all ears!
:::