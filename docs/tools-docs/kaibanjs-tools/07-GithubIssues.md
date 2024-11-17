---
title: GitHub Issues
description: GitHub Issues tool provides access to repository issues with automatic pagination and structured data retrieval.
---

# GitHub Issues Tool

## Description

The GitHub Issues tool integrates with GitHub's API to fetch issues from specified repositories. It provides a clean, structured way to retrieve and analyze repository issues.

![GitHub Issues Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1731857097/GithubIssues_wywql7.png)

:::tip[Try it in the Kaiban Board!]
Want to see this tool in action? Check out our interactive Kaiban Board! [Try it now!](https://www.kaibanjs.com/share/VbAmEbFRKSDJuI5bESea)
:::

Enhance your agents with:
- **Issue Collection**: Fetch open issues from any public GitHub repository
- **Automatic Pagination**: Handle large sets of issues seamlessly
- **Structured Data**: Get well-formatted issue details and metadata
- **Flexible Authentication**: Work with or without GitHub tokens

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
A GitHub Personal Access Token is optional but recommended:
- Without token: 60 requests/hour limit
- With token: 5,000 requests/hour limit
Create your token at [GitHub Developer Settings](https://github.com/settings/tokens)

## Example

Here's how to use the GitHub Issues tool:

```javascript
import { GithubIssues } from '@kaibanjs/tools';

// Configure GitHub tool
const githubTool = new GithubIssues({
    token: 'github_pat_...', // Optional: higher rate limits with token
    limit: 20 // Optional: number of issues to fetch
});

// Create issue collector agent
const issueCollector = new Agent({
    name: 'Luna',
    role: 'Issue Collector',
    goal: 'Gather and organize GitHub issues efficiently',
    background: 'Specialized in data collection from GitHub repositories',
    tools: [githubTool]
});

// Create a team
const team = new Team({
    name: 'GitHub Issue Analysis Team',
    agents: [issueCollector],
    tasks: [/* your tasks */],
    inputs: {
        repository: 'https://github.com/owner/repo'
    }
});
```

## Parameters

- `token` **Optional**. GitHub Personal Access Token for higher rate limits
  - Without token: 60 requests/hour
  - With token: 5,000 requests/hour
- `limit` **Optional**. Number of issues to fetch per request. Default is 10.

## Rate Limits
- **Authenticated**: 5,000 requests per hour
- **Unauthenticated**: 60 requests per hour

For more information about GitHub's API, visit: [GitHub REST API Documentation](https://docs.github.com/en/rest)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::