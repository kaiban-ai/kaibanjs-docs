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
    env: {OPENAI_API_KEY: 'your-open-ai-api-key'},  // Environment variables for the team
    insights: `
Resume Success Metrics (2023):
1. Format Impact: STAR format results in 89% interview rate
2. Professional Titles: Using Mr./Ms. increases callbacks by 100%
3. Content Structure: 4-6 bullet points per role optimal
4. Keywords: "Implemented" + metrics = 76% success rate
5. Experience Focus: Last 10 years most relevant to employers
  `
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

#### `insights`
A string containing the team's knowledge base and experience that can be referenced by agents during task execution. This allows agents to make informed decisions based on historical data, patterns, and previous experiences.

- **Type:** String (optional)
- **Example:**
```js
const team = new Team({
  // ... other team configuration ...
  insights: `
Resume Success Metrics (2023):
1. Format Impact: STAR format results in 89% interview rate
2. Professional Titles: Using Mr./Ms. increases callbacks by 100%
3. Content Structure: 4-6 bullet points per role optimal
4. Keywords: "Implemented" + metrics = 76% success rate
5. Experience Focus: Last 10 years most relevant to employers
  `
});
```
- **Usage:** Agents can access and utilize these insights to provide more personalized and context-aware responses, improving the quality of their task outputs.

#### `logLevel`
The logging level set for monitoring and debugging the team's activities.

- **Type:** String (optional)
- **Example:** *'debug', 'info', 'warn', 'error'*
- **Default:** *info*

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

#### `getStore()`
Provides NodeJS developers direct access to the team's store.
- **Returns:** The store object.

#### `useStore()`
Provides a React hook for accessing the team's store in React applications.
- **Returns:** The store object.

#### `provideFeedback(taskId, feedbackContent)`
Provides feedback on a specific task, enabling human intervention in the AI workflow. This method triggers the human-in-the-loop workflow by setting the task status to REVISE, prompting the agent to reconsider and improve its work based on the provided feedback.
- **Parameters:** 
  - `taskId` (String): The ID of the task to provide feedback for.
  - `feedbackContent` (String): The feedback to be incorporated into the task.
- **Returns:** void
- **Note:** Calling this method initiates the human-in-the-loop process, allowing for iterative refinement of task outputs. You can track the workflow status using the `onWorkflowStatusChange` method.

#### `validateTask(taskId)`
Marks a task as validated, used in the HITL process to approve a task that required validation.
- **Parameters:**
  - `taskId` (String): The ID of the task to be marked as validated.
- **Returns:** void

#### `onWorkflowStatusChange(callback)`
Subscribes to changes in the workflow status, allowing real-time monitoring of the overall workflow progress.
- **Parameters:**
  - `callback`