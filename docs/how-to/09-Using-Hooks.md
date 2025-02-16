# Using Hooks

KaibanJS provides a hooks system that allows you to execute custom logic at specific points during workflow and task execution. This feature is useful for adding custom behaviors, integrating with external systems, or implementing monitoring and logging.

## Available Hooks

### Team-level Hooks

#### `beforeTeamExecution`
Called before the team starts executing its workflow.
```javascript
const team = new Team({
  name: 'My Team',
  // ... other team config
  beforeTeamExecution: async ({ tasks }) => {
    // Access to all tasks before execution starts
    console.log('Starting workflow with tasks:', tasks);
    // You can set up resources, validate configuration, etc.
  }
});
```

#### `afterTeamExecution`
Called after the team completes its workflow (success, error, or blocked).
```javascript
const team = new Team({
  name: 'My Team',
  // ... other team config
  afterTeamExecution: async ({ workflowLogs, tasks, state }) => {
    // Access to final workflow state and results
    console.log('Workflow completed with result:', state.workflowResult);
    // You can clean up resources, save results, generate reports, etc.
  }
});
```

### Task-level Hooks

#### `beforeTaskExecution`
Called before a specific task starts executing.
```javascript
const task = new Task({
  title: 'My Task',
  // ... other task config
  beforeTaskExecution: async ({ workflowLogs, tasks, state }) => {
    // Access to workflow state before task execution
    console.log('Starting task execution');
    // You can prepare task-specific resources, add context, etc.
  }
});
```

#### `afterTaskExecution`
Called after a task completes its execution.
```javascript
const task = new Task({
  title: 'My Task',
  // ... other task config
  afterTaskExecution: async ({ result, workflowLogs, tasks, state }) => {
    // Access to task result and workflow state
    console.log('Task completed with result:', result);
    // You can process results, update external systems, etc.
  }
});
```

## Common Use Cases

### Adding External Memory
```javascript
const task = new Task({
  title: 'Research Task',
  beforeTaskExecution: async ({ state }) => {
    // Add long-term memory or context from external sources
    const previousResearch = await fetchFromDatabase(state.inputs.topic);
    state.taskMemory = previousResearch;
  }
});
```

### Monitoring and Logging
```javascript
const team = new Team({
  name: 'Monitored Team',
  beforeTeamExecution: async ({ tasks }) => {
    await logToMonitoringSystem('Workflow started', { taskCount: tasks.length });
  },
  afterTeamExecution: async ({ state }) => {
    await logToMonitoringSystem('Workflow completed', {
      result: state.workflowResult,
      duration: state.getWorkflowStats().duration
    });
  }
});
```

### Resource Management
```javascript
const task = new Task({
  title: 'Data Processing Task',
  beforeTaskExecution: async () => {
    // Set up task-specific resources
    await initializeDatabase();
  },
  afterTaskExecution: async () => {
    // Clean up resources
    await closeDatabase();
  }
});
```

## Best Practices

1. **Keep Hooks Focused**: Each hook should have a single responsibility and be focused on a specific aspect of the workflow.

2. **Handle Errors**: Always implement proper error handling in your hooks as they can affect the workflow execution.
```javascript
beforeTaskExecution: async ({ state }) => {
  try {
    await setupResources();
  } catch (error) {
    console.error('Failed to set up resources:', error);
    throw error; // This will stop the workflow if the setup is critical
  }
}
```

3. **Avoid Heavy Operations**: Keep hook operations lightweight to prevent blocking the workflow execution. For heavy operations, consider using async processing.

4. **State Mutations**: Be careful when modifying state in hooks. Changes should be well-documented and predictable.

5. **Documentation**: Document your hooks' purposes and side effects, especially when they interact with external systems. 