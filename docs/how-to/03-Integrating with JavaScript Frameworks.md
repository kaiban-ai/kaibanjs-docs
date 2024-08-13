---
title: Integrating with JavaScript Frameworks
description: Enhance your JavaScript projects with AI capabilities using AgenticJS.
---

> AgenticJS seamlessly integrates with popular JavaScript frameworks, including React, Vue, Angular, NextJS, and Node.js. This integration allows you to leverage AI agents within your existing frontend or backend architecture, enhancing your applications with advanced AI functionalities.

## Using AgenticJS with React

In a React application, you can easily incorporate AgenticJS to manage tasks and monitor statuses dynamically. Below is an example of a React component that uses AgenticJS to display the status of tasks managed by AI agents.

### Example: Task Status Component in React

This React component demonstrates how to connect to an AgenticJS team's store and display task statuses:

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

To help you get started quickly, here are examples of AgenticJS integrated with different JavaScript frameworks:

- **NodeJS + AgenticJS:** Enhance your backend services with AI capabilities. [Try it on CodeSandbox](https://codesandbox.io/p/github/darielnoel/AgenticJS-NodeJS/main).

- **React + Vite + AgenticJS:** Build dynamic frontends with real-time AI features. [Explore on CodeSandbox](https://codesandbox.io/p/github/darielnoel/AgenticJS-React-Vite/main).

## Conclusion

Integrating AgenticJS with your preferred JavaScript framework unlocks powerful possibilities for enhancing your applications with AI-driven interactions and functionalities. Whether you're building a simple interactive UI in React or managing complex backend logic in Node.js, AgenticJS provides the tools you need to embed sophisticated AI capabilities into your projects.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/AI-Champions/AgenticJS/issues). We’re all ears!
:::
