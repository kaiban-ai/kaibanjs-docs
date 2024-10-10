---
title: Next.js + AI Agents (Tutorial)
description: A step-by-step guide to creating your first project with KaibanJS, from setup to execution using Next.js and React.
---

Welcome to our tutorial on integrating KaibanJS with Next.js to create a dynamic blogging application. This guide will take you through setting up your environment, defining AI agents, and building a simple yet powerful Next.js application that utilizes AI to research and generate blog posts about the latest news on any topic you choose.

By the end of this tutorial, you will have a solid understanding of how to leverage AI within a Next.js application, making your projects smarter and more interactive.

![Next.js - Demo](https://res.cloudinary.com/dnno8pxyy/image/upload/c_fill,h_600/t_Grayscale/v1726976548/demo-result_l12ri9.png)

:::tip[For the Impatient: Jump Right In!]
If you're eager to see the final product in action without following the step-by-step guide first, we've got you covered. Click the link below to access a live version of the project running on CodeSandbox.

[View the completed project on a CodeSandbox](https://stackblitz.com/~/github.com/kaiban-ai/kaibanjs-next-example)

Feel free to return to this tutorial to understand how we built each part of the application step by step!
:::

## Project Setup

#### 1. Create a new Next.js project:

```bash
# Create a new Next.js project

npx create-next-app kaibanjs-next-example
cd kaibanjs-next-example

# Start the development server
npm run dev
```

**Note:** During the setup, when prompted by `create-next-app`, you can choose the default options. For this tutorial, it's not necessary to use TypeScript or Tailwind CSS. When asked:

- **Would you like to use TypeScript?** — Select **No**
- **Would you like to use ESLint?** — Select **Yes**
- **Would you like to use Tailwind CSS?** — Select **No**
- **Would you like to use `src/` directory?** — Select **Yes**
- **Would you like to use App Router?** — Select **Yes**
- **Would you like to customize the default import alias?** — Select **No**

This ensures the project is set up exactly as needed for this tutorial without unnecessary configurations.

#### 2. Install necessary dependencies:

```bash
npm install kaibanjs
```

#### 3. Create a `.env` file in the root of your project and add your API keys:

```
NEXT_PUBLIC_TRAVILY_API_KEY=your-tavily-api-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

#### To obtain these API keys you must follow the steps below.

**For the Tavily API key:**

1. Visit https://tavily.com/
2. Sign up for an account or log in if you already have one.
3. Navigate to your dashboard or API section.
4. Generate a new API key or copy your existing one.

**For the OpenAI API key:**

  1. Go to https://platform.openai.com/
  2. Sign up for an account or log in to your existing one.
  3. Navigate to the API keys section in your account settings.
  4. Create a new API key or use an existing one.

**Note:** Remember to keep these API keys secure and never share them publicly. The `.env` file should be added to your `.gitignore` file to prevent it from being committed to version control. For production environments, consider more secure solutions such as secret management tools or services that your hosting provider might offer.

## Defining Agents and Tools

Create a new file `src/app/blogTeam.js`. We'll use this file to set up our agents, tools, tasks, and team.

#### 1. First, let's import the necessary modules and set up our search tool:

```javascript
import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Define the search tool used by the Research Agent
const searchTool = new TavilySearchResults({
  maxResults: 5,
  apiKey: process.env.NEXT_PUBLIC_TRAVILY_API_KEY
});
```

#### 2. Now, let's define our agents:

```javascript
// Define the Research Agent
const researchAgent = new Agent({
  name: 'Ava',
  role: 'News Researcher',
  goal: 'Find and summarize the latest news on a given topic',
  background: 'Experienced in data analysis and information gathering',
  tools: [searchTool]
});

// Define the Writer Agent
const writerAgent = new Agent({
  name: 'Kai',
  role: 'Content Creator',
  goal: 'Create engaging blog posts based on provided information',
  background: 'Skilled in writing and content creation',
  tools: []
});
```

## Creating Tasks

In the same `blogTeam.js` file, let's define the tasks for our agents:

```javascript
// Define Tasks
const researchTask = new Task({
  title: 'Latest news research',
  description: 'Research the latest news on the topic: {topic}',
  expectedOutput: 'A summary of the latest news and key points on the given topic',
  agent: researchAgent
});

const writingTask = new Task({
  title: 'Blog post writing',
  description: 'Write a blog post about {topic} based on the provided research',
  expectedOutput: 'An engaging blog post summarizing the latest news on the topic in Markdown format',
  agent: writerAgent
});
```

## Assembling a Team

Still in `blogTeam.js`, let's create our team of agents:

```javascript
// Create the Team
const blogTeam = new Team({
  name: 'AI News Blogging Team',
  agents: [researchAgent, writerAgent],
  tasks: [researchTask, writingTask],
  env: { OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY }
});

export { blogTeam };
```

## Building the React Component

Now, let's create our main React component. Replace the contents of `src/app/page.js` with the following code:

```js
'use client'
import { blogTeam } from './blogTeam';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function Home() {
  // Setting up State
  const [topic, setTopic] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [stats, setStats] = useState(null);

  // Connecting to the KaibanJS Store
  const useTeamStore = blogTeam.useStore();
  
  const {
    agents,
    tasks,
    teamWorkflowStatus
  } = useTeamStore(state => ({
    agents: state.agents,
    tasks: state.tasks,
    teamWorkflowStatus: state.teamWorkflowStatus
  }));

  const generateBlogPost = async () => {
    // We'll implement this function in the next step
    alert('The generateBlogPost function needs to be implemented.');
  };

  return (
    <div className="container">
      <h1 className="header">AI Agents News Blogging Team</h1>
      <div className="grid">
        <div className="column">
          <div className="options">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic... E.g. 'AI News Sep, 2024'"
            />
            <button onClick={generateBlogPost}>
              Generate
            </button>
          </div>
          <div className="status">Status <span>{teamWorkflowStatus}</span></div>
          {/* Generated Blog Post */}
          <div className="blog-post">
            {blogPost ? (
              blogPost
            ) : (
              <p className="blog-post-info"><span>ℹ️</span><span>No blog post available yet</span><span>Enter a topic and click 'Generate' to see results here.</span></p>
            )}
          </div>
        </div>

        {/* We'll add more UI elements in the next steps */}
        <div className="column">
          {/* Agents Here */}

          {/* Tasks Here */}
      
          {/* Stats Here */}
        </div>
      </div>
    </div>
  );
}
```

This basic structure sets up our component with state management and a simple UI. Let's break it down step-by-step:

### Step 1: Setting up State

We use the `useState` hook to manage our component's state:

```js
const [topic, setTopic] = useState('');
const [blogPost, setBlogPost] = useState('');
const [stats, setStats] = useState(null);
```

These state variables will hold the user's input topic, the generated blog post, and statistics about the generation process.

### Step 2: Connecting to the KaibanJS Store

We use the `const useTeamStore = blogTeam.useStore();` to access the current state of our AI team:

```js
const {
  agents,
  tasks,
  teamWorkflowStatus
} = useTeamStore(state => ({
  agents: state.agents,
  tasks: state.tasks,
  teamWorkflowStatus: state.teamWorkflowStatus
}));
```

This allows us to track the status of our agents, tasks, and overall workflow.

### Step 3: Implementing the Blog Post Generation Function

Now, let's implement the `generateBlogPost` function:

```js
const generateBlogPost = async () => {
  setBlogPost('');
  setStats(null);

  try {
    const output = await blogTeam.start({ topic });
    if (output.status === 'FINISHED') {
      setBlogPost(output.result);

      const { costDetails, llmUsageStats, duration } = output.stats;
      setStats({
        duration: duration,
        totalTokenCount: llmUsageStats.inputTokens + llmUsageStats.outputTokens,
        totalCost: costDetails.totalCost
      });
    } else if (output.status === 'BLOCKED') {
      console.log(`Workflow is blocked, unable to complete`);
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
  }
};
```

This function starts the KaibanJS workflow, updates the blog post and stats when finished, and handles any errors.

### Step 4: Implementing UX Best Practices for System Feedback

In this section, we'll implement UX best practices to enhance how the system provides feedback to users. By refining the UI elements that communicate internal processes, activities, and statuses, we ensure that users remain informed and engaged, maintaining a clear understanding of the application's operations as they interact with it.

**First, let's add a section to show the status of our agents:**

```js
<h2 className="title">Agents</h2>
<ul className="agent-list">
  {agents && agents.map((agent, index) => (
    <li key={index}>
      <img src={`https://ui-avatars.com/api/name=${encodeURIComponent(agent.name)}?background=3b82f6&color=fff`} alt={`${agent.name}'s avatar`} />
      <span>{agent.name}</span>
      <span>{agent.status}</span>
    </li>
  ))}
</ul>
```

This code displays a list of agents, showing each agent's name and current status. It provides visibility into which agents are active and what they're doing.

**Next, let's display the tasks that our agents are working on:**

```js
<h2 className="title">Tasks</h2>
<ul className="task-list">
  {tasks && tasks.map((task, index) => (
    <li key={index}>
      <span>{task.title}</span>
      <span>{task.status}</span>
    </li>
))}
</ul>
```

This code creates a list of tasks, showing the title and current status of each task. It helps users understand what steps are involved in generating the blog post.

**Finally, let's add a section to display statistics about the blog post generation process:**

```js
<h2 className="title">Stats</h2>
{stats ? (
  <div className="stats">
    <p>
      <span>Total Tokens: </span>
      <span>{stats.totalTokenCount}</span>
    </p>
    <p>
      <span>Total Cost: </span>
      <span>${stats.totalCost.toFixed(4)}</span>
    </p>
    <p>
      <span>Duration: </span>
      <span>{stats.duration} ms</span>
    </p>
  </div>
) : (
  <div className="stats"><p className="stats-info">ℹ️ No stats generated yet.</p></div>
)}
```

This code shows key statistics about the blog post generation, including how long it took, how many tokens were used, and the estimated cost. It's only displayed once the stats are available (i.e., after the blog post has been generated).

By adding these elements to our UI, we create a more informative and interactive experience. Users can now see not just the final blog post, but also the process of how it was created, including which agents were involved, what tasks were performed, and some key metrics about the operation.

### Step 5:Adding a Markdown Visualizer

To enrich the user experience by displaying the generated blog posts in a formatted markdown view, we'll incorporate a markdown visualizer. This will help in presenting the results in a more readable and appealing format. We will use the `react-markdown` library, which is popular and easy to integrate.

#### 1. Install `react-markdown`:

First, add `react-markdown` to your project. It will parse the markdown text and render it as a React component.

```bash
npm install react-markdown
```

#### 2. Update the React Component:

Modify your `Home` to use `react-markdown` for displaying the blog post. Import `ReactMarkdown` from `react-markdown` at the top of your file:

```js
import ReactMarkdown from 'react-markdown';
```

Then, update the section where the blog post is displayed to use `ReactMarkdown`. Replace the existing div that shows the blog post with the following:

```js
<div className="blog-post">
  {blogPost ? (
    <ReactMarkdown>{blogPost}</ReactMarkdown>
  ) : (
    <p className="blog-post-info"><span>ℹ️</span><span>No blog post available yet</span><span>Enter a topic and click 'Generate' to see results here.</span></p>
  )}
</div>
```


This change will render the `blogPost` content as formatted Markdown, making it easier to read and more visually appealing.

### Step 6: Adding Glamour with Basic Styling

Now that we have our functional components in place, let’s add some glamour to our application with basic styling. We’ll update the `globals.css` file to make our UI cleaner and more visually appealing. This step will help you understand how a few simple CSS tweaks can transform the look and feel of your application, making it more engaging and professional.

#### Update Your `globals.css`

Replace the content of your `src/app/globals.css` with the following styles. These styles are designed to provide a modern and clean look, focusing on readability and a pleasant user experience:

```css
/* Base font size for rem units */
html {
  font-size: 16px;
  /* 1rem = 16px */
}

/* General body styles */
body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: calc(100vh - 6.25rem);
  color: #0f172a;
  background-image:
    linear-gradient(to bottom, #faf5ff, #ecfeff),
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
  background-blend-mode: multiply;
}

/* Input styling */
input[type="text"] {
  width: 100%;
  padding: 1rem;
  border-radius: .5rem;
  box-sizing: border-box;
  font-size: 0.875rem;
  color: #0f172a;
  border: 2px solid #e2e8f0;
  outline: none;
}

input[type="text"]:focus {
  border-color: #c7d2fe;
}

/* Button styling */
button {
  background-color: #6366f1;
  color: white;
  border: none;
  padding: .6rem 1rem;
  border-radius: .4rem;
  cursor: pointer;
  font-size: 0.875rem;
  position: absolute;
  right: 8px;
  top: 8px;
}

button:hover {
  background-color: #4f46e5;
}

/* General styles for the app */
.options {
  position: relative;
  display: flex;
  margin-bottom: 1rem;
}

.status {
  position: absolute;
  font-size: 1rem;
  position: absolute;
  top: -34px;
  left: 0;
  padding-left: .25rem;
  text-align: center;
  color: #64748b;
}

.status span {
  background-color: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.65rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.blog-post {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: .5rem;
  height: calc(100% - 100px);
}

.blog-post-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: #64748b;
  margin: 0;
}

.blog-post-info span:nth-child(1) {
  font-size: 1.25rem;
}

.blog-post-info span:nth-child(2) {
  font-weight: 600;
  font-size: 1.15rem;
}

.blog-post-info span:nth-child(3) {
  font-size: 0.875rem;
  font-weight: 300;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.25rem;
  column-gap: 1rem;
}

.stats p {
  margin: 0;
  font-size: 0.875rem;
}

.stats p span:last-child {
  color: #64748b;
}

.stats-info {
  color: #64748b;
  font-weight: 300;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
}

ul li {
  border: 1px solid #ede9fe;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

ul li img {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: .5rem;
}

.agent-list li {
  font-weight: 500;
}

.agent-list li span:last-child {
  margin-left: auto;
  background-color: #fae8ff;
  color: #c026d3;
  padding: 0.25rem 0.65rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.task-list li {
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.875rem;
}

.task-list li span:last-child {
  margin-left: auto;
  background-color: #fce7f3;
  color: #db2777;
  padding: 0.25rem 0.65rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.container {
  width: 100%;
  margin: 0 auto;
  margin-top: 6.25rem;
  margin-bottom: 2rem;
  position: relative;
}

.header {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  position: absolute;
  top: -64px;
  padding-left: .25rem;
  text-align: center;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.column {
  padding: 1rem;
  background-color: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.column:first-child {
  order: 1;
}

.column:last-child {
  order: 2;
  height: auto;
  align-self: flex-start;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }

  .grid {
    grid-template-columns: 1fr 3fr;
  }

  .column:first-child {
    order: 2;
  }

  .column:last-child {
    order: 1;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
```

This CSS code provides a foundation that you can easily build on or modify to fit the specific needs or branding of your project. By incorporating these styles, your application will not only function well but also look great.

### Example Inputs

Now that your AI News Blogging Team is ready, here are three topical examples you can try:

1. "Latest AI courses"
2. "Stock market 2024"
3. "Web development trends 2024"

Feel free to modify these topics or create your own. The AI agents will research the most recent information and craft a blog post summarizing key points and developments.

Tip: For the most up-to-date results, include the current year or "latest" in your query.

## Running the Project

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000` (or the port Next.js is running on).

## Analyzing the Results

The `Home` component now displays detailed information about the workflow:

- The current status of the team workflow
- The generated blog post
- Statistics about the operation, including duration, token count, and cost
- The status of each task in the workflow
- The status of each agent in the team

This information allows you to monitor the progress of the AI agents and analyze their performance in real-time.

## Conclusion

In this tutorial, we've created a React application using Next.js that leverages KaibanJS to analyze news and generate blog posts using AI agents. We've learned how to:

1. Set up a project with Next.js and React
2. Define AI agents with specific roles and tools
3. Create tasks for these agents
4. Assemble a team of agents
5. Build a React component that interacts with the KaibanJS team
6. Display real-time information about the workflow and its results

This project demonstrates the power of KaibanJS in creating complex AI workflows within a modern React application. From here, you could expand the project by adding more agents, implementing more sophisticated error handling, or creating a more elaborate UI to display the generated content.

Remember to replace the placeholder API keys in your `.env` file with your actual Tavily and OpenAI API keys before running the application.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::