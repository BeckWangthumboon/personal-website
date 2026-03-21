---
title: "SaaS Template"
summary: "An opinionated SaaS starter template with core app features like auth, billing, so you can launch faster."
sortOrder: 1
repoUrl: "https://github.com/BeckWangthumboon/saas-template"
coverImage: "https://assets.beckw.dev/projects/saas-template.png"
---

## Project Intro

This project is an opinionated starter template for building SaaS quickly.
After rebuilding auth and other stuff over and over for different projects last year, I decided to make a template so I wouldn't have to build from scratch again. This project serves as a starting point for b2b SaaS or reference code for good patterns with Convex, etc.

## System Design

### Tech Stack
I mostly chose tools with strong DX so I could move quickly.

- React with Tanstack Router
- TailwindUI/Shadcn
- Convex backend (see why I picked it over Supabase below)
- WorkOS for auth
- Polar billing (and merchant of record)
- R2 for File Storage
- Resend: to send emails via api. 

### Features
- Auth + Billing
- Organization/Workspace Model, including invites, user management
- Entitlement layer with CRUD example
- File uploads, light/dark mode, other quality of life features.

## Design Decisions

### Background Jobs for External Deletes

When deleting file or users from my db, I also need to sync with external systems like WorkOS or R2. Originally, this happened in the delete request from the user which made it slower and less reliable since we could only retry within the request.

Instead, I deleted/tombstoned the object reference immediately, and ran a mutation to schedule a delete in Convex's workpool. This does 2 things: first, it frees up the backend to handle other user requests, and moves the slow (and less deterministic) parts to be done separately. Second: I can use a cron job to clean up any failed "sync requests" so no orphan objects exist. 

### Autumn

I wanted to build usage based billing into my project so I tried to integrate Autumn. In practice this made simple user actions harder to implement, since billing checks had to be woven around mutations and actions (mutations can’t make network requests).

Also, the billing state of Autumn lives in Autumn instead of our own DB. For just entitlement checks, it added a lot more complexity. 

I'm sure there are some patterns out there that could make the Autumn integration much easier, but since usage based billing wasn't a core requirement, I switched to Polar instead. Polar allowed me to own the entitlement layer, but also acts as a merchant of record, which made the billing flow easier.
 
### Convex vs Supabase/Postgres/SQL DBs
 
I could write a whole article about this but I'll keep it short. Convex has type safety, deterministic behavior, and solves a lot of problems we'd have to  glue together on the backend (like background jobs and crons). It also enforces good constraints on its API, making it easy to work with coding agents.

That being said, Convex does have its downsides. It struggles at highly relational data (no real join equivalent). And there's a real lock in risk compared to a traditional SQL DB.
 
Overall, for this template, the goal was to allow users to ship fast. And for most use cases, Convex works. 

## Key Takeaways and Reflection

Building this made me learn much more about syncing with external services and how to handle state changes between services. A lot of the design work ended up being about deciding where responsibility should live. For example, my user table was the source of truth for my user data, while workOS was only used for authentication. 

Another thing that was a key lesson for me was to not overbuild or get caught up in trends. I saw Autumn raising their round on Twitter so I tried integrating it even though I didn't need it at all. The right thing to do here was to think deeply about what my problems are and how to solve them instead of chasing hype. 

Overall, I'm happy with my template and will be using it to ship fast in 2026.
