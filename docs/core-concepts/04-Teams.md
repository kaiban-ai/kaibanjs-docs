---
title: Teams
description: What are Teams and how to use them.
---

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/93U0sQKBobc?si=Y7rZsGAb_kPIdvgT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></iframe>
</div>  

## What is a Team?
> A Team represents a group of agents working together to complete assigned tasks. Each team is structured around a store, which manages the state and workflow of agents and tasks, making it the backbone of the team's functionality.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Creating a Team

When assembling a team, you combine agents with complementary roles and tools, assign tasks, and select a process that dictates their execution order and interaction.

```js

// Define agents with specific roles and goals
const profileAnalyst = new Agent({
    name: 'Mary', 
    role: 'Profile Analyst', 
    goal: 'Extract structured information from conversational user input.', 
    background: 'Data Processor',
    tools: []
});

const resumeWriter = new Agent({
    name: 'Alex Mercer', 
    role: 'Resume Writer', 
    goal: `Craft compelling, well-structured resumes 
    that effectively showcase job seekers qualifications and achievements.`,
    background: `Extensive experience in recruiting, 
    copywriting, and human resources, enabling 
    effective resume design that stands out to employers.`,
    tools: []
});

// Define the tasks for each agent
const processingTask = new Task({ 
  description: `Extract relevant details such as name, 
  experience, skills, and job history from the user's 'aboutMe' input. 
  aboutMe: {aboutMe}`,
  expectedOutput: 'Structured data ready to be used for a resume creation.', 
  agent: profileAnalyst
});

const resumeCreationTask = new Task({ 
    description: `Utilize the structured data to create 
    a detailed and attractive resume. 
    Enrich the resume content by inferring additional details from the provided information.
    Include sections such as a personal summary, detailed work experience, skills, and educational background.`,
    expectedOutput: `A professionally formatted resume in markdown format, 
    ready for submission to potential employers.`, 
    agent: resumeWriter 
});

// Create and start the team
const team = new Team({
  name: 'Resume Creation Team',
  agents: [profileAnalyst, resumeWriter],
  tasks: [processingTask, resumeCreationTask],
  inputs: { aboutMe: `My name is David Llaca. 
    JavaScript Developer for 5 years. 
    I worked for three years at Disney, 
    where I developed user interfaces for their primary landing pages
     using React, NextJS, and Redux. Before Disney, 
     I was a Junior Front-End Developer at American Airlines, 
     where I worked with Vue and Tailwind. 
     I earned a Bachelor of Science in Computer Science from FIU in 2018, 
     and I completed a JavaScript bootcamp that same year.` },  // Initial input for the first task
    env: {OPENAI_API_KEY: 'your-open-ai-api-key'}  // Environment variables for the team
});

// Listen to the workflow status changes
// team.onWorkflowStatusChange((status) => {
//   console.log("Workflow status:", status);
// });

team.start()
  .then((output) => {
    console.log("Workflow status:", output.status);
    console.log("Result:", output.result);
  })
  .catch((error) => {
    console.error("Workflow encountered an error:", error);
  });
```


## Team Attributes

#### `name`
The name given to the team, reflecting its purpose or mission.
- **Type:** String
- **Example:** *Resume Creation Team*

#### `agents`
A collection of agents assigned to the team, each with specific roles and goals.
- **Type:** Array of `Agent` objects
- **Example:** *[profileAnalyst, resumeWriter]*

#### `tasks`
The tasks that the team is responsible for completing, directly associated with the agents.
- **Type:** Array of `Task` objects
- **Example:** *[processingTask, resumeCreationTask]*

#### `inputs`
Initial data or parameters provided to guide task execution. These inputs are dynamically integrated into task descriptions and operations, evaluated at runtime to tailor task behavior based on specific requirements.
- **Type:** Object
- **Example:** `{ aboutMe: 'Detailed background information...' }`

#### `env`
A collection of environment variables that configure access to AI model APIs needed for your team's operations. This setup allows you to easily define API keys for one or more AI models, ensuring all agents in your team can access the necessary AI services.

- **Type:** Object
- **Example:** `{ OPENAI_API_KEY: 'your-open-ai-api-key' }`
- **Supported values:** 
  - `OPENAI_API_KEY` for OpenAI services.
  - `ANTHROPIC_API_KEY` for Anthropic.
  - `GOOGLE_API_KEY` for Google.
  - `MISTRAL_API_KEY` for Mistral.

**Note:** It is crucial to use environment variables to manage these API keys. This method prevents sensitive information from being hardcoded into the source code, enhancing the security and adaptability of your system. It allows for easy updates and changes without altering the codebase, providing a secure and scalable solution for integrating AI services.

#### `logLevel`
The logging level set for monitoring and debugging the team's activities.

- **Type:** String (optional)
- **Example:** *'debug', 'info', 'warn', 'error'*
- **Default:** *info*

#### `hooks`
A collection of functions that are executed at specific points in the workflow lifecycle.

- **Type:** Object
- **Properties:**
  - `beforeTeamExecution`: Function - Called before the team starts executing tasks
  - `afterTeamExecution`: Function - Called after all tasks have been completed
