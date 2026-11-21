import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";

// ---- brand tokens (change these to re-theme every reel) ----
const CORAL = "#E08A66", GOLD = "#CBA968", INK = "#F2EADB", INK2 = "#B9AF9E", BG = "#0d0b10";
const SANS = "Inter, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

type Slide = {
  kind: "hook" | "tool" | "cta";
  n?: number; tag?: string; headline?: string; emphasis?: string; body?: string; important?: boolean;
};
export type ReelProps = { slides: Slide[]; handle?: string };
export const SLIDE_SECS = 3.4;

// GSAP, frame-synced: the timeline is built paused and seeked to the current frame,
// so every render (and every parallel render tab) produces identical frames.
// `exit` appends a blur-out of the whole scene just before the slide ends.
const useGsap = (build: (tl: gsap.core.Timeline) => void, exit = true) => {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      build(t);
      if (exit) t.to(ref.current, { opacity: 0, y: -40, filter: "blur(12px)", duration: 0.3, ease: "power2.in" }, SLIDE_SECS - 0.3);
      tl.current = t;
    }, ref);
    return () => ctx.revert();
  }, []);
  useLayoutEffect(() => { tl.current?.seek(frame / fps, false); }, [frame, fps]);
  return ref;
};

// React Bits "SplitText" idea: one span per character (kept inside word spans so lines wrap by word).
const SplitText: React.FC<{ text: string }> = ({ text }) => <>
  {text.split(" ").map((w, i) => <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
    {[...w].map((c, j) => <span key={j} className="char" style={{ display: "inline-block" }}>{c}</span>)}
  </span>)}
</>;

// React Bits "BlurText" idea: one span per word, animated from blurred to sharp.
const BlurText: React.FC<{ text: string }> = ({ text }) => <>
  {text.split(" ").map((w, i) => <span key={i} className="blur-word" style={{ display: "inline-block", marginRight: "0.28em" }}>{w}</span>)}
</>;
const blurIn = { opacity: 0, y: -18, filter: "blur(10px)", stagger: 0.07, duration: 0.45, ease: "power3.out" };

const Chrome = React.forwardRef<HTMLDivElement, { handle: string; children: React.ReactNode }>(({ handle, children }, ref) => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 30%, #17130f 0%, ${BG} 60%, #08070a 100%)`, fontFamily: SANS, overflow: "hidden" }}>
    {/* AbsoluteFill doesn't forward refs, so GSAP scopes to this plain div */}
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
    {children}
    <div style={{ position: "absolute", bottom: 90, left: 96, color: "#8a8594", fontFamily: MONO, fontSize: 30, letterSpacing: 3, textTransform: "uppercase" }}>✳ {handle}</div>
    </div>
  </AbsoluteFill>
));

