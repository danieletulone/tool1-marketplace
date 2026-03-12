# spec-docs

> Spec-driven development plugin with skills for generating structured documentation

**Version:** 1.0.0 | **Author:** danieletulone | **License:** Apache-2.0

## Installation

```bash
/plugin install spec-docs@tool1-marketplace
```

## What it does

A skills-only plugin for spec-driven development. It guides you from business need to working code through a pipeline of structured documents — each skill generates one document that feeds into the next.

## Quick Start

The fastest way to get started is the **helper skill**. It asks a few questions about your feature and recommends the right workflow:

```
/make-helper my feature idea
```

You can also use any skill individually if you already know what document you need:

```
/make-prd Add user authentication with OAuth
```

## Skills

| Skill | Command | Description |
| ----- | ------- | ----------- |
| **Workflow Router** | `/make-helper` | Asks about complexity, scope, and stakeholders, then recommends one of 5 workflows and kicks it off |
| **BRD Generator** | `/make-brd` | Generates a Business Requirements Document — business objectives, stakeholders, success metrics, constraints |
| **PRD Generator** | `/make-prd` | Generates a Product Requirements Document — user stories, functional requirements, acceptance criteria |
| **SDD Generator** | `/make-sdd` | Generates a Software Design Document — architecture, data models, API endpoints, sequence diagrams |
| **TSD Generator** | `/make-tsd` | Generates a Technical Specification Document — migrations, API contracts, validation rules, test plan |
| **Executor** | `/make-exec` | Implements the feature in phased steps: schema, models, auth, services, controllers, tests |

## Workflows

The plugin supports 5 workflows, from full enterprise pipeline to direct implementation. Use `/make-helper` to get a recommendation, or pick one yourself:

### 1. Full Pipeline

```
/make-brd → /make-prd → /make-sdd → /make-tsd → /make-exec
```

For complex features with multiple stakeholders that need full traceability from business need to code.

### 2. Standard

```
/make-prd → /make-sdd → /make-tsd → /make-exec
```

For most features. You know the problem, need to define it properly before building.

### 3. Design-First

```
/make-sdd → /make-tsd → /make-exec
```

Requirements are clear, just need architecture decisions documented before implementation.

### 4. Spec & Build

```
/make-tsd → /make-exec
```

Architecture is decided, just need exact specs (API contracts, migrations, test plan) and code.

### 5. Direct Build

```
/make-exec
```

Small, well-understood changes. Just build it.

## How it works

1. **Each skill asks opening questions** to gather context before generating anything.
2. **Documents are saved** to `docs/<feature-name>/` — one file per stage (`brd.md`, `prd.md`, `sdd.md`, `tsd.md`).
3. **Each skill reads upstream docs** automatically. Running `/make-sdd docs/auth/prd.md` will also read the BRD if it exists.
4. **After generation, review questions** are asked so you can refine the document before moving on.
5. **Each skill suggests the next step** when done.

## Example

```bash
# Start with the helper — it'll recommend a workflow
/make-helper Add OAuth2 login with Google and GitHub

# Or jump straight to a specific document
/make-prd Add OAuth2 login with Google and GitHub

# Feed the output of one skill into the next
/make-sdd docs/oauth-login/prd.md

# Continue the pipeline
/make-tsd docs/oauth-login/sdd.md

# Implement it
/make-exec docs/oauth-login/tsd.md
```

## Configuration

After installation, configuration is stored in `.plugin-config/spec-docs.json`.

| Option     | Default | Description                        |
| ---------- | ------- | ---------------------------------- |
| `showLogs` | `false` | Enable verbose logging during runs |

## Keywords

`claude-code`, `plugin`, `spec`, `requirements`, `docs`, `workflow`
