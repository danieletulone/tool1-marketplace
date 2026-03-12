---
name: make-prd
description: 'Generates a Product Requirements Document. Accepts a BRD path, a feature description, or both. Creates a structured PRD in docs/<feature>/prd.md with user stories, requirements, and acceptance criteria.'
user-invocable: true
argument-hint: <path to BRD or feature description>
---

# Product Requirements Document Generator

## When to Apply

Activate this skill when:

- The user wants to define product requirements for a feature
- The user runs `/make-prd` with a BRD path or a feature description
- A feature needs formal product requirements before design

## Input Handling

`$ARGUMENTS` can be:

- **A path to a BRD** (e.g., `docs/user-auth/brd.md`) — read it for context.
- **A feature description** (free text) — use it directly as the starting point.
- **Empty** — list feature folders in `docs/` that contain a `brd.md` and ask the user to pick one, OR ask for a feature description.

If a BRD exists in the feature folder, always read it. If not, that's fine — the opening questions will capture the needed context.

## Workflow

### Step 1: Read Input & Opening Questions

1. **Resolve input** from `$ARGUMENTS` as described above.
2. **If a BRD exists**, read it for business context.
3. **Read `CLAUDE.md` and `STACK.md`** to understand existing project conventions, domain, and tech stack.

Then ALWAYS ask the following questions using AskUserQuestion before generating. Ask them all at once in a single message:

1. **Who are the end users?** Are there distinct user personas or roles with different needs (e.g., free user vs paid subscriber)?
2. **What are the key user flows?** Walk me through the main actions a user would take with this feature.
3. **What are the boundaries?** Anything that might seem related but should explicitly be out of scope?
4. **Are there existing patterns to follow?** Any similar features in other apps you want to emulate or avoid?
5. **What's the priority?** Are all aspects of this feature equally important, or is there a core MVP vs nice-to-have split?

Wait for the user's answers before proceeding.

### Step 2: Generation

1. **Generate the PRD** using all available context (BRD if present, user's answers) and the template below.
2. **Save the PRD** to `docs/<name>/prd.md`. Create the directory if it doesn't exist.

### Step 3: Closing Questions

After presenting the generated PRD, ALWAYS ask the following review questions using AskUserQuestion. Ask them all at once in a single message:

1. **Are the user stories complete?** Did I miss any user persona or workflow?
2. **Are the functional requirements specific enough?** Can each one be unambiguously implemented and tested?
3. **Are the acceptance criteria testable?** Would a developer know exactly what to build from these?
4. **Is the "Out of Scope" section accurate?** Anything listed that should actually be in scope, or vice versa?
5. **Anything to add or change?** Any section that needs rework?

Apply the user's feedback by updating the saved PRD. Then suggest the next step (typically `/make-sdd docs/<name>/prd.md`).

## PRD Template

The output document MUST include these sections in order:

```markdown
# PRD: <Feature Name>

**BRD Reference:** docs/<name>/brd.md (if exists, otherwise omit this line)

## Problem Statement

What problem does this feature solve? Who is affected?

## Goals

- Numbered list of measurable goals

## User Stories

- As a [role], I want [action], so that [benefit]

## Functional Requirements

- FR-1: ...
- FR-2: ...

## Non-Functional Requirements

- NFR-1: ...
- NFR-2: ...

## Acceptance Criteria

- AC-1: Given [context], when [action], then [result]
- AC-2: ...

## Wireframes / Mockups

References or descriptions of UI mockups (if applicable). Link to design files or describe key screens.

## Out of Scope

What is explicitly NOT included in this feature.

## Dependencies & Milestones

- Dependencies on other teams, services, or features.
- Key milestones and delivery targets.

## Risks

Potential risks and mitigations.
```

## Guidelines

- The PRD defines **how the product will behave** — translating business needs into product behavior via user stories, functional specs, and UI mockups.
- Typical stakeholders: Product Manager, Tech Lead, Architect, UI/UX, QA.
- Keep requirements specific and testable.
- Use the project's domain context from `CLAUDE.md` to inform decisions.
- Number all requirements and acceptance criteria for easy reference.
- Each acceptance criteria should follow Given/When/Then format.
