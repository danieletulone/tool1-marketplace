---
name: make-exec
description: 'Implements a feature from a Technical Specification Document or a direct description. Executes in phased steps: schema, models, auth, services, controllers, tests, then runs the test suite and code formatter.'
user-invocable: true
argument-hint: <path to TSD or feature description>
---

# Implementation Executor

## When to Apply

Activate this skill when:

- The user wants to implement a feature
- The user runs `/make-exec` with a TSD path or a feature description
- Specs are ready and the user wants code generated

## Input Handling

`$ARGUMENTS` can be:

- **A path to a TSD** (e.g., `docs/user-auth/tsd.md`) — read it and any sibling docs (BRD, PRD, SDD) for full context.
- **A feature description** (free text) — use it directly; the opening questions will capture implementation details.
- **Empty** — list feature folders in `docs/` that contain a `tsd.md` and ask the user to pick one, OR ask what to build.

If upstream docs exist in the feature folder, always read them. If not, the opening questions will capture the needed context.

## Workflow

### Step 1: Read Input & Opening Questions

1. **Resolve input** from `$ARGUMENTS` as described above.
2. **If upstream docs exist** (TSD, SDD, PRD, BRD), read them for context.
3. **Read `CLAUDE.md` and `STACK.md`** for project conventions, tech stack, and tooling.

Then ALWAYS ask the following questions using AskUserQuestion before starting implementation. Ask them all at once in a single message:

1. **Ready to implement?** Have you reviewed the spec (if any)? Any last-minute changes?
2. **Git branch?** Should I work on the current branch, or do you want to create a feature branch first?
3. **Partial implementation?** Do you want all phases executed, or only specific ones (e.g., just schema and models for now)?
4. **Existing data concerns?** Is there existing data in the database that migrations need to preserve?
5. **Any blockers?** Are all required environment variables, API keys, or external services ready?

Wait for the user's answers before proceeding.

### Step 2: Phased Implementation

Execute in phases, using the Agent tool for parallel workstreams where possible within each phase. Phases MUST be sequential. Use the project's scaffolding/CLI tools as documented in `CLAUDE.md` and `STACK.md`.

#### Phase 1: Schema Changes, Enums, Config

- Create database migrations or schema changes
- Create Enum or constant definitions
- Add or update config files
- Run migrations

#### Phase 2: Models, Factories/Fixtures, Seeders

- Create model/entity classes with attributes, relationships, and constraints
- Implement factories or fixtures with realistic data
- Create seeders for development data

#### Phase 3: Auth Middleware/Guards

- Create any custom middleware or guards
- Register them in the project's middleware configuration
- Use the project's built-in auth features

#### Phase 4: Services, Jobs, Actions

- Create service classes for business logic
- Create async jobs for time-consuming operations
- Create action classes for discrete operations

#### Phase 5: Controllers, Request Validation, Response Formatting, Routes

- Create request validation classes
- Create response formatting/resource classes
- Create controllers
- Register routes following the project's API versioning convention

#### Phase 6: Feature & Unit Tests

- Activate any testing-related skills available in the project
- Create feature tests for API endpoints
- Create unit tests for services and actions
- Use model factories/fixtures for test data

#### Phase 7: Verification

- Run the project's test suite
- Run the project's code formatter/linter

### Step 3: Closing Questions

After implementation is complete, present a completion summary (files created, files modified, test results) and ALWAYS ask the following review questions using AskUserQuestion. Ask them all at once in a single message:

1. **Do the tests cover enough?** Should I add more test cases for edge cases or error scenarios?
2. **Any manual testing needed?** Do you want to test specific endpoints or flows before considering this done?
3. **Documentation updates?** Should I update any README or API documentation?
4. **Ready to commit?** Should I create a commit with these changes?
5. **Anything unexpected?** Did any part of the implementation deviate from the spec that we should document?

Apply the user's feedback before finalizing.

## Guidelines

- Use the project's CLI/scaffolding tools to create files (check `CLAUDE.md` and `STACK.md` for commands).
- Follow existing code conventions by checking sibling files before creating new ones.
- Use documentation search tools (e.g., `search-docs`) when available for framework-specific patterns.
- Use the Agent tool to parallelize independent tasks within the same phase.
- Never skip phases even if they seem empty — confirm each phase has nothing to do before moving on.
- If a phase fails, stop and report the error rather than continuing.
