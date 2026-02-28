# Specification

## Summary
**Goal:** Build NEXUS, a futuristic student portfolio single-page application with immersive 3D visuals, particle effects, and animated sections, backed by a Motoko canister serving portfolio data.

**Planned changes:**

### Backend (Motoko)
- Stable actor storing student data: name, tagline, bio, timeline milestones, skills, projects, achievements, and contact links
- Query functions to expose each data category as structured types for frontend consumption

### Frontend — Global
- Deep space futuristic visual theme: #050510 base, neon cyan (#00f5ff) and electric violet (#9d00ff) accents, neon magenta (#ff00c8) highlights, glassmorphism cards, neon glow box-shadows, monospace/geometric font pairing
- Global context-aware custom cursor replacing system cursor: morphs between default, orb (hero), scanning beam (projects), and magnetic (near buttons) states; fading particle trail in hero section
- Global scroll magic: Intersection Observer–triggered section entrance animations, three-layer parallax (0.2x / 0.5x / 1x), blur-to-sharp fade-in for content, count-up animation for numeric stats
- Floating accessibility settings button with reduced-motion toggle (pauses particles/3D rotations, replaces complex animations with fades; respects OS prefers-reduced-motion) and high-contrast toggle (black/white/yellow palette, removes glassmorphism blur); both settings persisted in localStorage

### Frontend — Sections
- **Preloader "The Awakening"**: Canvas/WebGL particle system assembling into a human silhouette, mouse-reactive particles, time-of-day greeting, smooth fade-out reveal
- **Hero "Reality Shift"**: Three.js infinite perspective grid, floating 3D mathematical formula labels, glassmorphism name card with fragment/reassemble hover animation, cursor-position-driven gradient text, magnetic CTA buttons, three parallax depth layers
- **About/Timeline "Consciousness Stream"**: Horizontally-scrolling timeline driven by vertical scroll (Lenis smooth scroll), 3D flip cards (date/title front, achievement detail back), background hue transition (dark → light → neon), character-by-character text type-in with glitch effect on keywords
- **Skills "Digital Nexus"**: Three.js 3D rotating/draggable sphere lattice of interconnected skill nodes, hover highlights connections with animated lines, floating skill badge labels with glow effect, animated code-character particle background
- **Projects "The Lab"**: 3D perspective project card grid with scroll-driven tilt and inertia, holographic wireframe hover overlay, card-expand morph transition to full project detail view, background color shift based on centered card, scanning beam cursor style over cards
- **AI Sandbox**: Simulated AI chat panel with pre-scripted responses about the student; voice button triggering waveform animation and delayed text response (no real speech recognition or external API); growth prediction slider with animated 3D bar/line chart (past/present/future); floating AI art gallery frames with idle animation and physics-based hover rearrangement
- **Achievements "Global Impact"**: Three.js Earth globe with dark/neon texture, glowing data pillars at 5+ hardcoded coordinates (height = impact magnitude), scroll-triggered camera zoom on section entry, glassmorphism tooltip on pillar hover/click with count-up stats
- **Contact "The Connection"**: Three.js scene with email, LinkedIn, GitHub icon objects orbiting a glowing core; click to trigger mailto/URL; contact form assembles from particles on cursor approach; magnetic submit button with particle burst success animation

**User-visible outcome:** Visitors experience a fully animated, futuristic single-page portfolio showcasing the student's timeline, skills, projects, achievements, and contact options — all rendered with 3D effects, particle systems, and interactive animations, with data served dynamically from the Motoko backend.
