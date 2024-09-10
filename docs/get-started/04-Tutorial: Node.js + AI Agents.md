# NodeJS + AI Agents (Tutorial)

Welcome to our tutorial on integrating KaibanJS with NodeJS to create a powerful command-line blogging application. This guide will take you through setting up your environment, defining AI agents, and building a simple yet effective NodeJS application that utilizes AI to research and generate blog posts about the latest news on any topic you choose.

By the end of this tutorial, you will have a solid understanding of how to leverage AI within a NodeJS application, making your projects smarter and more interactive.

:::tip[For the Lazy: Jump Right In!]
If you're eager to see the final product in action without following the step-by-step guide first, we've got you covered. Click the link below to access a live version of the project running on CodeSandbox.

[View the completed project on CodeSandbox](https://codesandbox.io/p/github/kaiban-ai/KaibanJS-NodeJS/main)

Feel free to return to this tutorial to understand how we built each part of the application step by step!
:::

## Project Setup

#### 1. Create a new NodeJS project:

```bash
# Create a new directory for your project
mkdir kaibanjs-node-demo
cd kaibanjs-node-demo

# Initialize a new Node.js project
npm init -y

# Install necessary dependencies
npm install kaibanjs @langchain/community dotenv
```

#### 2. Create a `.env` file in the root of your project and add your API keys:

```
TAVILY_API_KEY=your-tavily-api-key
OPENAI_API_KEY=your-openai-api-key
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

**Note:** Remember to keep these API keys secure and never share them publicly. The `.env` file should be added to your `.gitignore` file to prevent it from being committed to version control.

## Defining Agents and Tools

Create a new file `blogTeam.js`. We'll use this file to set up our agents, tools, tasks, and team.

```javascript
require('dotenv').config();
const { Agent, Task, Team } = require('kaibanjs');
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search');

// Define the search tool used by the Research Agent
const searchTool = new TavilySearchResults({
  maxResults: 5,
  apiKey: process.env.TAVILY_API_KEY
});

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

// Create the Team
const blogTeam = new Team({
  name: 'AI News Blogging Team',
  agents: [researchAgent, writerAgent],
  tasks: [researchTask, writingTask],
  env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
});

module.exports = { blogTeam };
```

## Building the NodeJS Application

Now, let's create our main NodeJS application. Create a new file `app.js` with the following code:

```javascript
const { blogTeam } = require('./blogTeam');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateBlogPost(topic) {
  console.log(`Generating blog post about "${topic}"...`);
  console.log('Status: RUNNING');

  try {
    const output = await blogTeam.start({ topic });
    if (output.status === 'FINISHED') {
      console.log('\nGenerated Blog Post:');
      console.log(output.result);

      const { costDetails, llmUsageStats, duration } = output.stats;
      console.log('\nStats:');
      console.log(`Duration: ${duration} ms`);
      console.log(`Total Token Count: ${llmUsageStats.inputTokens + llmUsageStats.outputTokens}`);
      console.log(`Total Cost: $${costDetails.totalCost.toFixed(4)}`);
    } else if (output.status === 'BLOCKED') {
      console.log('Workflow is blocked, unable to complete');
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
  }

  rl.question('\nEnter another topic (or "quit" to exit): ', handleInput);
}

function handleInput(input) {
  if (input.toLowerCase() === 'quit') {
    rl.close();
    return;
  }
  generateBlogPost(input);
}

console.log('Welcome to the AI News Blogging Team!');
rl.question('Enter a topic to generate a blog post (e.g. "AI News Sep, 2024"): ', handleInput);

rl.on('close', () => {
  console.log('Thank you for using the AI News Blogging Team. Goodbye!');
  process.exit(0);
});
```

This NodeJS application creates a command-line interface for interacting with our AI blogging team. Let's break down its key components:

1. We import the `blogTeam` from our `blogTeam.js` file and set up a readline interface for user input.

2. The `generateBlogPost` function is the core of our application. It takes a topic as input, starts the KaibanJS workflow, and displays the results and statistics.

3. The `handleInput` function processes user input, either generating a new blog post or exiting the application.

4. We set up a welcome message and prompt the user for their first topic.

5. The application continues to prompt for new topics until the user decides to quit.

## Running the Project

1. Start the application:
```bash
node app.js
```

2. Follow the prompts in the command line to generate blog posts on various topics.

## Example Inputs

Now that your AI News Blogging Team is ready, here are three topical examples you can try:

1. "Latest AI courses"
2. "Stock market 2024"
3. "Web development trends 2024"

Feel free to modify these topics or create your own. The AI agents will research the most recent information and craft a blog post summarizing key points and developments.

Tip: For the most up-to-date results, include the current year or "latest" in your query.

## Analyzing the Results

The application now displays detailed information about the workflow:

- The generated blog post
- Statistics about the operation, including duration, token count, and cost

This information allows you to monitor the performance of the AI agents and analyze their output in real-time.

## Conclusion

In this tutorial, we've created a NodeJS application that leverages KaibanJS to analyze news and generate blog posts using AI agents. We've learned how to:

1. Set up a NodeJS project
2. Define AI agents with specific roles and tools
3. Create tasks for these agents
4. Assemble a team of agents
5. Build a NodeJS application that interacts with the KaibanJS team
6. Display information about the workflow and its results

This project demonstrates the power of KaibanJS in creating complex AI workflows within a NodeJS application. From here, you could expand the project by adding more agents, implementing more sophisticated error handling, or creating a more elaborate interface to display the generated content.

Remember to replace the placeholder API keys in your `.env` file with your actual Tavily and OpenAI API keys before running the application.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::