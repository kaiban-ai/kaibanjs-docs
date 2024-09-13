---
title: Quick Start
description: Get started with KaibanJS quickly using this step-by-step guide that demonstrates how to set up and run a simple AI-driven application.
---

Start building with KaibanJS swiftly using our step-by-step guide, designed to help you understand the essentials of integrating AI agents into your projects. Whether you're a seasoned developer or new to AI, this guide will facilitate a smooth introduction to creating powerful, AI-enhanced applications.

:::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.kaibanjs.com/share/f3Ek9X5dEWnvA3UVgKUQ)
:::

## Video Walkthrough

For a visual guide through this documentation, check out our walkthrough video below. It covers the same content as this Quick Start guide, providing a step-by-step visual explanation of setting up and using KaibanJS.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
  <iframe 
    src="https://res.cloudinary.com/dnno8pxyy/video/upload/v1726181818/Quick_Start_KaibanJS_v1_1_jaqgfj.mp4" 
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    frameBorder="0" 
    allowFullScreen>
  </iframe>
</div>

## Setup 

#### Install KaibanJS via npm:

```bash
npm install kaibanjs
```

#### Import KaibanJS in your JavaScript file:

```js
// Using ES6 import syntax for NextJS, React, etc.
import { Agent, Task, Team } from 'kaibanjs';
```

```js
// Using CommonJS syntax for NodeJS
const { Agent, Task, Team } = require("kaibanjs");
```

> Note: KaibanJS is TypeScript-supported. To learn more, check out the NodeJS TypeScript example.

## Example Usage

In this example, we use KaibanJS to build a resume generation team. If you're looking to create or update your resume, this setup utilizes specialized AI agents to automatically process your information and produce a polished, professional resume tailored to your career goals.


```js

// Define agents with specific roles and goals
const profileAnalyst = new Agent({
    name: 'Mary', 
    role: 'Profile Analyst', 
    goal: 'Extract structured information from conversational user input.', 
    background: 'Data Processor',
    tools: []  // Tools are omitted for now
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


## Conclusion

This quick start guide is designed to get you up and running with KaibanJS promptly, allowing you to harness the power of AI agents in your applications. If you encounter any challenges or have questions, consult our more detailed documentation or reach out to the [community for support](https://kaibanjs.com/discord).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
