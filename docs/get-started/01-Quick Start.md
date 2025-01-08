---
title: Quick Start
description: Get started with KaibanJS in under 1 minute. Learn how to set up your Kaiban Board, create AI agents, watch them complete tasks in real-time, and deploy your board online.
---

# Quick Start Guide

Get your AI-powered workflow up and running in minutes with KaibanJS!

:::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.kaibanjs.com/share/f3Ek9X5dEWnvA3UVgKUQ)
:::

## Quick Demo

Watch this 1-minute video to see KaibanJS in action:

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%'}}>
  <iframe 
    src="https://www.youtube.com/embed/NFpqFEl-URY?si=A-utCk5gHM8wbEyl" 
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
    frameBorder="0" 
    allowFullScreen>
  </iframe>
</div>

## Prerequisites

- Node.js (v14 or later) and npm (v6 or later)
- An API key for OpenAI or Anthropic, Google AI, or another [supported AI service](../llms-docs/01-Overview.md).

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Setup

**1. Run the KaibanJS initializer in your project directory:**

```bash
npx kaibanjs@latest init
```

This command sets up KaibanJS in your project and opens the Kaiban Board in your browser.

**2. Set up your API key:**

- Create or edit the `.env` file in your project root
- Add your API key (example for OpenAI):

```
VITE_OPENAI_API_KEY=your-api-key-here
```

**3. Restart your Kaiban Board:**

```bash
npm run kaiban
```

## Using Your Kaiban Board

1. In the Kaiban Board, you'll see a default example workflow.

2. Click "Start Workflow" to run the example and see KaibanJS in action.

3. Observe how agents complete tasks in real-time on the Task Board.

4. Check the Results Overview for the final output.

## Customizing Your Workflow

1. Open `team.kban.js` in your project root.

2. Modify the agents and tasks to fit your needs. For example:

   ```javascript
   import { Agent, Task, Team } from 'kaibanjs';

   const researcher = new Agent({
     name: 'Researcher',
     role: 'Information Gatherer',
     goal: 'Find latest info on AI developments'
   });

   const writer = new Agent({
     name: 'Writer',
     role: 'Content Creator',
     goal: 'Summarize research findings'
   });

   const researchTask = new Task({
     description: 'Research recent breakthroughs in AI',
     agent: researcher
   });

   const writeTask = new Task({
     description: 'Write a summary of AI breakthroughs',
     agent: writer
   });

   const team = new Team({
     name: 'AI Research Team',
     agents: [researcher, writer],
     tasks: [researchTask, writeTask]
   });

   export default team;
   ```

3. Save your changes and the Kaiban Board will automatically reload to see your custom workflow in action.

## Deploying Your Kaiban Board

To share your Kaiban Board online:

1. Run the deployment command:

```bash
npm run kaiban:deploy
```

2. Follow the prompts to deploy your board to Vercel.

3. Once deployed, you'll receive a URL where your Kaiban Board is accessible online.

This allows you to share your AI-powered workflows with team members or clients, enabling collaborative work on complex tasks.

## Quick Tips

- Use `npm run kaiban` to start your Kaiban Board anytime.
- Press `Ctrl+C` in the terminal to stop the Kaiban Board.
- Click "Share Team" in the Kaiban Board to generate a shareable link.
- Access our LLM-friendly documentation at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt) to integrate with your AI IDE or LLM tools.

## AI Development Integration

KaibanJS documentation is available in an LLM-friendly format, making it easy to:
- Feed into AI coding assistants for context-aware development
- Use with AI IDEs for better code completion and suggestions
- Integrate with LLM tools for automated documentation processing

Simply point your AI tool to `https://docs.kaibanjs.com/llms-full.txt` to access our complete documentation in a format optimized for large language models.

## Flexible Integration

KaibanJS isn't limited to the Kaiban Board. You can integrate it directly into your projects, create custom UIs, or run agents without a UI. Explore our tutorials for [React](./05-Tutorial:%20React%20+%20AI%20Agents.md) and [Node.js](./06-Tutorial:%20Node.js%20+%20AI%20Agents.md) integration to unleash the full potential of KaibanJS in various development contexts.

## Next Steps

- Experiment with different agent and task combinations.
- Try integrating KaibanJS into your existing projects.
- Check out the full documentation for advanced features.

For more help or to connect with the community, visit [kaibanjs.com](https://www.kaibanjs.com).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::