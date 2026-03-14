# Knowledge Base Graph Explorer

## Project Overview
A high-performance, interactive graph visualization application built with Next.js, React Flow, and Framer Motion. This tool transforms flat CSV seed data into an interconnected, manipulable web of knowledge. It is designed as a client-side single-page application (SPA) with full CRUD capabilities and persistent state management.

## Design System and User Experience
The application strictly adheres to a premium, iOS-inspired design language to ensure a high-fidelity user experience:
* **Glassmorphism and Translucency:** Utilizes deep background blurs (`backdrop-blur-3xl`) and translucent overlays to create depth without relying on heavy drop shadows.
* **Typography and Layout:** Built on the `-apple-system` font stack (San Francisco) with "Grouped Inset" form layouts native to modern Apple environments.
* **Fluid Motion:** Integrates Framer Motion for GPU-accelerated node entries, smooth sidebar transitions, and interactive scaling physics.
* **Focus Engine:** Implements a mathematical neighborhood-discovery algorithm. Clicking a node automatically dims unrelated entities (opacity routing), providing immediate cognitive focus on the active relationship tree.

## Technical Architecture
The codebase follows a decoupled logic pattern, strictly separating the rendering engine from the data management layer.

### System Data Flow

```mermaid
graph TD
    A[Raw CSV Seed Data] -->|PapaParse| B(useGraphState Hook)
    B -->|Initial Mount| C{LocalStorage}
    C -->|Stored Data Exists| D[Hydrate Active State]
    C -->|Empty Storage| E[Parse Seed State]
    
    D --> F[GraphCanvas Component]
    E --> F
    
    F -->|Render| G[React Flow Engine]
    
    G -->|Node Rendering| H[Custom Node and Edge UI]
    G -->|Selection Event| I[Controlled Sidebar Form]
    
    I -->|CRUD Operations| B
    B -->|Silent Sync| C
