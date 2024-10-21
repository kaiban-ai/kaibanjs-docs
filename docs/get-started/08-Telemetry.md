---
title: Telemetry
description: Learn about KaibanJS's telemetry feature, how it works, and how to opt out if desired.
---

# Telemetry in KaibanJS

KaibanJS includes anonymous usage analytics powered by [TelemetryDeck](https://telemetrydeck.com/), a privacy-focused analytics tool. This feature helps the core maintainer team gather anonymous data to improve the library's performance, stability, and user experience.

## How It Works

The telemetry system in KaibanJS is designed with the following principles:

1. **Privacy-First**: Only anonymous, non-personal information is collected.
2. **Lightweight**: Minimal impact on application performance.
3. **GDPR Compliant**: Helps maintain compliance with data protection regulations.

## Benefits

The inclusion of telemetry provides several benefits:

1. Improved debugging capabilities for the maintainer team.
2. Performance insights to optimize different parts of the library.
3. Data-driven decision making for enhancing the codebase.

## User Control

We respect your privacy and give you full control over the telemetry data collection:

- By default, telemetry is enabled to help improve KaibanJS.
- You can opt out of telemetry by setting the `KAIBAN_TELEMETRY_OPT_OUT` environment variable.

## Opting Out

To opt out of telemetry, set the `KAIBAN_TELEMETRY_OPT_OUT` environment variable before running your KaibanJS application:

```bash
export KAIBAN_TELEMETRY_OPT_OUT=true
```

When opted out, a mock telemetry instance is used, ensuring no data is collected.

## Implementation Details

- For CLI commands, unique, anonymous project identifiers are generated using a combination of the project name and a hashed machine ID:
  ```javascript
  function generateProjectId() {
    const projectName = path.basename(process.cwd());
    const userHome = process.env.HOME || process.env.USERPROFILE || '';
    const machineId = crypto.createHash('md5').update(userHome).digest('hex');
    const uniqueString = `${projectName}-${machineId}`;
    
    return crypto.createHash('md5').update(uniqueString).digest('hex');
  }
  ```
  This ensures that the project ID is consistent for the same project on the same machine when using CLI commands, while still maintaining anonymity.
- For runtime usage, random UUIDs are used to generate unique identifiers for each session.
- The system works in both browser and Node.js environments.
- Fallbacks are included for older Node.js versions and environments where `SubtleCrypto` is not available.

## Data Collection

The telemetry system collects only the following anonymous events:

1. Installation: When KaibanJS is installed (CLI).
2. Board Run: When a KaibanJS board is run (CLI).
3. Board Init: When a new KaibanJS board is initialized (CLI).
4. Workflow Start: When a workflow is started (runtime).

For CLI commands (events 1-3), these events are associated with the anonymized project ID generated as described above. This helps us understand how KaibanJS is being used across different projects and machines for CLI operations.

For runtime usage (event 4), a random UUID is generated for each session, ensuring complete anonymity for workflow executions.

No personally identifiable information is ever collected or transmitted in either case.

## Transparency

We are committed to transparency in our data collection practices. If you have any questions or concerns about the telemetry system, please [open an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues).

By using KaibanJS, you help us improve the library for everyone. We appreciate your support in making KaibanJS better!

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
