# Task Orchestration

KaibanJS provides flexible task orchestration capabilities to control how tasks are executed within a team workflow. These execution patterns determine the order and manner in which tasks are processed, enabling you to create workflows that match your specific needs.

## Deterministic Execution

The deterministic execution pattern ensures tasks are executed in a predictable and controlled manner. It supports three main approaches:

1. **Sequential Execution**: Tasks execute one after another in a defined order
2. **Dependency-based Execution**: Tasks execute based on their dependencies
3. **Parallel Execution**: Multiple tasks execute simultaneously when possible

Each pattern serves different needs and can be combined to create sophisticated workflows.

### Sequential Execution

Sequential execution is the simplest pattern, where tasks execute one after another in the order they are defined. This is useful when:
- Tasks naturally follow a linear sequence
- Each task builds upon the results of the previous task
- You need predictable, step-by-step execution
- Order of execution is more important than execution speed

To achieve sequential execution:
1. Define tasks without any dependencies
2. List tasks in the desired execution order
3. Do not set `allowParallelExecution` on any task

Here's an example of a trip planning workflow with sequential execution:

```javascript
const plannerAgent = new Agent({
  name: 'TravelPlanner',
  role: 'Travel Planning Specialist',
  goal: 'Create comprehensive travel plans'
});

const team = new Team({
  name: 'Trip Planning Team',
  agents: [plannerAgent],
  tasks: [
    new Task({
      referenceId: 'research',
      description: 'Research potential destinations',
      agent: plannerAgent
    }),
    new Task({
      referenceId: 'selectDates',
      description: 'Select optimal travel dates',
      agent: plannerAgent
    }),
    new Task({
      referenceId: 'bookFlights',
      description: 'Book flights for selected dates',
      agent: plannerAgent
    }),
    new Task({
      referenceId: 'bookHotel',
      description: 'Reserve hotel accommodation',
      agent: plannerAgent
    }),
    new Task({
      referenceId: 'planActivities',
      description: 'Create daily activity schedule',
      agent: plannerAgent
    })
  ]
});
```

Here's a visualization of the sequential flow:

```
[research] → [selectDates] → [bookFlights] → [bookHotel] → [planActivities]
```

In this workflow:
1. Tasks execute strictly in the order they appear in the array
2. Each task starts only after the previous task completes
3. The execution is predictable and linear
4. No parallel execution occurs

Key points about sequential execution:
- Simplest execution pattern to understand and implement
- Guarantees tasks execute in the exact order specified
- Useful for workflows where order is critical
- May not be the most efficient for independent tasks

### Dependency-based Execution

Dependencies between tasks allow you to create sophisticated workflows where the execution order is determined by logical relationships rather than a simple sequence. A task will only start when all tasks it depends on have completed, enabling you to:

- Build data processing pipelines where each step requires output from previous steps
- Implement approval workflows where certain actions need sign-off before proceeding
- Create deployment processes that ensure proper testing and validation before releases
- Manage document workflows where reviews and edits must happen in a specific order
- Coordinate multi-agent tasks where some agents need input from others to proceed

To achieve dependency-based execution:
1. Define explicit dependencies between tasks using the `dependencies` array
2. List tasks in any order (execution order is determined by dependencies)

Here's a simple example of a software release workflow:

```javascript
const developerAgent = new Agent({
  name: 'Dev',
  role: 'Developer',
  goal: 'Ensure code quality and successful deployment'
});

const qaAgent = new Agent({
  name: 'QA',
  role: 'Quality Assurance',
  goal: 'Verify application functionality'
});

const team = new Team({
  name: 'Release Team',
  agents: [developerAgent, qaAgent],
  tasks: [
    new Task({
      referenceId: 'runTests',
      description: 'Run the automated test suite',
      agent: developerAgent
    }),
    new Task({
      referenceId: 'updateVersion',
      description: 'Update version numbers in package files',
      agent: developerAgent,
      dependencies: ['runTests']  // Can only update version after tests pass
    }),
    new Task({
      referenceId: 'manualQA',
      description: 'Perform manual QA checks',
      agent: qaAgent,
      dependencies: ['runTests']  // QA starts after tests pass
    }),
    new Task({
      referenceId: 'createRelease',
      description: 'Create release package',
      agent: developerAgent,
      dependencies: ['updateVersion', 'manualQA']  // Release requires both version update and QA approval
    }),
    new Task({
      referenceId: 'deploy',
      description: 'Deploy to production',
      agent: developerAgent,
      dependencies: ['createRelease']  // Can only deploy after release is created
    })
  ]
});
```

This workflow demonstrates how dependencies control task execution:
1. `runTests` executes first (no dependencies)
2. After tests pass:
   - `updateVersion` can start
   - `manualQA` can also start
3. `createRelease` waits for both `updateVersion` and `manualQA` to complete
4. Finally, `deploy` executes after `createRelease` finishes

Here's a visualization of the dependencies:

