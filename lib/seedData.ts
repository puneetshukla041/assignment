// src/lib/seedData.ts

export const nodesCsv = `id,title,note
1,React,"A JavaScript library for building user interfaces using components."
2,Next.js,"React framework with SSR, routing, and API support built in."
3,TypeScript,"Typed superset of JavaScript that compiles to plain JS."
4,State Management,"Patterns for managing shared application state (Context, Zustand, Redux)."
5,Component Design,"Principles for building reusable, composable UI components."
6,Performance,"Techniques like memoization, lazy loading, and virtualization."
7,Testing,"Unit, integration, and e2e testing strategies for frontend apps."
8,CSS & Styling,"Styling approaches including Tailwind, CSS Modules, and styled-components."`;

export const edgesCsv = `source,target,label
2,1,built on
1,3,pairs well with
1,4,uses
1,5,guides
2,6,improves
1,7,requires
1,8,styled with
4,6,impacts
5,6,impacts`;