- **Example:**
```js
const team = new Team({
  // ... other team configuration ...
  hooks: {
    beforeTeamExecution: async ({ workflowLogs, tasks, state }) => {
      console.log('Team is starting execution');
      // Perform any setup or validation before the team starts
    },
    afterTeamExecution: async ({ result, workflowLogs, tasks, state }) => {
      console.log('Team has finished execution');
      // Process or validate the final results
    }
  }
});
```

#### `workflowInternalMemory`
A shared memory space that persists throughout the workflow execution. This can be used to store and share data between tasks, hooks, or any other workflow components.

- **Type:** Object
- **Default:** `{}`
- **Access Methods:**
  - `updateWorkflowInternalMemory(updates)`: Merges new data into the memory
  - `clearWorkflowInternalMemory()`: Clears all stored data
- **Example:**
```js
// Store data in a hook
const team = new Team({
  hooks: {
    beforeTeamExecution: async ({ state }) => {
      // Store initial configuration
      state.updateWorkflowInternalMemory({
        startTime: Date.now(),
        configuration: { /* ... */ }
      });
    }
  }
});

// Access data in a task
const analysisTask = new Task({
  description: 'Analyze data',
  hooks: {
    beforeTaskExecution: async ({ state }) => {
      const { configuration } = state.workflowInternalMemory;
      // Use the configuration data
    }
  }
});

// Update data from another task
const processingTask = new Task({
  description: 'Process results',
  hooks: {
    afterTaskExecution: async ({ result, state }) => {
      // Store processed results
      state.updateWorkflowInternalMemory({
        processedData: result
      });
    }
  }
});
```

The `workflowInternalMemory` is automatically cleared when:
- The workflow is reset
- A new workflow execution starts
- The `clearWorkflowInternalMemory()` method is called

See [Using Hooks](/how-to/using-hooks) for more information on how to use hooks.

### Team Methods

#### `start(inputs)`
Initiates the team's task processing workflow and monitors its progress.

- **Parameters:** 
  - `inputs` (Object, optional): Additional inputs to override or supplement the initial inputs.
- **Returns:** `Promise<Object>` - Resolves with different structures based on the workflow status:
  - For completed workflows:
    ```js
        {
        status: 'FINISHED',
        result: workflowResult,
        stats: {
          duration: number,
          taskCount: number,
          agentCount: number,
          iterationCount: number,
          llmUsageStats: {
            inputTokens: number,
            outputTokens: number,
            callsCount: number,
            callsErrorCount: number,
            parsingErrors: number
          },
          costDetails: {
            totalCost: number
          },
          teamName: string
      }
    }
    ```
  - For errored workflows:
    ```js
    // The promise is rejected with an Error object
    new Error('Workflow encountered an error')
    ```
  - For blocked workflows:
    ```javascript
      {
        status: 'BLOCKED',
        result: null,
        stats: { ... } // Same structure as FINISHED state
      }
    ```

**Example:**
  ```js
  team.start()
    .then((output) => {
      if (output.status === 'FINISHED') {
        console.log("Workflow completed. Final result:", output.result);
      } else if (output.status === 'BLOCKED') {
        console.log("Workflow is blocked");
        // Handle blocked state (e.g., request human intervention)
      }
    })
    .catch((error) => {
      console.error("Workflow encountered an error:", error);
    });
  ```


**Note:** This method resolves the promise for `FINISHED` and `BLOCKED` states, and rejects for `ERRORED` state. For `BLOCKED` state, it resolves with a null result, allowing the promise chain to continue but indicating that the workflow is blocked.

It's important to note that once the Promise resolves (whether due to completion, error, or blockage), it won't resolve again, even if the workflow continues after being unblocked.

For full HITL implementation, you would need to use this method in conjunction with other Team methods like `provideFeedback` and `validateTask`, and potentially set up additional listeners `onWorkflowStatusChange` to monitor the workflow's progress after it has been unblocked.

#### `pause()`
Temporarily halts the workflow execution. Tasks that are currently executing will be paused, and no new tasks will start until the workflow is resumed.
- **Returns:** `Promise<void>`
- **Note:** Tasks in `DOING` state will transition to `PAUSED` state. The workflow status will change to `PAUSED`.

**Example:**
```js
// Pause workflow after 5 minutes to check intermediate results
setTimeout(() => {
  team.pause()
    .then(() => {
      const tasks = team.getTasks();
      console.log('Workflow paused. Current task states:', 
        tasks.map(t => ({ id: t.id, status: t.status }))
      );
    });
}, 5 * 60 * 1000);
```

#### `resume()`
Continues the workflow execution from its paused state. Previously paused tasks will resume execution, and new tasks will start according to their dependencies and execution strategy.
- **Returns:** `Promise<void>`
- **Note:** Tasks in `PAUSED` state will transition back to `DOING` state. The workflow status will change back to `RUNNING`.

**Example:**
```js
// Monitor workflow status and resume after validation
team.onWorkflowStatusChange((status) => {
  if (status === 'PAUSED') {
    validateIntermediateResults()
      .then((isValid) => {
        if (isValid) {
          team.resume()
            .then(() => console.log('Validation passed, workflow resumed'));
        } else {
          team.stop()
            .then(() => console.log('Validation failed, workflow stopped'));
        }
      });
  }
});
```

#### `stop()`
Permanently stops the workflow execution. All executing tasks will be stopped, and the workflow cannot be resumed after being stopped.
- **Returns:** `