const HookScene: React.FC<{ s: Slide; handle: string }> = ({ s, handle }) => {
  const ref = useGsap((tl) => tl
    .from(".tag", { opacity: 0, letterSpacing: 24, duration: 0.6, ease: "power3.out" }, 0)
    .from(".char", { opacity: 0, yPercent: 110, rotate: 8, stagger: 0.022, duration: 0.5, ease: "back.out(1.8)" }, 0.12));
  return (<Chrome ref={ref} handle={handle}>
    {s.tag ? <div className="tag" style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", color: CORAL, fontFamily: MONO, fontWeight: 700, letterSpacing: 4, fontSize: 28 }}>{s.tag}</div> : null}
    <div style={{ position: "absolute", top: 700, left: 60, right: 60, textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", fontWeight: 900, fontSize: 92, color: "#fff", letterSpacing: -2, lineHeight: 1.05, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
      <SplitText text={s.headline || s.emphasis || "Your hook here"} />
    </div>
  </Chrome>);
};

const ToolScene: React.FC<{ s: Slide; handle: string }> = ({ s, handle }) => {
  const A = s.important ? GOLD : CORAL;
  const ref = useGsap((tl) => {
    tl.from(".card", { opacity: 0, y: 60, scale: 0.9, duration: 0.55, ease: "back.out(1.6)" }, 0.1)
      .from(".num", { scale: 0, rotate: -90, duration: 0.5, ease: "back.out(2.2)" }, 0.3)
      .from(".blur-word", blurIn, 0.45);
    if (s.important) tl.from(".badge", { opacity: 0, y: 20, scale: 0.6, duration: 0.4, ease: "back.out(2)" }, 0);
  });
  return (<Chrome ref={ref} handle={handle}>
    <div style={{ position: "absolute", top: 620, left: 110, right: 110 }}>
      {s.important ? <div className="badge" style={{ textAlign: "center", marginBottom: 24 }}><span style={{ background: GOLD, color: "#1a1206", fontWeight: 900, fontSize: 30, padding: "10px 24px", borderRadius: 999 }}>★ MOST IMPORTANT</span></div> : null}
      <div className="card" style={{ background: "#0f0d14", border: `1px solid ${A}66`, borderRadius: 28, padding: "40px 44px", boxShadow: `0 0 44px ${A}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div className="num" style={{ width: 84, height: 84, borderRadius: 20, background: `${A}22`, border: `2px solid ${A}`, color: A, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{s.n ?? 1}</div>
          <div style={{ color: INK, fontWeight: 800, fontSize: 48, lineHeight: 1.1 }}><BlurText text={s.headline || ""} />{s.emphasis ? <span style={{ color: A }}><BlurText text={s.emphasis} /></span> : null}</div>
        </div>
        {s.body ? <div style={{ color: INK2, fontSize: 32, marginTop: 24, lineHeight: 1.3 }}><BlurText text={s.body} /></div> : null}
      </div>
    </div>
  </Chrome>);
};

const CtaScene: React.FC<{ s: Slide; handle: string }> = ({ s, handle }) => {
  const kw = (s.emphasis || "AUTOMATE").toUpperCase();
  const ref = useGsap((tl) => tl
    .from(".title", { opacity: 0, y: 50, duration: 0.5, ease: "power3.out" }, 0.1)
    .from(".blur-word", blurIn, 0.4)
    .from(".pill", { opacity: 0, scale: 0.7, duration: 0.5, ease: "back.out(2)" }, 0.8)
    .to(".post", { scale: 1.12, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, 1.4), false);
  return (<Chrome ref={ref} handle={handle}>
    <div style={{ position: "absolute", top: 760, left: 60, right: 60, textAlign: "center" }}>
      <div className="title" style={{ fontWeight: 900, fontSize: 76, color: INK }}>Comment <span style={{ color: CORAL }}>"{kw}"</span></div>
      <div style={{ color: INK2, fontSize: 36, marginTop: 16 }}><BlurText text={s.body || "and I'll DM you the setup"} /></div>
      <div className="pill" style={{ marginTop: 50, display: "inline-flex", alignItems: "center", gap: 16, background: "#151118", border: `2px solid ${CORAL}`, borderRadius: 999, padding: "20px 30px" }}>
        <span style={{ color: INK, fontWeight: 700, fontSize: 38 }}>{kw}</span>
        <span className="post" style={{ display: "inline-block", background: CORAL, color: "#fff", fontWeight: 800, fontSize: 30, padding: "12px 28px", borderRadius: 999 }}>Post</span>
      </div>
    </div>
  </Chrome>);
};

export const Reel: React.FC<ReelProps> = ({ slides = [], handle = "@yourbusiness" }) => {
  const { fps } = useVideoConfig();
  const per = Math.round(SLIDE_SECS * fps);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Series>
        {slides.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={per}>
            {s.kind === "hook" ? <HookScene s={s} handle={handle} />
              : s.kind === "cta" ? <CtaScene s={s} handle={handle} />
                : <ToolScene s={s} handle={handle} />}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
