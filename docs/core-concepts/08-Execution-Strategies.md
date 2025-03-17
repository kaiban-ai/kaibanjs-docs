# Execution Strategies

KaibanJS provides flexible execution strategies to control how tasks are executed within a team workflow. The primary strategy is the **Deterministic Execution Strategy**, which handles both sequential and dependency-based workflows with predictable behavior.

## Deterministic Execution Strategy

The Deterministic Execution Strategy ensures tasks are executed in a predictable order while respecting dependencies and parallel execution constraints. It supports three main execution patterns:

1. Sequential Execution: Tasks execute one after another in a defined order
2. Dependency-based Execution: Tasks execute based on their dependencies
3. Mixed Execution: Combines dependencies with parallel task execution

### Sequential Execution

To achieve sequential execution:
1. Define tasks without any dependencies between them
2. Do not set `allowParallelExecution: true` on any task
3. List tasks in the desired execution order

The tasks will execute strictly in the order they are defined in the tasks array. This is ideal for workflows where each task builds upon the previous one's output and tasks must be completed in a specific sequence.

> **Note**: Even if tasks have no explicit dependencies, they will execute sequentially as long as `allowParallelExecution` is not activated. This is the default behavior.

Here's an example of a trip planning workflow with sequential execution:

```javascript
const citySelectorAgent = new Agent({
  name: 'Peter Atlas',
  role: 'City Selection Expert',
  goal: 'Select the best city based on weather, season, and prices'
});

const localExpertAgent = new Agent({
  name: 'Sophia Lore',
  role: 'Local Expert',
  goal: 'Provide insights about the selected city'
});

const travelConciergeAgent = new Agent({
  name: 'Maxwell Journey',
  role: 'Travel Concierge',
  goal: 'Create travel itineraries with budget and packing suggestions'
});

const team = new Team({
  name: 'Trip Planning Team',
  agents: [citySelectorAgent, localExpertAgent, travelConciergeAgent],
  tasks: [
    new Task({
      id: 'identifyCity',
      description: 'Analyze and select the best city for the trip based on weather, costs, and events',
      agent: citySelectorAgent
    }),
    new Task({
      id: 'analyzeWeather',
      description: 'Research weather patterns and best times to visit the selected city',
      agent: citySelectorAgent
    }),
    new Task({
      id: 'gatherInfo',
      description: 'Compile an in-depth guide for the selected city',
      agent: localExpertAgent
    }),
    new Task({
      id: 'researchAttractions',
      description: 'Research and list key attractions, events, and cultural experiences',
      agent: localExpertAgent
    }),
    new Task({
      id: 'planItinerary',
      description: 'Develop a full travel itinerary with daily plans and budget',
      agent: travelConciergeAgent
    }),
    new Task({
      id: 'createBudget',
      description: 'Create detailed budget including flights, accommodation, activities, and meals',
      agent: travelConciergeAgent
    }),
    new Task({
      id: 'preparePacking',
      description: 'Create a comprehensive packing list based on activities and weather',
      agent: travelConciergeAgent
    })
  ]
});
```

In this example:
- No dependencies are specified between tasks
- No tasks have `allowParallelExecution` set
- Tasks execute strictly in the order they appear in the array
- Each task starts only after the previous task completes

### Dependency-based Execution with Parallel Tasks

To achieve dependency-based execution with parallel tasks:
1. Define dependencies between tasks using the `dependencies` array
2. Set `allowParallelExecution: true` on tasks that can run concurrently
3. List tasks in a logical order (though execution order will be determined by dependencies and parallel execution flags)

This pattern combines the flexibility of dependency-based execution with the efficiency of parallel processing. It's ideal for complex workflows where some tasks can safely run concurrently while others must maintain strict ordering.

> **Note**: Tasks marked with `allowParallelExecution: true` can run simultaneously with other tasks if their dependencies are met. Tasks without this flag will still execute sequentially.