```
                [runTests]
                    ↓
            ┌───────┴───────┐
            ↓               ↓
    [updateVersion]    [manualQA]
            ↓               ↓
            └───────┬───────┘
                    ↓
            [createRelease]
                    ↓
                [deploy]
```

This example shows how dependencies ensure tasks execute in the correct order, regardless of their position in the tasks array. The execution engine will automatically determine the proper sequence based on the dependency relationships.

### Parallel Tasks

KaibanJS allows tasks to run concurrently when they are independent of each other or when their dependencies are met. This is particularly useful for:
- Reducing overall execution time by running independent tasks simultaneously
- Maximizing resource utilization across different agents
- Processing multiple independent data streams
- Handling concurrent operations like parallel API calls or data processing

To enable parallel execution:
1. Define dependencies between tasks using the `dependencies` array (if any)
2. Set `allowParallelExecution: true` on tasks that can run concurrently

Here's an example of a data processing workflow that uses parallel execution:

```javascript
const dataAgent = new Agent({
  name: 'DataProcessor',
  role: 'Data Processing Specialist',
  goal: 'Process and analyze data efficiently'
});

const team = new Team({
  name: 'Data Processing Team',
  agents: [dataAgent],
  tasks: [
    new Task({
      referenceId: 'loadData',
      description: 'Load the raw dataset from storage',
      agent: dataAgent
    }),
    new Task({
      referenceId: 'validateA',
      description: 'Validate dataset A integrity',
      agent: dataAgent,
      dependencies: ['loadData'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'validateB',
      description: 'Validate dataset B integrity',
      agent: dataAgent,
      dependencies: ['loadData'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'validateC',
      description: 'Validate dataset C integrity',
      agent: dataAgent,
      dependencies: ['loadData'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'processA',
      description: 'Process validated dataset A',
      agent: dataAgent,
      dependencies: ['validateA'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'processB',
      description: 'Process validated dataset B',
      agent: dataAgent,
      dependencies: ['validateB'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'processC',
      description: 'Process validated dataset C',
      agent: dataAgent,
      dependencies: ['validateC'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'mergeSets',
      description: 'Merge all processed datasets',
      agent: dataAgent,
      dependencies: ['processA', 'processB', 'processC']
    })
  ]
});
```

Here's a visualization of the parallel execution flow:

```
                [loadData]
                    ↓
        ┌──────────┼──────────┐
        ↓          ↓          ↓
  [validateA]* [validateB]* [validateC]*
        ↓          ↓          ↓
   [processA]*  [processB]*  [processC]*
        ↓          ↓          ↓
        └──────────┼──────────┘
                   ↓
              [mergeSets]

* Tasks marked with asterisk (*) can run in parallel
```

In this workflow:
1. `loadData` runs first
2. After data is loaded:
   - All three validation tasks can run in parallel
3. As each validation completes:
   - Its corresponding processing task can start
   - Processing tasks can run in parallel with other validations/processing
4. After all processing completes:
   - `mergeSets` combines the results

Key points about parallel execution:
- Tasks marked with `allowParallelExecution: true` can run simultaneously when their dependencies are met
- The execution engine automatically manages concurrent task execution
- Parallel tasks can significantly reduce total execution time
- The final task waits for all parallel branches to complete before executing

### Key Features

- **Predictable Execution**: Tasks always execute in a deterministic order based on their dependencies and position in the task list.
- **Dependency Resolution**: Automatically handles complex dependency chains and ensures prerequisites are met.
- **Parallel Task Support**: Allows concurrent execution of independent tasks when marked with `allowParallelExecution: true`.
- **Error Handling**: Gracefully handles task failures and maintains workflow state consistency.
- **Pause/Resume Support**: Supports pausing and resuming workflow execution while maintaining task state and dependencies.

### Best Practices

1. **Define Clear Dependencies**: Always explicitly define task dependencies to ensure proper execution order.
2. **Use Parallel Execution Wisely**: Only mark tasks as parallel when they are truly independent and can run concurrently.
3. **Avoid Circular Dependencies**: Ensure your task dependencies form a directed acyclic graph (DAG).
4. **Consider Resource Constraints**: When using parallel execution, consider the available computational resources and agent availability.
5. **Monitor Task Status**: Use the workflow logs to monitor task execution status and debug execution order issues.
6. **Design for Flexibility**: Structure your tasks to allow for maximum parallelization where possible, but maintain clear dependencies where necessary.

### Combining Execution Patterns

In real-world scenarios, you often need to combine different execution patterns to create efficient workflows. Here's an example of an event planning system that uses all three patterns:

- **Sequential**: Initial planning tasks that must happen in order
- **Dependencies**: Tasks that require input from previous tasks
- **Parallel**: Independent tasks that can run simultaneously

