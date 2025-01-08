---
title: Integrating with JavaScript Frameworks
description: Enhance your JavaScript projects with AI capabilities using KaibanJS.
---

> KaibanJS seamlessly integrates with popular JavaScript frameworks, including React, Vue, Angular, NextJS, and Node.js. This integration allows you to leverage AI agents within your existing frontend or backend architecture, enhancing your applications with advanced AI functionalities.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Using KaibanJS with React

In a React application, you can easily incorporate KaibanJS to manage tasks and monitor statuses dynamically. Below is an example of a React component that uses KaibanJS to display the status of tasks managed by AI agents.

### Example: Task Status Component in React

This React component demonstrates how to connect to an KaibanJS team's store and display task statuses:

```jsx
import React from 'react';
import myAgentsTeam from './agenticTeam';

const TaskStatusComponent = () => {
    const useTeamStore = myAgentsTeam.useStore();

    const { tasks } = useTeamStore(state => ({
        tasks: state.tasks.map(task => ({
            id: task.id,
            description: task.description,
            status: task.status
        }))
    }));

    return (
        <div>
            <h1>Task Statuses</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.description}: Status - {task.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskStatusComponent;
```

### Integration Examples

To help you get started quickly, here are examples of KaibanJS integrated with different JavaScript frameworks:

- **NodeJS + KaibanJS:** Enhance your backend services with AI capabilities. [Try it on CodeSandbox](https://codesandbox.io/p/github/darielnoel/KaibanJS-NodeJS/main).

- **React + Vite + KaibanJS:** Build dynamic frontends with real-time AI features. [Explore on CodeSandbox](https://codesandbox.io/p/github/darielnoel/KaibanJS-React-Vite/main).

## Conclusion

Integrating KaibanJS with your preferred JavaScript framework unlocks powerful possibilities for enhancing your applications with AI-driven interactions and functionalities. Whether you're building a simple interactive UI in React or managing complex backend logic in Node.js, KaibanJS provides the tools you need to embed sophisticated AI capabilities into your projects.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::
