---
title: Core Concepts Overview
description: A brief introduction to the fundamental concepts of KaibanJS - Agents, Tasks, Teams, and Tools.
---
<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', marginBottom: '2rem'}}>

<iframe width="560" height="315" src="https://www.youtube.com/embed/VxfOIZLvBug?si=1V0mZCzQzGC-bKiJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></iframe>
</div>

KaibanJS is built around four primary components: `Agents`, `Tools`, `Tasks`, and `Teams`. Understanding how these elements interact is key to leveraging the full power of the framework.

### Agents

Agents are the autonomous actors in KaibanJS. They can:
- Process information
- Make decisions
- Execute actions
- Interact with other agents

Each agent has:
- A unique role or specialty
- Defined capabilities
- Specific goals or objectives

### Tools

Tools are specific capabilities or functions that agents can use to perform their tasks. They:
- Extend an agent's abilities
- Can include various functionalities like web searches, data processing, or external API interactions
- Allow for customization and specialization of agents

### Tasks

Tasks represent units of work within the system. They:
- Encapsulate specific actions or processes
- Can be assigned to agents
- Have defined inputs and expected outputs
- May be part of larger workflows or sequences

### Teams

Teams are collections of agents working together. They:
- Combine diverse agent capabilities
- Enable complex problem-solving
- Facilitate collaborative workflows

### How Components Work Together

1. **Task Assignment**: Tasks are created and assigned to appropriate agents or teams.

2. **Agent Processing**: Agents analyze tasks, make decisions, and take actions based on their capabilities, tools, and the task requirements.

3. **Tool Utilization**: Agents use their assigned tools to gather information, process data, or perform specific actions required by their tasks.

4. **Collaboration**: In team settings, agents communicate and coordinate to complete more complex tasks, often sharing the results of their tool usage.

5. **Workflow Execution**: Multiple tasks can be chained together to form workflows, allowing for sophisticated, multi-step processes.

6. **Feedback and Iteration**: Results from completed tasks can inform future actions or trigger new tasks, creating dynamic and adaptive systems.

By combining these core concepts, KaibanJS enables the creation of flexible, intelligent systems capable of handling a wide range of applications, from simple automation to complex decision-making processes. The integration of Tools with Agents, Tasks, and Teams allows for highly customizable and powerful AI-driven solutions.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We’re all ears!
:::