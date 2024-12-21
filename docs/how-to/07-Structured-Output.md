---
title: Structured Output
description: Define the exact shape and format of your AI agent outputs to ensure consistent and predictable responses.
---

# How to Use Structured Output Validation

This guide shows you how to implement structured output validation in your KaibanJS tasks using Zod schemas.

## Prerequisites

- KaibanJS installed in your project
- Basic understanding of Zod schema validation

## Setting Up Schema Validation

### Step 1: Install Dependencies

```bash
npm install zod
```

### Step 2: Import Required Modules

```javascript
const { z } = require('zod');
const { Task } = require('kaibanjs');
```

### Step 3: Define Your Schema

```javascript
const task = new Task({
  description: "Extract article metadata",
  expectedOutput: "Get the article's title and list of tags", // Human-readable instructions
  outputSchema: z.object({                                    // Validation schema
    title: z.string(),
    tags: z.array(z.string())
  })
});
```

## Common Use Cases

### 1. Product Information Extraction

```javascript
const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  features: z.array(z.string()),
  availability: z.boolean()
});

const task = new Task({
  description: "Extract product details from the provided text",
  expectedOutput: "Extract product name, price, features, and availability status",
  outputSchema: productSchema
});
```

### 2. Meeting Summary Generation

```javascript
const meetingSummarySchema = z.object({
  title: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
  keyPoints: z.array(z.string()),
  actionItems: z.array(z.object({
    task: z.string(),
    assignee: z.string(),
    dueDate: z.string().optional()
  }))
});

const task = new Task({
  description: "Generate a structured summary of the meeting",
  expectedOutput: "Create a meeting summary with title, date, participants, key points, and action items",
  outputSchema: meetingSummarySchema
});
```

## Handling Schema Validation

When an agent's output doesn't match your schema:

1. The agent enters an `OUTPUT_SCHEMA_VALIDATION_ERROR` state
2. It receives feedback about the validation error
3. It attempts to correct the output format as part of the agentic loop

You can monitor these validation events using the workflowLogs:

```javascript
function monitorSchemaValidation(teamStore) {
    // Subscribe to workflow logs updates
    teamStore.subscribe(
        state => state.workflowLogs,
        (logs) => {
            // Find validation error logs
            const validationErrors = logs.filter(log =>
                log.logType === "AgentStatusUpdate" && 
                log.agentStatus === "OUTPUT_SCHEMA_VALIDATION_ERROR"
            );

            if (validationErrors.length > 0) {
                const latestError = validationErrors[validationErrors.length - 1];
                console.log('Schema validation failed:', latestError.logDescription);
                console.log('Error details:', latestError.metadata);
            }
        }
    );
}

// Example usage
const teamStore = myTeam.useStore();
monitorSchemaValidation(teamStore);
```

This approach allows you to:
- Track all schema validation attempts
- Access detailed error information
- Monitor the agent's attempts to correct the output
- Implement custom error handling based on the validation results

## Best Practices

1. **Keep Schemas Focused**
   - Define schemas that capture only the essential data
   - Avoid overly complex nested structures

2. **Clear Instructions**
   - Provide detailed `expectedOutput` descriptions
   - Include example outputs in your task description

3. **Flexible Validation**
   - Use `optional()` for non-required fields
   - Consider using `nullable()` when appropriate
   - Implement `default()` values where it makes sense

4. **Error Recovery**
   - Implement proper error handling
   - Consider retry strategies for failed validations
   - Log validation errors for debugging

## Troubleshooting

Common issues and solutions:

1. **Invalid Types**
   ```javascript
   // Instead of
   price: z.string()
   // Use
   price: z.number()
   ```

2. **Missing Required Fields**
   ```javascript
   // Make fields optional when needed
   dueDate: z.string().optional()
   ```

3. **Array Validation**
   ```javascript
   // Validate array items
   tags: z.array(z.string())
   // With minimum length
   tags: z.array(z.string()).min(1)
   ```

## Limitations

- Schema validation occurs after response generation
- Complex schemas may require multiple validation attempts
- Nested schemas might need more specific agent instructions 

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::