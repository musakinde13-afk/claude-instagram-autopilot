---
name: remotion-animation
description: How to animate scenes in this repo's Remotion reel (remotion/src/Reel.tsx) with GSAP, port React Bits effects, and when Lenis applies. Use when adding or changing a scene, animation, transition or text effect in the reel, or when someone mentions GSAP, React Bits or Lenis here.
---

# Animating the Remotion reel

Remotion renders each frame on its own, out of order, in parallel browser tabs. Anything that animates on a clock (CSS transitions/keyframes, `requestAnimationFrame`, Framer Motion, a playing GSAP tween) flickers or freezes in the final MP4. Every animation must be a pure function of `useCurrentFrame()`.

## GSAP: always through `useGsap`

`remotion/src/Reel.tsx` has `useGsap(build, exit = true)`. It builds a **paused** timeline once and seeks it to `frame / fps` on every frame. Use it; never call `tl.play()`, `gsap.to()` outside it, or GSAP's ticker.

```tsx
const MyScene: React.FC<{ s: Slide; handle: string }> = ({ s, handle }) => {
  const ref = useGsap((tl) => tl
    .from(".title", { opacity: 0, y: 50, duration: 0.5, ease: "power3.out" }, 0.1) // position = seconds into the slide
    .from(".blur-word", blurIn, 0.4));
  return <Chrome ref={ref} handle={handle}><div className="title">…</div></Chrome>;
};
```

Rules:
- Target elements by `className`; selectors are scoped to the scene, so classes can repeat across scenes.
- Pass the ref to `Chrome`, never to `AbsoluteFill`: Remotion's `AbsoluteFill` does not forward refs, so GSAP gets a null scope, finds nothing and the scene renders in its end state with only console warnings.
- Keep every tween inside `SLIDE_SECS` (3.4s). `exit` adds a blur-out at `SLIDE_SECS - 0.3`; pass `false` on the last slide.
- `repeat`/`yoyo` are fine (still deterministic); `repeat: -1` is not, give a finite count.
- No randomness unless seeded (use Remotion's `random(seed)`).
- Animate transforms, opacity and `filter`; avoid layout properties (width, top) that reflow text.

## Porting a React Bits effect (reactbits.dev)

React Bits components are copy-paste snippets that animate on a clock, so never paste one in as is. Port the idea:
1. Keep its markup split (per char, per word, per line) as plain spans with a class. See `SplitText` and `BlurText` in `Reel.tsx`.
2. Translate its animation (from-values, stagger, easing, duration) into a `tl.from(...)` in the scene's `useGsap`.
3. Drop its hooks: `useInView`, `IntersectionObserver`, `useEffect` timers, `motion.*` components.
4. Render a still mid-animation to check it (see below).

Already ported: **SplitText** (letters rise in, hook scene) and **BlurText** (words sharpen from blur, `blurIn` preset).

## Lenis

Lenis is smooth scrolling for websites. A video has no scroll, so it never belongs in `remotion/`. Use it only for a web page (landing page, link-in-bio), with React Bits components running normally there.

## Verify before committing

```bash
cd remotion && npx tsc -p .
npx remotion still src/index.tsx Reel out/f.png --frame=8 --scale=0.3
```
Check a frame mid-animation (e.g. 8) and one near a slide's end (e.g. 98 at 30fps). If both look like the finished state, the timeline isn't reaching the elements (usually the ref). In this cloud container add `--browser-executable=/opt/pw-browsers/chromium`.
