# Architecture decision records

Short records of decisions that changed a rule this project otherwise follows.

The design principles in [`AGENTS.md`](../../AGENTS.md) §6 are defaults, not laws. They
can be overridden — but only deliberately, by a person, with the reasoning written down.
That is what these files are for. Six months from now the useful question is never
*"who broke the no-JavaScript rule?"* but *"what did we know when we decided to?"*

## When to write one

Write an ADR when a change:

- breaches one of the design principles in `AGENTS.md` §6, or
- sets a convention that future changes are expected to follow, or
- picks one approach over a reasonable alternative for a reason that isn't obvious from
  reading the result.

Don't write one for ordinary content or bug-fix work. Adding a game is not a decision.

## The rule for agents

An agent must not breach a principle on its own initiative. Raise it, offer the options,
and wait for an explicit decision. If the answer is yes, write the ADR as part of the
same change — not afterwards.

## Format

One file per decision, numbered in sequence: `0002-short-slug.md`, `0003-…`. Keep it to
one page. Never edit a decision once it is made — if it stops being true, write a new ADR
that supersedes it and add a line to the old one pointing forward.

```markdown
# NNNN. Title

- **Status:** accepted
- **Date:** YYYY-MM-DD
- **Principle breached:** which one, or "none"

## Context

What situation forced a decision. What was tried or ruled out.

## Decision

What was decided, stated plainly.

## Consequences

What this costs, what it enables, and what future changes now have to respect.
```
