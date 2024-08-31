---
title: Using Typescript
description: KaibanJS is type supported. You can use TypeScript to get better type checking and intellisense with powerful IDEs like Visual Studio Code.
---

## Setup 
To start using typescript, you need to install the typescript package:

```bash
npm install typescript --save-dev
```

You may optionally create a custom tsconfig file to configure your typescript settings. A base settings file looks like this:

```json
{
  "compilerOptions": {
    "noEmit": true,
    "strict": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules"]
}
```

Now you can follow the, [Quick Start](/docs/get-started/01-Quick%20Start.md) guide to get started with KaibanJS using TypeScript.

## Types
Base classes are already type suported and you can import them like below:-

```typescript
import { Agent, Task, Team } from "kaibanjs";
```

For any other specific types, can call them like below:-

```typescript
import type { IAgentParams, ITaskParams } from "kaibanjs";
```

## Learn more
This guide has covered the basics of setting up TypeScript for use with KaibanJS. But if you want to learn more about TypeScript itself, there are many resources available to help you.

We recommend the following resources:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - The TypeScript handbook is the official documentation for TypeScript, and covers most key language features.
- [TypeScript Discord](https://discord.com/invite/typescript) - The TypeScript Community Discord is a great place to ask questions and get help with TypeScript issues.