```javascript
const eventManagerAgent = new Agent({
  name: 'Peter Atlas',
  role: 'Oversees event planning and ensures smooth execution.',
  goal: 'Coordinate tasks and ensure timely execution.'
});

const venueAgent = new Agent({
  name: 'Sophia Lore',
  role: 'Manages venue logistics.',
  goal: 'Confirm venue availability, arrange setup, and handle issues.'
});

const cateringAgent = new Agent({
  name: 'Maxwell Journey',
  role: 'Organizes food and beverages for the event',
  goal: 'Deliver a catering plan and coordinate with vendors'
});

const marketingAgent = new Agent({
  name: 'Riley Morgan',
  role: 'Promotes the event and handles attendee registrations',
  goal: 'Drive attendance and manage guest lists'
});

const team = new Team({
  name: 'Event Planning Team',
  agents: [eventManagerAgent, venueAgent, cateringAgent, marketingAgent],
  tasks: [
    new Task({
      referenceId: 'pickDate',
      description: 'Select optimal event date based on stakeholder availability',
      agent: eventManagerAgent
    }),
    new Task({
      referenceId: 'bookVenue',
      description: 'Book and confirm venue for the selected date',
      agent: venueAgent,
      dependencies: ['pickDate']
    }),
    new Task({
      referenceId: 'guestList',
      description: 'Compile guest list and handle RSVPs',
      agent: marketingAgent,
      dependencies: ['pickDate'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'budget',
      description: 'Create detailed event budget',
      agent: eventManagerAgent,
      dependencies: ['pickDate']
    }),
    new Task({
      referenceId: 'catering',
      description: 'Plan menu and select vendors',
      agent: cateringAgent,
      dependencies: ['guestList']
    }),
    new Task({
      referenceId: 'marketing',
      description: 'Develop marketing campaign',
      agent: marketingAgent,
      dependencies: ['pickDate', 'bookVenue'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'setup',
      description: 'Coordinate venue setup',
      agent: venueAgent,
      dependencies: ['bookVenue', 'catering']
    }),
    new Task({
      referenceId: 'promote',
      description: 'Execute marketing campaign',
      agent: marketingAgent,
      dependencies: ['marketing'],
      allowParallelExecution: true
    }),
    new Task({
      referenceId: 'approve',
      description: 'Final inspection and approval',
      agent: eventManagerAgent,
      dependencies: ['setup', 'promote']
    })
  ]
});
```

Here's a visualization of how these patterns work together:

```
                [pickDate]
                    ↓
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   [bookVenue]  [guestList]* [budget]
        ↓          ↓
        ↓          ↓
    [marketing]*  [catering]
        ↓          ↓
        ↓          ↓
    [promote]*    [setup]
        ↓          ↓
        └──────────┴────┐
                       ↓
                   [approve]

* Tasks marked with asterisk (*) can run in parallel
```

This workflow demonstrates:

1. **Sequential Pattern**
   - `pickDate` must complete first
   - `budget` must wait to `bookVenue` finishes
   - `approve` must be the last task

2. **Dependency Pattern**
   - `bookVenue` depends on date selection
   - `catering` depends on guest list
   - `setup` depends on both venue booking and catering plan

3. **Parallel Pattern**
   - `guestList`, `budget` can run in parallel after date selection
   - `marketing` can run in parallel with other tasks
   - `promote` can run in parallel with setup tasks

The execution sequence unfolds as follows:

1. Initial Phase:
   - `pickDate` executes first as it has no dependencies
   
2. Planning Phase (after date selection):
   - `bookVenue` starts (depends on pickDate)
   - `guestList` starts in parallel (depends on pickDate, allows parallel execution)

3. Preparation Phase:
   - Once `bookVenue` completes:
     - `marketing` can begin (depends on pickDate and bookVenue)
     - `budget` begins (depends on pickDate, but must wait for bookVenue as it's not be executed in  parallel)
   - Once `guestList` completes:
     - `catering` begins (depends on guestList)

4. Implementation Phase:
   - When `marketing` completes:
     - `promote` starts (depends on marketing)
   - When both `bookVenue` and `catering` complete:
     - `setup` begins (depends on both tasks)

5. Final Phase:
   - Only when both `setup` and `promote` complete:
     - `approve` executes as the final task

This sequence demonstrates how the execution engine:
- Starts independent tasks as soon as their dependencies are met
- Runs parallel tasks whenever possible
- Maintains critical sequential dependencies
- Coordinates multiple agents working simultaneously
- Ensures all necessary prerequisites are completed before dependent tasks begin.

## Non-deterministic Execution

Non-deterministic execution patterns allow for more dynamic and adaptive task execution. Unlike deterministic patterns where the execution flow is pre-defined, non-deterministic approaches can adjust the workflow in real-time based on task outcomes, resource availability, and emerging requirements.

### Manager LLM

> **Coming Soon**
>
> The Manager LLM feature will introduce intelligent task orchestration capabilities:
> - Dynamic task prioritization and scheduling
> - Adaptive workflow modifications based on task outcomes
> - Intelligent resource allocation across agents
> - Real-time decision making for optimal task execution
> - Automated dependency management and conflict resolution