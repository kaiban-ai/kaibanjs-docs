---
title: Teams
description: What are Teams and how to use them.
---

## What is a Team?
> A Team represents a group of agents working together to complete assigned tasks. Each team is structured around a store, which manages the state and workflow of agents and tasks, making it the backbone of the team's functionality.

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

team.start().then((result) => {
  console.log("Final Output:", result);
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

### Team Methods

#### `start(inputs)`
Begins the team's task processing workflow.
- **Parameters:** `inputs` (optional) - Additional inputs to override initial task parameters.
- **Returns:** Promise resolving to the workflow result.

#### `getStore()`
Provides NodeJS developers direct access to the team's store.
- **Returns:** The store object.

#### `useStore()`
Provides a React hook for accessing the team's store in React applications.
- **Returns:** The store object.

```js
team.start().then((result) => {
  console.log("Final Output:", result);
});
```

### The Team Store
The store serves as the backbone for state management within the AgenticJS framework. It uses [Zustand](https://github.com/pmndrs/zustand) to provide a centralized and reactive system that efficiently manages and maintains the state of agents, tasks, and entire team workflows.


**Integration with Team:** 

Each team operates with its own dedicated store instance. This store orchestrates all aspects of the team's function, from initiating tasks and updating agent statuses to managing inputs and outputs. This ensures that all components within the team are synchronized and function cohesively.

**Further Reading:** For an in-depth exploration of the store’s capabilities and setup, please refer to the detailed store documentation.

### Conclusion
The `Team` class, with its underlying store, orchestrates the flow of tasks and agent interactions within AgenticJS. Detailed documentation of the store's mechanisms will be provided separately to delve into its state management capabilities and how it supports the team's dynamic operations.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/AI-Champions/AgenticJS/issues). We’re all ears!
:::
