# Agent Guidelines

## Project Context
Halloween hackathon project using TypeScript, Vite, React, Prisma, Postgres, and React Router.

## Core Principles

### Surgical Changes Only

- Make minimal, targeted changes to address the specific request
- Do not refactor working code unless explicitly asked
- Follow existing structure, style, and refer to the questions.xml file for the questions and answers if refactoring. ALWAYS use the exact questions in the questions.xml file.
- If you see something concerning, mention it but don't fix it unless asked

### Simplicity Over Cleverness

- Prefer obvious solutions over elegant ones
- Use straightforward patterns—no premature abstractions
- Copy-paste is fine for hackathon pace; DRY when it hurts
- Avoid adding dependencies unless clearly beneficial

### Cleanliness Matters

- Please remove unused dependencies

## Technical Guidelines

### TypeScript

- Use explicit types for function signatures and exported values
- Use null for optional values
- Use boolean for binary values

### React

- Functional, modular components with hooks
- Keep options in line with the Select component
- Co-locate state with usage—lift only when necessary
- Client-side fetching is fine; don't prematurely optimize with loaders


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
- Writing extensive tests
- Premature performance optimization

## When to Push Back

- If a change would require major refactoring, explain in steps
what needs to be done to make it work.
- If unclear requirements, ask one clarifying question max, then make a reasonable assumption

Remember: The code should be written correctly, with elegant types, simplicity in mind.
