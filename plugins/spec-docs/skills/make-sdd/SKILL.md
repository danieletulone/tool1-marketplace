---
name: make-sdd
description: "Generates a Software Design Document. Accepts a PRD path, a feature description, or both. Reads codebase context to produce an architecture-level design in the feature's docs folder."
user-invocable: true
argument-hint: <path to PRD or feature description>
---

# Software Design Document Generator

## When to Apply

Activate this skill when:

- The user wants to design the architecture for a feature
- The user runs `/make-sdd` with a PRD path or a feature description
- A feature needs technical design before implementation

## Input Handling

`$ARGUMENTS` can be:

- **A path to a PRD** (e.g., `docs/user-auth/prd.md`) — read it and any sibling docs (BRD) for context.
- **A feature description** (free text) — use it directly as the starting point.
- **Empty** — list feature folders in `docs/` that contain a `prd.md` and ask the user to pick one, OR ask for a feature description.

If upstream docs (BRD, PRD) exist in the feature folder, always read them. If not, the opening questions will capture the needed context.

## Workflow

### Step 1: Read Input & Opening Questions

1. **Resolve input** from `$ARGUMENTS` as described above.
2. **If upstream docs exist** (PRD, BRD), read them for context.
3. **Read `CLAUDE.md` and `STACK.md`** to understand project conventions, tech stack, and architecture.
4. **Inspect the current state** of the codebase: database schema (if applicable), existing models, routes, and services.

Then ALWAYS ask the following questions using AskUserQuestion before generating. Ask them all at once in a single message:

1. **Are there architectural preferences?** Any patterns you want to use or avoid (e.g., event-driven, repository pattern, service classes)?
2. **External service integrations?** Which third-party APIs, SDKs, or services should this feature integrate with? Any existing clients?
3. **Performance expectations?** Expected response times, concurrent users, or throughput requirements?
4. **Data retention & privacy?** Any requirements for how long data is stored, GDPR compliance, or data anonymization?
5. **Deployment considerations?** Any phased rollout, feature flags, or backward compatibility concerns?

Wait for the user's answers before proceeding.

### Step 2: Research & Generation

1. **Search documentation** for relevant framework/library patterns if documentation tools are available (e.g., `search-docs`).
2. **Generate the SDD** using all gathered context and the template below.
3. **Save the SDD** to `docs/<name>/sdd.md`. Create the directory if it doesn't exist.

### Step 3: Closing Questions

After presenting the generated SDD, ALWAYS ask the following review questions using AskUserQuestion. Ask them all at once in a single message:

1. **Does the data model make sense?** Are the relationships, attributes, and indexes appropriate?
2. **Are the API endpoints well-designed?** Right HTTP methods, sensible URIs, correct auth requirements?
3. **Is the auth flow secure?** Any concerns about the authentication or authorization approach?
4. **Is the rate limiting strategy appropriate?** Are the tier limits and enforcement mechanisms right?
5. **Anything missing or wrong?** Any architectural concern, edge case, or integration point I overlooked?

Apply the user's feedback by updating the saved SDD. Then suggest the next step (typically `/make-tsd docs/<name>/sdd.md`).

## SDD Template

The output document MUST include these sections in order:

```markdown
# SDD: <Feature Name>

**Upstream docs:** (list any existing BRD/PRD references, omit if none)

## Architecture Overview

High-level description of how this feature fits into the existing system.

## Module Breakdown

Decomposition of the feature into modules/components, their responsibilities, and how they interact.

## Data Models

- Conceptual database design: new models, their attributes, relationships, and constraints
- Modifications to existing models

## API Endpoints

| Method | Endpoint    | Description | Auth | Rate Limit |
| ------ | ----------- | ----------- | ---- | ---------- |
| POST   | /api/v1/... | ...         | ...  | ...        |

## Auth Flow

How authentication and authorization work for this feature.

## Sequence Diagrams

Use Mermaid syntax for request flows.

## Rate Limiting Strategy

Tier-based limits and how they are enforced.

## Error Handling

Standard error response format and specific error scenarios.

## Security Considerations

Authentication, authorization, data protection, input validation, and other security concerns.

## Dependencies

External services, packages, or APIs required.

## Migration Plan

Order of operations for deploying this feature safely.
```

## Guidelines

- The SDD is the **architectural blueprint** — it defines **how the system will be designed**, not implementation details like specific code or exact tool choices.
- Typical stakeholders: Tech Lead, Architect, Senior Devs.
- Focus on how everything connects — modules, databases, APIs — at a conceptual level.
- Follow the project's conventions from `CLAUDE.md` for API versioning, naming, and structure.
- Use framework documentation tools (e.g., `search-docs`) when available to confirm patterns.
- Reference the existing database schema to avoid conflicts.
- Include Mermaid sequence diagrams or data flow diagrams for complex flows.
- Consider the project's subscription or pricing tiers (if any) in rate limiting.
