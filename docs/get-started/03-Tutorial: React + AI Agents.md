---
title: React + AI Agents (Tutorial)
description: A step-by-step guide to creating your first project with KaibanJS, from setup to execution using Vite and React.
---

Welcome to our tutorial on integrating KaibanJS with React using Vite to create a dynamic blogging application. This guide will take you through setting up your environment, defining AI agents, and building a simple yet powerful React application that utilizes AI to research and generate blog posts about the latest news on any topic you choose. 

By the end of this tutorial, you will have a solid understanding of how to leverage AI within a React application, making your projects smarter and more interactive.

:::tip[For the Lazy: Jump Right In!]
If you're eager to see the final product in action without following the step-by-step guide first, we've got you covered. Click the link below to access a live version of the project running on CodeSandbox.

[View the completed project on a CodeSandbox](https://stackblitz.com/~/github.com/kaiban-ai/kaibanjs-react-demo?file=src/App.jsx)

Feel free to return to this tutorial to understand how we built each part of the application step by step!
:::

## Project Setup

#### 1. Create a new Vite React project:

```bash
# Create a new Vite project with React template

npm create vite@latest kaibanjs-react-demo -- --template react
cd kaibanjs-react-demo
npm install

# Start the development server
npm run dev
```

#### 2. Install necessary dependencies:

```bash
npm install kaibanjs
# For tool using
npm install @langchain/community --legacy-peer-deps
```

**Note:** You may need to install the `@langchain/community` package with the `--legacy-peer-deps` flag due to compatibility issues.

#### 3. Create a `.env` file in the root of your project and add your API keys:

```
VITE_TRAVILY_API_KEY=your-tavily-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
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

Create a new file `src/blogTeam.js`. We'll use this file to set up our agents, tools, tasks, and team.

#### 1. First, let's import the necessary modules and set up our search tool:

```javascript
import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Define the search tool used by the Research Agent
const searchTool = new TavilySearchResults({
  maxResults: 5,
  apiKey: import.meta.env.VITE_TRAVILY_API_KEY
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
  env: { OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY }
});

export { blogTeam };
```

## Building the React Component

Now, let's create our main React component. Replace the contents of `src/App.jsx` with the following code:

```jsx
import React, { useState } from 'react';
import './App.css';
import { blogTeam } from './blogTeam';

function App() {
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
    <div className="App">
      <h1>AI Agents News Blogging Team</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic... E.g. 'AI News Sep, 2024'"
      />
      <button onClick={generateBlogPost}>
        Generate Blog Post
      </button>
      <div>Status: {teamWorkflowStatus}</div>
      <h2>Generated Blog Post:</h2>
      <div className="blog-post">
        {blogPost ? (
          blogPost
        ) : (
          <p>No blog post available yet. Enter a topic and click 'Generate Blog Post' to see results here.</p>
        )}
      </div>

      {/* We'll add more UI elements in the next steps */}
      
      {/* Agents Here */}

      {/* Tasks Here */}
      
      {/* Stats Here */}
    </div>
  );
}

export default App;
```

This basic structure sets up our component with state management and a simple UI. Let's break it down step-by-step:

### Step 1: Setting up State

We use the `useState` hook to manage our component's state:

```jsx
const [topic, setTopic] = useState('');
const [blogPost, setBlogPost] = useState('');
const [stats, setStats] = useState(null);
```

These state variables will hold the user's input topic, the generated blog post, and statistics about the generation process.

### Step 2: Connecting to the KaibanJS Store

We use the `const useTeamStore = blogTeam.useStore();` to access the current state of our AI team:

```jsx
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

```jsx
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

```jsx
<h2>🕵️‍♂️ Agents:</h2>
<ul className="agent-list">
  {agents && agents.map((agent, index) => (
    <li key={index}>
      {agent.name}: {agent.status}
    </li>
  ))}
</ul>
```

This code displays a list of agents, showing each agent's name and current status. It provides visibility into which agents are active and what they're doing.

**Next, let's display the tasks that our agents are working on:**

```jsx
<h2>📝 Tasks:</h2>
<ul className="task-list">
  {tasks && tasks.map((task, index) => (
    <li key={index}>
      {task.title}: {task.status}
    </li>
  ))}
</ul>
```

This code creates a list of tasks, showing the title and current status of each task. It helps users understand what steps are involved in generating the blog post.

**Finally, let's add a section to display statistics about the blog post generation process:**

```jsx
<h2>📊 Stats:</h2>
{stats ? (
  <div className="stats">
    <p>Duration: {stats.duration} ms</p>
    <p>Total Token Count: {stats.totalTokenCount}</p>
    <p>Total Cost: ${stats.totalCost.toFixed(4)}</p>
  </div>
) : (
  <div className="stats"><p>No stats generated yet.</p></div>
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

Modify your `App.jsx` to use `react-markdown` for displaying the blog post. Import `ReactMarkdown` from `react-markdown` at the top of your file:

```jsx
import ReactMarkdown from 'react-markdown';
```

Then, update the section where the blog post is displayed to use `ReactMarkdown`. Replace the existing div that shows the blog post with the following:

```jsx
<div className="blog-post">
  {blogPost ? (
    <ReactMarkdown>{blogPost}</ReactMarkdown>
  ) : (
    <p>No blog post available yet. Enter a topic and click 'Generate Blog Post' to see results here.</p>
  )}
</div>
```


This change will render the `blogPost` content as formatted Markdown, making it easier to read and more visually appealing.

### Step 6: Adding Glamour with Basic Styling

Now that we have our functional components in place, let’s add some glamour to our application with basic styling. We’ll update the `App.css` file to make our UI cleaner and more visually appealing. This step will help you understand how a few simple CSS tweaks can transform the look and feel of your application, making it more engaging and professional.

#### Import the CSS file in your `App.jsx`

```jsx
import './App.css';
```

#### Update Your `App.css`

Replace the content of your `App.css` with the following styles. These styles are designed to provide a modern and clean look, focusing on readability and a pleasant user experience:

```css

/* General body styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f8;
  margin: 0;
  padding: 20px;
  color: #333;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

/* Main application container */
.App {
  max-width: 800px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: left;
}

/* Header styles */
h1, h2 {
  color: #333333;
}

/* Input field styling */
input[type="text"] {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 2px solid #0056b3;
  border-radius: 4px;
  width: calc(100% - 24px);
  box-sizing: border-box;
}

/* Button styling */
button {
  background-color: #007bff!important;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

/* Styling for status and blog post display */
.status, .blog-post {
  padding: 15px;
  background-color: #e9ecef;
  border-left: 4px solid #2e2e2e;
  margin: 10px 0;
}

.stats {
  font-size: 14px;
}

/* Task and agent list styles */
ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin-top: 5px;
}

/* Additional styling as needed for other elements */
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

2. Open your browser and navigate to `http://localhost:5173` (or the port Vite is running on).

## Analyzing the Results

The `App` component now displays detailed information about the workflow:

- The current status of the team workflow
- The generated blog post
- Statistics about the operation, including duration, token count, and cost
- The status of each task in the workflow
- The status of each agent in the team

This information allows you to monitor the progress of the AI agents and analyze their performance in real-time.

## Conclusion

In this tutorial, we've created a React application using Vite that leverages KaibanJS to analyze news and generate blog posts using AI agents. We've learned how to:

1. Set up a project with Vite and React
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