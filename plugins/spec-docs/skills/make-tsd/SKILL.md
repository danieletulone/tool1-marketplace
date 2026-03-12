---
name: make-tsd
description: 'Generates a Technical Specification Document. Accepts an SDD path, a feature description, or both. Produces implementation-ready specs including schema code, model definitions, API contracts, and a test plan.'
user-invocable: true
argument-hint: <path to SDD or feature description>
---

# Technical Specification Document Generator

## When to Apply

Activate this skill when:

- The user wants implementation-ready specs for a feature
- The user runs `/make-tsd` with an SDD path or a feature description
- A feature needs detailed technical specs before coding

## Input Handling

`$ARGUMENTS` can be:

- **A path to an SDD** (e.g., `docs/user-auth/sdd.md`) — read it and any sibling docs (BRD, PRD) for context.
- **A feature description** (free text) — use it directly as the starting point.
- **Empty** — list feature folders in `docs/` that contain an `sdd.md` and ask the user to pick one, OR ask for a feature description.

If upstream docs (BRD, PRD, SDD) exist in the feature folder, always read them. If not, the opening questions will capture the needed context.

## Workflow

### Step 1: Read Input & Opening Questions

1. **Resolve input** from `$ARGUMENTS` as described above.
2. **If upstream docs exist** (SDD, PRD, BRD), read them for context.
3. **Read `CLAUDE.md` and `STACK.md`** for project conventions, tech stack, and tooling.
4. **Inspect the current codebase**: database schema, existing models, controllers, validation, and services.
5. **Review existing code conventions** by checking sibling files in relevant directories.

Then ALWAYS ask the following questions using AskUserQuestion before generating. Ask them all at once in a single message:

1. **Any existing code to integrate with?** Are there existing services, traits, or base classes this feature should extend or reuse?
2. **Naming conventions preferences?** Any specific naming you want for tables, columns, routes, or classes?
3. **Test coverage expectations?** What level of testing do you expect — happy path only, or comprehensive edge cases and error scenarios?
4. **Environment-specific config?** Are there different configs needed for local dev, staging, and production?
5. **Seed data needs?** Do you need specific seed data for development or demo purposes?

Wait for the user's answers before proceeding.

### Step 2: Research & Generation

1. **Search documentation** for framework-specific implementation patterns if documentation tools are available (e.g., `search-docs`).
2. **Generate the TSD** using all gathered context and the template below.
3. **Save the TSD** to `docs/<name>/tsd.md`. Create the directory if it doesn't exist.

### Step 3: Closing Questions

After presenting the generated TSD, ALWAYS ask the following review questions using AskUserQuestion. Ask them all at once in a single message:

1. **Are the migrations/schema changes correct?** Column types, indexes, foreign keys, defaults — anything to adjust?
2. **Are the API contracts accurate?** Do the request/response examples match what the client (frontend/mobile) expects?
3. **Are the validation rules complete?** Any edge cases in input validation that I missed?
4. **Is the test plan thorough enough?** Any scenarios missing from the test coverage?
5. **Is the implementation checklist in the right order?** Any dependency between steps that I got wrong?

Apply the user's feedback by updating the saved TSD. Then suggest the next step (typically `/make-exec docs/<name>/tsd.md`).

## TSD Template

The output document MUST include these sections in order:

```markdown
# TSD: <Feature Name>

**Upstream docs:** (list any existing BRD/PRD/SDD references, omit if none)

## Final Tech Stack

Finalized technology choices for this feature: languages, frameworks, databases, caching, messaging, CI/CD, and containerization.

## Database Migrations / Schema Changes

Full migration or schema code for each table change, in execution order.

## Models / Entities

Model definitions with attributes, relationships, constraints, and any casting/serialization logic.

## API Contracts

For each endpoint, provide:

- Full JSON request body example
- Full JSON response body example (success + error)
- HTTP status codes

## Request Validation

Validation rules and custom error messages for each request.

## Error Codes Registry

| Code | HTTP Status | Message | When |
| ---- | ----------- | ------- | ---- |
| ...  | ...         | ...     | ...  |

## Rate Limiting Config

Rate limiter definitions and tier mappings.

## Environment Variables

| Variable | Description | Default | Required |
| -------- | ----------- | ------- | -------- |
| ...      | ...         | ...     | ...      |

## Implementation Checklist

Ordered list of implementation steps. Mark which steps can be parallelized.

- [ ] Phase 1: Schema changes, Enums, Config
- [ ] Phase 2: Models, Factories/Fixtures, Seeders
- [ ] Phase 3: Auth middleware/guards
- [ ] Phase 4: Services, Jobs, Actions
- [ ] Phase 5: Controllers, Request Validation, Response Formatting, Routes
- [ ] Phase 6: Feature & Unit tests
- [ ] Phase 7: Run test suite + code formatter

## Performance & Security Standards

Performance targets (response times, throughput, concurrency) and security standards (encryption, token handling, OWASP compliance).

## Deployment Plan

Deployment strategy: environments, rollout steps, rollback procedures, and feature flag configuration.

## Test Plan

List of test cases organized by type (Feature/Unit/Integration) with descriptions.
```

## Guidelines

- The TSD is the **developer playbook** — it defines **how the system will be built** with finalized tech stack, exact API endpoints, DB schemas, testing strategies, and deployment guidelines.
- Typical stakeholders: Developers, QA, DevOps, Tech Leads.
- Schema/migration code must be complete and copy-pasteable.
- API contracts must include realistic example data.
- Follow the project's existing validation style (check sibling files for convention).
- Error codes should be unique and follow a consistent pattern.
- The implementation checklist must reflect the phased approach used by `/make-exec`.
- Test plan should cover happy paths, edge cases, and error scenarios.
