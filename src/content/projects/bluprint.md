---
title: "Bluprint"
summary: "My attempt at Ralph Loop + Spec Driven Development Hybrid"
sortOrder: 2
repoUrl: "https://github.com/BeckWangthumboon/bluprint"
---

## Project Intro

Bluprint is an experiment with an autonomous agent loop that runs over a project based on a specification. It was inspired by the Ralph Loop where agents could run for long periods of time, but the results were often broken or had unintended side effects. To address this, I decided to bring in the idea of Spec Driven Development, which focuses on defining constraints and expectations upfront. The goal was to combine the benefits of both -- allow agents to make significant progress on a project while producing code that was aligned with what the builder wanted.

## How It Works

Bluprint works by taking in a project specification and turning it into a list of steps. Once the plan is created, the system enters a loop where it repeatedly attempts to complete each step until done.

During each step, there are 2 main agents. A coding agent is responsible for writing and modifying code. After it makes the change, a master agent reviews the result against the spec. If the work is correct, the loop moves to the next step and the work is committed. If not, the master agent provides feedback to the coding agent, and the coding agent tries again.

This process continues over and over, gradually completing the task. Bluprint also keeps track of progress so that runs can be cancelled and resumed later. The idea was to let agents work in the background and make improvements while having some level of review and constraints built in.

### Resetting the context every loop

One of the problems with long running agents is drift. If an agent made a bad assumption early on, they would build on top of these mistakes and move the project away from the original intent. At the same time, agents get worse as the context window fills up (context rot).

To reduce this, I made each iteration stateless. Instead of passing the full execution history between each iteration, each step started from the original specification with some amount of feedback from the previous. This forced the agent to bring itself back to the spec file rather than relying on its context. While this didn't eliminate hallucinations and bad code, it massively reduced intent drift.

### Making Runs Resumable

Because Bluprint was designed to run for long stretches, often 30+ minutes, I ran into some issues. One of the problems I frequently ran into was Bluprint failing mid-run due to hitting token limits or my laptop going to sleep. Losing each run was frustrating because it was hard to reset and each run could consume a lot of time and tokens.

That's why I decided to add resumability, so that the system could continue from its last completed step rather than restarting entirely. This allowed me to do "overnight runs" before sleeping and know I wouldn't wake up to nothing.

### Committing After Each Step

After using Bluprint on real projects, I started to experience review fatigue. A single run could make a large number of changes, and trying to understand everything at once was difficult and time consuming.

To solve this, I introduced commits after each approved step. This allowed me to review each change in smaller chunks instead of one large batch. However, this introduced a new issue: when I wanted to modify earlier commits, it became tedious to manually propagate those changes through to the later commits. To improve this workflow, I integrated Graphite so that I could manage stacked diffs and rebase follow-up changes more easily.

## Implementation

Bluprint works as a TypeScript CLI tool that runs locally in your codebase and orchestrates the agent loop. All execution state is stored locally so that it can be used without relying on a hosted backend.

Under the hood, Bluprint uses the Opencode agent. I chose Opencode over agents tied to providers (like Codex, Claude Code, etc) so that I could easily configure and experiment with different models.

For a full list of features and implementation details, see the [README](https://github.com/BeckWangthumboon/bluprint/blob/main/README.md).

## Where Bluprint Fell Short

### 1. Spec Limitations

In practice, long spec-driven runs were more brittle than I expected. It was impossible to anticipate every scenario upfront, and when agents encountered situations that weren't covered, they sometimes made bad assumptions that would compound over time.

### 2. Review Fatigue

I also started to experience review fatigue even with incremental commits. Because these runs were asynchronous, I would often come back to them without the full context of what happened and why decisions were made. Without being able to interact with the agents, I had to decipher their reasoning through the code they had written, which was frustrating and time consuming.

### 3. Better Models

As newer models became more capable, I found myself relying less on tight specifications and instead driving them with intent. I started explaining what I wanted and letting them make the lower level decisions during development. With models like Codex 5.3, I became more comfortable allowing autonomous changes and reviewing them afterwards to understand why they made those decisions.

I also noticed that as models improved, simply letting them run through CLIs like Codex or Claude Code produced similar results to a full loop. The orchestration felt unnecessary since the models could produce the same work with fewer tokens.

Over time I also added better typechecking, linting, and other tools to make it easier for agents to detect and correct their mistakes. This allowed the agents to fix their own mistakes instead of relying on an orchestration layer to do it.

### How I Work With Agents Now

Today, I usually start with a rough intent or plan and review the patterns or architecture the agents suggest. I review decisions conversationally to make any changes if needed, and let the agents implement. While I do let agents run for long periods of time, I often run other agents simultaneously on different scopes of the project, which keeps the project context fresh in my head.

My review style has also changed. Instead of going line by line, I focus on understanding the overall flow, architectural patterns, and whether the code aligns with what I intended. I generally trust the agent with things like helper functions or boilerplate.

One tradeoff with this workflow is that I spend more time refactoring or cleaning up code, because I don't define the files and functions upfront. However, this is much faster than writing by hand or with fully autonomous loops like Bluprint. I've also noticed that agents tend to follow patterns already established in the codebase, so when I invest time in setting clear structure and conventions early, the amount of later cleanup drops significantly.

Bluprint was my time at the top of the [Curve of Agentic Programming](https://steipete.me/posts/just-talk-to-it). It pushed me to explore how far orchestration and loops could go, but ultimately rethink on how I wanted to work with coding agents. My current workflow is just one step in that evolution, and I'm curious to see what I'll use as the models improve.