```javascript
const eventManagerAgent = new Agent({
  name: 'Peter Atlas',
  role: 'Oversees event planning and ensures smooth execution.',
  goal: 'Coordinate tasks and ensure timely execution.',
  background: 'Expertise in event planning, resource allocation, and scheduling.',
  type: 'ReactChampionAgent'
});

const venueCoordinatorAgent = new Agent({
  name: 'Sophia Lore',
  role: 'Manages venue logistics.',
  goal: 'Confirm venue availability, arrange setup, and handle issues.',
  background: 'Knowledge of venue layouts, policies, and equipment setup.',
  type: 'ReactChampionAgent'
});

const cateringAgent = new Agent({
  name: 'Maxwell Journey',
  role: 'Organizes food and beverages for the event',
  goal: 'Deliver a catering plan and coordinate with vendors',
  background: 'Experience with catering contracts, menu planning, and dietary requirements',
  type: 'ReactChampionAgent'
});

const marketingAgent = new Agent({
  name: 'Riley Morgan',
  role: 'Promotes the event and handles attendee registrations',
  goal: 'Drive attendance and manage guest lists',
  background: 'Skilled in social media marketing, email campaigns, and analytics',
  type: 'ReactChampionAgent'
});

const team = new Team({
  name: 'Event Planning Team',
  agents: [eventManagerAgent, venueCoordinatorAgent, cateringAgent, marketingAgent],
  tasks: [
    new Task({
      id: 'selectEventDateTask',
      name: 'Select Event Date',
      description: 'Evaluates possible event dates based on key stakeholder availability, venue schedules, and other constraints like holidays',
      expectedOutput: 'Selected event date. Rationale for the chosen date. Notes on any potential conflicts or considerations.',
      agent: eventManagerAgent
    }),
    new Task({
      id: 'bookVenueTask',
      name: 'Book Venue',
      description: 'Contact the venue, confirms availability for the selected date, and handles booking formalities',
      expectedOutput: 'Venue name and address. Confirmation details. Cost estimate. Any notes on policies or special arrangements.',
      agent: venueCoordinatorAgent,
      dependencies: ['selectEventDateTask']
    }),
    new Task({
      id: 'finalizeGuestListTask',
      name: 'Finalize Guest List',
      description: 'Compile a guest list by integrating RSVPs, VIP requests, and corporate contacts',
      expectedOutput: 'Number of confirmed guests. Guest list with contact details. Special dietary or accessibility requirements.',
      agent: marketingAgent,
      dependencies: ['selectEventDateTask'],
      allowParallelExecution: true
    }),
    new Task({
      id: 'prepareEventBudgetTask',
      name: 'Prepare Event Budget',
      description: 'Create a detailed budget plan for the event, including venue costs, catering, marketing, and contingencies',
      expectedOutput: 'Detailed budget breakdown. Cost estimates for each category. Contingency allocations. Total budget summary.',
      agent: eventManagerAgent,
      dependencies: ['selectEventDateTask']
    }),
    new Task({
      id: 'createCateringPlanTask',
      name: 'Create Catering Plan',
      description: 'Based on the guest list, create a menu and select a vendor to meet dietary preferences and budget constraints.',
      expectedOutput: 'Detailed menu. Vendor name and contract details. Total cost estimate. Notes on special arrangements for individual guests.',
      agent: cateringAgent,
      dependencies: ['selectEventDateTask', 'finalizeGuestListTask']
    }),
    new Task({
      id: 'setupMarketingCampaignTask',
      name: 'Setup Marketing Campaign',
      description: 'Develop a marketing plan to promote the event, including social media, email, and PR strategies.',
      expectedOutput: 'Marketing plan with key strategies and timelines.',
      agent: marketingAgent,
      dependencies: ['selectEventDateTask', 'bookVenueTask'],
      allowParallelExecution: true
    }),
    new Task({
      id: 'coordinateVenueSetupTask',
      name: 'Coordinate Venue Setup',
      description: 'Coordinate with venue staff to ensure all necessary preparations are made for the event.',
      expectedOutput: 'Venue setup schedule and checklist. Any notes on special arrangements or last-minute details.',
      agent: venueCoordinatorAgent,
      dependencies: ['bookVenueTask', 'createCateringPlanTask']
    }),
    new Task({
      id: 'executeMarketingCampaignTask',
      name: 'Execute Marketing Campaign',
      description: 'Execute the marketing plan, including social media, email, and PR strategies.',
      expectedOutput: 'Marketing campaign execution report. Any notes on campaign performance or feedback.',
      agent: marketingAgent,
      dependencies: ['setupMarketingCampaignTask'],
      allowParallelExecution: true
    }),
    new Task({
      id: 'finalizeInspectionAndApprovalTask',
      name: 'Finalize Inspection and Approval',
      description: 'Finalize inspection and approval of the event setup.',
      expectedOutput: 'Inspection report. Any notes on final adjustments or feedback.',
      agent: eventManagerAgent,
      dependencies: ['coordinateVenueSetupTask', 'executeMarketingCampaignTask']
    })
  ]
});
```

