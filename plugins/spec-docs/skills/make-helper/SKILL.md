---
name: make-helper
description: "Helps you pick the right spec-driven workflow for your feature. Asks a few questions and recommends one of 5 workflows, from full enterprise pipeline to direct implementation."
user-invocable: true
argument-hint: <optional: feature idea or description>
---

# Workflow Router

## When to Apply

Activate this skill when:

- The user wants to build a feature but isn't sure where to start
- The user runs `/make-helper` with an optional feature description
- The user needs help choosing between the different spec workflows

## Workflow

### Step 1: Gather Context

If `$ARGUMENTS` contains a feature description, note it. Then ALWAYS ask the following questions using AskUserQuestion. Ask them all at once in a single message:

1. **How complex is this feature?**
   - (a) Simple — a single endpoint, model, or small change
   - (b) Medium — a few related endpoints, some business logic
   - (c) Complex — multiple models, integrations, auth flows, significant business logic
   - (d) Very complex — cross-cutting concerns, external services, needs stakeholder alignment

2. **How clear is the scope?**
   - (a) Crystal clear — I know exactly what to build, down to the fields and endpoints
   - (b) Mostly clear — I know the feature well but haven't defined exact contracts
   - (c) Rough idea — I know the goal but not the details
   - (d) Vague — I have a business need but haven't thought through the product shape

3. **Is there a team or stakeholders involved?**
   - (a) Just me — solo project, I decide everything
   - (b) Small team — a few people, informal communication
   - (c) Multiple stakeholders — need alignment and a paper trail

4. **How important is documentation for this feature?**
   - (a) Don't care — just build it, I'll document later if needed
   - (b) Minimal — want a design doc for reference
   - (c) Important — want specs I can review and share before building
   - (d) Critical — need full traceability from business need to code

Wait for the user's answers before proceeding.

### Step 2: Recommend a Workflow

Based on the answers, recommend ONE of the 5 workflows below. Explain why it fits, and immediately invoke the first skill of the chosen workflow using the Skill tool. If the user provided a feature description in `$ARGUMENTS`, pass it along.

#### Decision Matrix

| Complexity | Scope Clarity | Stakeholders | Docs Importance | Recommended Workflow |
| ---------- | ------------- | ------------ | --------------- | -------------------- |
| d (any)    | d             | c            | c-d             | **Full**             |
| c-d        | c-d           | b-c          | c-d             | **Full**             |
| c          | b-c           | a-b          | b-c             | **Standard**         |
| b-c        | b-c           | a-b          | b               | **Standard**         |
| b          | b             | a            | b               | **Design-First**     |
| b          | a-b           | a            | a-b             | **Spec & Build**     |
| a          | a             | a            | a               | **Direct Build**     |

Use this as a guide, not rigid rules. When in doubt between two workflows, briefly explain both options and let the user choose.

---

## The 5 Workflows

### 1. Full Pipeline

**`BRD -> PRD -> SDD -> TSD -> Exec`**

Best for: Complex features, multiple stakeholders, need full traceability.

```
/make-brd  <business need>         -> docs/<feature>/brd.md
/make-prd  docs/<feature>/brd.md   -> docs/<feature>/prd.md
/make-sdd  docs/<feature>/prd.md   -> docs/<feature>/sdd.md
/make-tsd  docs/<feature>/sdd.md   -> docs/<feature>/tsd.md
/make-exec docs/<feature>/tsd.md   -> implementation
```

Use when:

- The feature is driven by a business need that requires justification
- Multiple stakeholders need to review and approve at each stage
- You need a full audit trail from "why" to "how"
- The feature is large, risky, or cross-cutting

### 2. Standard

**`PRD -> SDD -> TSD -> Exec`**

Best for: Most features. You know the problem, need to define it properly.

```
/make-prd  <feature description>   -> docs/<feature>/prd.md
/make-sdd  docs/<feature>/prd.md   -> docs/<feature>/sdd.md
/make-tsd  docs/<feature>/sdd.md   -> docs/<feature>/tsd.md
/make-exec docs/<feature>/tsd.md   -> implementation
```

Use when:

- Business need is obvious (no BRD needed)
- You want proper requirements and design before building
- Medium to complex features with some unknowns
- You want documentation for future reference

### 3. Design-First

**`SDD -> TSD -> Exec`**

Best for: You know what the user needs, just need to design and build it.

```
/make-sdd  <feature description>   -> docs/<feature>/sdd.md
/make-tsd  docs/<feature>/sdd.md   -> docs/<feature>/tsd.md
/make-exec docs/<feature>/tsd.md   -> implementation
```

Use when:

- Requirements are already clear (from a ticket, conversation, or your head)
- You need architecture decisions documented
- Medium complexity, some design questions to resolve
- You want a design doc but don't need formal requirements

### 4. Spec & Build

**`TSD -> Exec`**

Best for: You know the design, just need exact specs and code.

```
/make-tsd  <feature description>   -> docs/<feature>/tsd.md
/make-exec docs/<feature>/tsd.md   -> implementation
```

Use when:

- Architecture is already decided
- You want exact API contracts, migration code, and test plans before coding
- The feature is straightforward but you want precision
- You've built similar features before and just need the details nailed down

### 5. Direct Build

**`Exec`**

Best for: Small, well-understood changes. Just build it.

```
/make-exec <feature description>   -> implementation
```

Use when:

- Simple feature — a single endpoint, CRUD, config change
- You know exactly what you want, including field names and behavior
- No architectural decisions to make
- Low risk, easily reversible
