---
title: Task Result Passing
description: How to pass and use results between tasks in KaibanJS.
---

# Task Result Passing Guide

This guide explains how to effectively use KaibanJS's task result passing feature to create sophisticated workflows where tasks can build upon each other's outputs.

## Basic Usage

### Referencing Task Results

To use a previous task's result in your task description, use the `{taskResult:taskN}` syntax, where N is the task's position in the workflow (1-based indexing):

```js
// First task generates data
const analysisTask = new Task({
  description: 'Analyze the provided data and generate insights',
  expectedOutput: 'JSON object with analysis results',
  agent: analyst
});

// Second task uses the first task's result
const reportTask = new Task({
  description: 'Create a report using these insights: {taskResult:task1}',
  expectedOutput: 'Formatted report document',
  agent: writer
});
```

### Understanding Task Results

Task results can be:
- Simple strings
- JSON objects
- Structured data
- Markdown content

The format of the result should be documented in the task's `expectedOutput` field to ensure clarity and maintainability.

## Creating Complex Workflows

### Multi-Step Processes

Here's an example of a content creation workflow where each task builds upon previous results:

```js
const team = new Team({
  name: 'Content Pipeline',
  agents: [researcher, writer, editor, designer],
  tasks: [
    // Research Phase
    new Task({
      description: 'Research topic: {topic}',
      expectedOutput: 'Research findings in JSON format',
      agent: researcher
    }),
    // Writing Phase
    new Task({
      description: `Write an article using this research data: {taskResult:task1}
                   Include key points and maintain a professional tone.`,
      expectedOutput: 'Draft article in markdown format',
      agent: writer
    }),
    // Editing Phase
    new Task({
      description: `Edit and improve this article: {taskResult:task2}
                   Focus on clarity, flow, and engagement.`,
      expectedOutput: 'Edited article in markdown format',
      agent: editor
    }),
    // Design Phase
    new Task({
      description: `Create visual assets based on this content: {taskResult:task3}
                   Design should match the article's tone and message.`,
      expectedOutput: 'Visual assets in base64 format',
      agent: designer
    })
  ],
  inputs: { topic: 'AI Trends 2024' }
});
```

### Data Transformation Chain

Example of tasks that transform data through different formats:

```js
const pipeline = new Team({
  name: 'Data Pipeline',
  agents: [collector, processor, analyzer],
  tasks: [
    // Data Collection
    new Task({
      description: 'Collect raw data from API endpoint: {endpoint}',
      expectedOutput: 'Raw JSON data object',
      agent: collector
    }),
    // Data Processing
    new Task({
      description: `Clean and normalize this data:
        {taskResult:task1}
        Remove duplicates and standardize formats.`,
      expectedOutput: 'Processed JSON data',
      agent: processor
    }),
    // Analysis
    new Task({
      description: `Generate insights from this processed data:
        {taskResult:task2}
        Focus on key trends and patterns.`,
      expectedOutput: 'Analysis report in markdown format',
      agent: analyzer
    })
  ],
  inputs: { endpoint: 'https://api.example.com/data' }
});
```

## Best Practices

### 1. Clear Documentation

Document your task workflows by:
- Specifying expected input/output formats
- Describing data transformations
- Explaining dependencies between tasks

Example:
```js
const task = new Task({
  description: `Process customer feedback data: {taskResult:task1}
               Expected input format: JSON array of feedback objects
               Required fields: id, text, rating
               Transform into sentiment analysis report`,
  expectedOutput: `JSON object containing:
                  - Overall sentiment score
                  - Key themes identified
                  - Actionable insights`,
  agent: analyst
});
```

### 2. Error Handling

Consider potential issues:
- Missing task results
- Malformed data
- Invalid formats

Example with error checking:
```js
const task = new Task({
  description: `Analyze this data: {taskResult:task1}
               If data is missing or malformed, generate error report.
               Validate JSON structure before processing.`,
  expectedOutput: 'Analysis results or error report',
  agent: analyzer
});
```

### 3. Result Format Consistency

Maintain consistent data formats:
- Use standard formats (JSON, CSV, Markdown)
- Document format specifications
- Validate data structure

Example:
```js
const task = new Task({
  description: `Format this data as JSON: {taskResult:task1}
               Required structure:
               {
                 "title": string,
                 "content": string,
                 "metadata": {
                   "author": string,
                   "date": string,
                   "tags": string[]
                 }
               }`,
  expectedOutput: 'Properly formatted JSON object',
  agent: formatter
});
```

## Debugging Tips

### 1. Monitor Task Results

Use the team's workflow logs to track results:
```js
team.onWorkflowStatusChange((status) => {
  if (status === 'FINISHED') {
    const store = team.getStore();
    const logs = store.getState().workflowLogs;
    console.log('Task Results:', logs.filter(log => 
      log.logType === 'TaskStatusUpdate' && 
      log.taskStatus === 'DONE'
    ));
  }
});
```

### 2. Common Issues and Solutions

1. **Missing Results**
   - Check task completion status
   - Verify task order and dependencies
   - Ensure proper error handling

2. **Format Mismatches**
   - Document expected formats
   - Add format validation
   - Include format conversion steps

3. **Context Issues**
   - Verify task numbering
   - Check result interpolation
   - Validate workflow context

## Conclusion

Task result passing is a powerful feature that enables complex, multi-step workflows in KaibanJS. By following these best practices and patterns, you can create robust and maintainable task chains that effectively process and transform data through your agent workflows.

:::tip[Need Help?]
If you encounter any issues or have questions about task result passing, feel free to:
- Check our [GitHub issues](https://github.com/kaiban-ai/KaibanJS/issues)
- Join our community discussions
- Review the example projects in our repository
::: 