In this example:
- Tasks have explicit dependencies
- Some tasks are marked with `allowParallelExecution: true`:
  - `finalizeGuestListTask`
  - `setupMarketingCampaignTask`
  - `executeMarketingCampaignTask`
- Parallel tasks can run concurrently when their dependencies are met
- Non-parallel tasks maintain sequential execution


```
                            [selectEventDate]
                                    ↓
                           ┌────────┴────────┬────────────┐
                           ↓                 ↓            ↓
                     [bookVenue]    [finalizeGu...]*   [prepareEv...]
                           ↓                 ↓
                           ↓                 ↓
                           ↓           [createCater...]
                           ↓                 ↓
                           ↓                 ↓
               [setupMarket...]*            ↓
                           ↓                ↓
                           ↓                ↓
               [executeMark...]*            ↓
                           ↓                ↓
                           ↓         [coordVenue...]
                           ↓                ↓
                           └─────────┐      ↓
                                    ↓      ↓
                            [finalizeInsp...]

* Tasks marked with asterisk (*) can run in parallel with other tasks
  when their dependencies are met (allowParallelExecution: true)

The execution flow proceeds as follows:
1. `selectEventDateTask` executes first (no dependencies)
2. After date selection completes:
   - `bookVenueTask` starts (depends on selectEventDateTask)
   - `finalizeGuestListTask` starts in parallel (depends on selectEventDateTask, has allowParallelExecution)
3. After venue booking:
   - `prepareEventBudgetTask` starts (depends on selectEventDateTask, executes after bookVenueTask due to sequential execution)
   - `setupMarketingCampaignTask` can start in parallel (depends on selectEventDateTask and bookVenueTask, has allowParallelExecution)
4. After guest list completion:
   - `createCateringPlanTask` starts (depends on selectEventDateTask and finalizeGuestListTask)
5. After catering plan and venue booking:
   - `coordinateVenueSetupTask` starts (depends on bookVenueTask and createCateringPlanTask)
6. After marketing campaign setup:
   - `executeMarketingCampaignTask` runs in parallel (depends on setupMarketingCampaignTask, has allowParallelExecution)
7. Finally, after venue setup and marketing execution:
   - `finalizeInspectionAndApprovalTask` completes the workflow (depends on coordinateVenueSetupTask and executeMarketingCampaignTask)

The execution engine manages this flow by:
- Tracking task dependencies
- Monitoring task completion status
- Scheduling parallel tasks when dependencies are met
- Ensuring sequential execution for non-parallel tasks
- Managing resource allocation for concurrent execution
- Maintaining workflow state consistency throughout execution

## Key Features

- **Predictable Execution**: Tasks always execute in a deterministic order based on their dependencies and position in the task list.
- **Dependency Resolution**: Automatically handles complex dependency chains and ensures prerequisites are met.
- **Parallel Task Support**: Allows concurrent execution of independent tasks when marked with `allowParallelExecution: true`.
- **Error Handling**: Gracefully handles task failures and maintains workflow state consistency.
- **Pause/Resume Support**: Supports pausing and resuming workflow execution while maintaining task state and dependencies.

## Best Practices

1. **Define Clear Dependencies**: Always explicitly define task dependencies to ensure proper execution order.
2. **Use Parallel Execution Wisely**: Only mark tasks as parallel when they are truly independent and can run concurrently.
3. **Avoid Circular Dependencies**: Ensure your task dependencies form a directed acyclic graph (DAG).
4. **Consider Resource Constraints**: When using parallel execution, consider the available computational resources and agent availability.
5. **Monitor Task Status**: Use the workflow logs to monitor task execution status and debug execution order issues.
6. **Design for Flexibility**: Structure your tasks to allow for maximum parallelization where possible, but maintain clear dependencies where necessary.