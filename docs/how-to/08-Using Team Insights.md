---
title: Using Team Insights
description: Learn how to leverage team insights in KaibanJS to provide agents with historical knowledge and context for better decision-making.
---

## Introduction

Team insights in KaibanJS allow you to provide your agents with a shared knowledge base of historical data, patterns, and experiences. This feature enables agents to make more informed decisions and provide context-aware responses based on past experiences and established patterns.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## How to Implement Team Insights

To use team insights, you need to provide an `insights` string when creating your team. This string can contain any relevant information that you want your agents to consider during task execution.

### Basic Usage

Here's a simple example of how to create a team with insights:

```javascript
import { Agent, Task, Team } from 'kaibanjs';

const team = new Team({
  name: 'Customer Service Team',
  agents: [/* your agents */],
  tasks: [/* your tasks */],
  insights: `
Customer Service History (2023):
1. Most common inquiries relate to account access (45% of tickets)
2. Peak support hours: 9 AM - 11 AM EST
3. Average response time: 2.5 minutes
4. Customer satisfaction highest with video tutorials
5. Common pain point: password reset process
  `
});
```

### Structured Insights

For more complex scenarios, you can structure your insights to make them more organized and easier for agents to reference:

```javascript
const team = new Team({
  name: 'Travel Experience Team',
  agents: [profileAnalyst, recommendationAgent],
  tasks: [analysisTask, recommendationTask],
  insights: `
Passenger Profile: Michael Zhang (FF-789321)
Travel History and Preferences (2023):
1. Seating: Window seats (87% of flights), Row 11 preferred
2. Dining: Asian Vegetarian meals (9/10 long-haul flights)
3. Airport Services: Terminal 4 lounge user (avg. 2.5hr stays)
4. Entertainment: Dissatisfied with 787 fleet options
5. Past Issues: Delays on DXB-892, requested better updates

Flight Statistics:
- Total Flights: 24
- Long-haul: 10
- Domestic: 14
- On-time Rate: 92%

Customer Feedback:
- Survey ID: CS-982
- Satisfaction Score: 4.2/5
- Key Comments: "Great service, needs better delay updates"
  `
});
```

## Best Practices

1. **Structure Your Insights**
   - Organize information into clear categories
   - Use bullet points or numbered lists for better readability
   - Include specific identifiers and metrics when available

2. **Keep Information Relevant**
   - Include only information that agents need for their tasks
   - Update insights regularly to maintain relevance
   - Remove outdated or irrelevant information

3. **Include Specific Details**
   - Use concrete numbers and statistics
   - Reference specific IDs or identifiers
   - Include dates and timeframes

4. **Format for Readability**
   - Use clear section headers
   - Break down long paragraphs
   - Highlight key information

## Common Use Cases

1. **Customer Service**
   - Customer interaction history
   - Common issues and solutions
   - Peak service times
   - Customer satisfaction metrics

2. **Travel Services**
   - Passenger preferences
   - Travel history
   - Service ratings
   - Common complaints

3. **Project Management**
   - Team performance metrics
   - Project success rates
   - Common bottlenecks
   - Best practices

4. **Product Development**
   - User feedback history
   - Feature usage statistics
   - Common feature requests
   - Bug patterns

## Example: Full Implementation

Here's a complete example showing how insights can be used in a customer service context:

```javascript
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const analysisAgent = new Agent({
  name: 'Alice',
  role: 'Customer Profile Analyst',
  goal: 'Analyze customer history and identify key patterns',
  background: 'Customer Behavior Analysis',
});

const supportAgent = new Agent({
  name: 'Bob',
  role: 'Support Specialist',
  goal: 'Provide personalized support solutions',
  background: 'Customer Service and Problem Resolution',
});

// Define tasks
const analysisTask = new Task({
  description: 'Analyze customer profile and recent interactions',
  expectedOutput: 'Detailed analysis of customer needs and patterns',
  agent: analysisAgent,
});

const supportTask = new Task({
  description: 'Create personalized support plan based on analysis',
  expectedOutput: 'Support plan with specific recommendations',
  agent: supportAgent,
  isDeliverable: true,
});

// Create team with insights
const team = new Team({
  name: 'Customer Support Team',
  agents: [analysisAgent, supportAgent],
  tasks: [analysisTask, supportTask],
  insights: `
Customer: John Smith (ID: CS-45678)
Support History (Last 90 Days):
1. Ticket #T-892: Login issues with mobile app
   - Resolution: Guided through app reinstallation
   - Satisfaction: 4/5

2. Ticket #T-923: Billing inquiry
   - Resolution: Explained premium features
   - Satisfaction: 5/5

Usage Patterns:
- Primary platform: Mobile (iOS)
- Feature usage: Heavy user of analytics dashboard
- Login frequency: Daily
- Subscription: Premium tier

Previous Feedback:
- Appreciates quick responses
- Prefers video tutorials over text
- Has mentioned interest in API access
  `,
  env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
});

// Start the workflow
team.start()
  .then(output => {
    console.log('Support plan:', output.result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Conclusion

Team insights are a powerful feature in KaibanJS that enable you to create more context-aware and effective multi-agent systems. By providing your agents with relevant historical data and patterns, you can significantly improve the quality and relevance of their outputs.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 