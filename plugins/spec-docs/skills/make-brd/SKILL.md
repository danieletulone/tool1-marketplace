---
name: make-brd
description: 'Generates a Business Requirements Document from a business need or opportunity. Creates a structured BRD in docs/<feature>/brd.md with business objectives, stakeholders, success metrics, and constraints.'
user-invocable: true
argument-hint: <business need or opportunity>
---

# Business Requirements Document Generator

## When to Apply

Activate this skill when:

- The user wants to capture a business need or opportunity
- The user runs `/make-brd` with a business idea
- A feature needs business justification before detailed product requirements

## Workflow

### Step 1: Opening Questions

After receiving the business need from `$ARGUMENTS`, ALWAYS ask the following questions using AskUserQuestion before doing anything else. Ask them all at once in a single message:

1. **Who is the target audience?** Who are the primary users or customers that will benefit from this?
2. **What business problem does this solve?** What pain point or opportunity are we addressing?
3. **What does success look like?** How will we know this initiative succeeded? Any specific metrics or KPIs in mind?
4. **Are there any hard constraints?** Budget limits, deadlines, regulatory requirements, or technical limitations?
5. **Who are the stakeholders?** Who needs to be involved or informed about this initiative?

Wait for the user's answers before proceeding.

### Step 2: Research & Generation

1. **Read `CLAUDE.md` and `STACK.md`** to understand existing project context, domain, and tech stack.
2. **Generate the BRD** using the user's answers and the template below.
3. **Save the BRD** to `docs/<kebab-case-name>/brd.md`. Create the directory if it doesn't exist.

### Step 3: Closing Questions

After presenting the generated BRD, ALWAYS ask the following review questions using AskUserQuestion. Ask them all at once in a single message:

1. **Are the business objectives complete?** Did I miss any goals or priorities?
2. **Are the success metrics realistic?** Should any targets be adjusted?
3. **Are there missing constraints or assumptions?** Anything I took for granted that should be explicit?
4. **Is the cost-benefit analysis fair?** Does the effort vs value assessment feel right?
5. **Anything to add or change?** Any section that needs rework?

Apply the user's feedback by updating the saved BRD. Then suggest the next step based on the workflow the user is following (typically `/make-prd docs/<name>/brd.md`).

## BRD Template

The output document MUST include these sections in order:

```markdown
# BRD: <Feature Name>

## Executive Summary

Brief overview of the business need and proposed solution.

## Business Objectives

- BO-1: ...
- BO-2: ...

## Stakeholders

| Stakeholder | Role | Interest |
| ----------- | ---- | -------- |
| ...         | ...  | ...      |

## Current State

Description of the current situation and pain points.

## Desired State

Description of the target state after implementation.

## Success Metrics

- KPI-1: ... (with target value)
- KPI-2: ...

## In-Scope

What is included in this initiative.

## Out-of-Scope

What is explicitly NOT included.

## Business Rules

- BR-1: ...
- BR-2: ...

## Constraints

- Budget, timeline, technical, regulatory, or other constraints.

## Risks & Assumptions

### Risks

- Risk-1: ... (with mitigation)
- Risk-2: ...

### Assumptions

- Things assumed to be true for this initiative.

## Dependencies

- External factors or prerequisites that must be in place.

## Cost-Benefit Analysis

High-level assessment of effort vs expected value.
```

## Guidelines

- The BRD captures **what the business wants** — the "why" behind the project, not the "how".
- Typical stakeholders: Product Owner, Client, Business Analyst, CTO.
- Focus on business goals, problems to solve, and stakeholder expectations in simple, non-technical language.
- Use the project's domain context from `CLAUDE.md` to inform decisions.
- Success metrics should be measurable and time-bound where possible.
- Keep language business-oriented, avoiding technical implementation details.
