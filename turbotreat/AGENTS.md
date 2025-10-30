# Agent Guidelines

## Project Context
Halloween hackathon project using TypeScript, Vite, React, Prisma, Postgres, and React Router.

## Core Principles

### Surgical Changes Only
- Make minimal, targeted changes to address the specific request
- Do not refactor working code unless explicitly asked
- Do not "improve" code style, naming, or structure outside the change scope
- If you see something concerning, mention it but don't fix it unless asked

### Simplicity Over Cleverness
- Prefer obvious solutions over elegant ones
- Use straightforward patterns—no premature abstractions
- Copy-paste is fine for hackathon pace; DRY when it hurts
- Avoid adding dependencies unless clearly beneficial

### Speed Matters
- This is a hackathon: working > perfect
- Skip boilerplate comments and extensive error handling unless critical
- Favor inline implementations over creating new files/utilities
- Get to "it works" first, polish later if time permits

## Technical Guidelines

### TypeScript
- Use explicit types for function signatures and exported values
- `any` is acceptable in hackathon context when types are unclear
- Don't fight the type system—assertion is fine when needed

### React
- Functional components with hooks
- Co-locate state with usage—lift only when necessary
- Client-side fetching is fine; don't prematurely optimize with loaders

### Prisma
- Keep schema simple and flat
- Use raw SQL if Prisma is fighting you
- Migrations can be manual (`prisma db push` is your friend)

### React Router
- Use loader functions for data that blocks rendering
- Don't over-architect routing—flat is fine
- Action functions for mutations

### Database
- Indexes only if performance becomes an issue
- Nullable fields are easier than complex relations
- JSON columns are valid for hackathon flexibility

## Change Process

1. **Understand the request**: What specific thing needs to change?
2. **Locate the change**: Which file(s) must be modified?
3. **Minimal edit**: Change only what's necessary
4. **Test consideration**: Mention if manual testing is needed
5. **Move on**: Don't gold-plate

## Red Flags to Avoid
- Creating new abstraction layers
- Renaming things for consistency
- Restructuring file organization
- Adding comprehensive error handling
- Writing extensive tests
- Premature performance optimization

## When to Push Back
- If a change would require major refactoring, suggest a hacky alternative first
- If unclear requirements, ask one clarifying question max, then make a reasonable assumption

## Gotchas to Watch

### Prisma
- Schema changes require migration/push before working
- Relations can be tricky—foreign keys are your friend
- DateTime handling varies between Prisma and JS

### React Router
- Loader data isn't reactive—you may need manual revalidation
- Navigation state can get out of sync with server state

### TypeScript
- Prisma types can conflict with your frontend types
- Router types require good inference setup

Remember: **Ship it, then improve it.** Perfect is the enemy of done.
