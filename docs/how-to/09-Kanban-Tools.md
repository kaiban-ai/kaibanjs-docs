---
title: Kanban Tools
description: Learn how to use Kanban Tools in KaibanJS to enhance workflow control and task management.
---

## Introduction

KaibanJS provides a set of specialized Kanban tools that agents can use to control and manage workflow tasks. These tools enable advanced workflow control features like task blocking, making your AI workflows more robust and controlled.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Available Kanban Tools

Currently, KaibanJS supports the following Kanban tools:

- `block_task`: Enables agents to block tasks when specific conditions aren't met

## Enabling Kanban Tools

To use Kanban tools, you need to specify them in your agent's configuration:

```javascript
const agent = new Agent({
    name: 'Validator',
    role: 'Process Validator',
    goal: 'Ensure all tasks meet required conditions',
    background: 'Expert in validation and compliance',
    tools: [], // Regular tools
    kanbanTools: ['block_task'] // Enable Kanban tools
});
```

## Using the Block Task Tool

The block task tool is particularly useful for implementing validation gates, security checks, and prerequisite verification in your workflows.

### Basic Implementation

```javascript
// Create a validation agent
const validationAgent = new Agent({
    name: 'Validator',
    role: 'Process Validator',
    goal: 'Ensure all tasks meet required conditions',
    background: 'Expert in validation and compliance',
    kanbanTools: ['block_task']
});

// Create a task that requires validation
const taskToValidate = new Task({
    description: `Review the provided data and ensure it meets all requirements.
    Block the task if any validation fails.`,
    agent: validationAgent
});

// Set up the team
const team = new Team({
    name: 'Validation Team',
    agents: [validationAgent],
    tasks: [taskToValidate]
});
```

### Handling Blocked Tasks

When a task is blocked, you can handle it in several ways:

```javascript
// Option 1: Using workflow status changes
team.onWorkflowStatusChange((status) => {
    if (status === 'BLOCKED') {
        console.log('Task requires attention');
    }
});

// Option 2: Using the promise chain
team.start()
    .then((output) => {
        if (output.status === 'BLOCKED') {
            const { result } = output;
            console.log('Block reason:', result);
            // Handle the blocked state
        }
    });
```

## Real-World Examples

### Security Validation

```javascript
const securityAgent = new Agent({
    name: 'Security Validator',
    role: 'Security Clearance Checker',
    goal: 'Validate security requirements',
    background: 'Security expert',
    kanbanTools: ['block_task']
});

const sensitiveTask = new Task({
    description: `Review access request for sensitive data.
    Requirements:
    - Valid security clearance
    - Proper authorization credentials
    - Documented access request
    
    Block if any requirement is missing.`,
    agent: securityAgent
});
```

### Quality Control

```javascript
const qualityAgent = new Agent({
    name: 'Quality Controller',
    role: 'Quality Assurance',
    goal: 'Ensure output meets quality standards',
    background: 'QA specialist',
    kanbanTools: ['block_task']
});

const contentTask = new Task({
    description: `Review the content for quality standards:
    - Proper formatting
    - No grammatical errors
    - Meets style guidelines
    
    Block if quality standards are not met.`,
    agent: qualityAgent
});
```

## Best Practices

1. **Clear Conditions**: Define clear conditions for when tasks should be blocked
2. **Detailed Reasons**: Always provide specific reasons when blocking tasks
3. **Error Handling**: Implement proper handling for blocked states
4. **Monitoring**: Set up monitoring for blocked tasks
5. **Documentation**: Document your blocking conditions and resolution procedures

## Common Use Cases

- **Security Validation**: Blocking access to sensitive operations
- **Quality Control**: Ensuring outputs meet quality standards
- **Compliance Checks**: Verifying regulatory requirements
- **Resource Management**: Managing resource availability
- **Prerequisite Verification**: Ensuring dependencies are met

## Future Kanban Tools

We're continuously working on expanding our Kanban tools to provide more workflow control features. Stay tuned for updates!

:::tip[We Love Feedback!]
Have ideas for new Kanban tools? Found a bug? Help us improve by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues)!
::: 