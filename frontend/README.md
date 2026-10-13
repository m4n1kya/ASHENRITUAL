# ASHENRITUAL — Web Client

Next.js 15 (App Router) and React 19 frontend engineered for the ASHENRITUAL platform, featuring hardware-accelerated animations, Incremental Static Regeneration (ISR), and client-side computer vision.

## Key Capabilities

- **App Router & ISR** — Server-rendered dynamic routes (`/shop`, `/chapters`, `/showrooms`, `/sanctum`, `/forge`, `/beyond`) with instant skeleton loading transitions
- **VESPER Interface (`/vesper`)** — Real-time Server-Sent Events (SSE) token streaming with inline interactive garment recommendations and routing actions
- **Size Intelligence (`/vesper/size`)** — Client-side WebAssembly/GPU skeletal pose estimation powered by `@mediapipe/tasks-vision` (`PoseLandmarker`)
- **Motion & Aesthetics** — Engineered with Tailwind CSS v4, Framer Motion 12, GSAP 3, and Lenis smooth scroll physics

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```
