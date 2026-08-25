# 2. GSAP with ScrollTrigger, and Lenis for smooth scroll

Date: 2026-08-25

## Status

Accepted

## Context

Every section of this brief is a scroll-driven sequence: a word-by-word recolour
bound to scroll progress, a pinned five-row section swapping background photography,
a travelling gallery rail, a stroke-drawn vector queen. The client's own references
(thebendclub.com, hillbrookestate.co.nz, findrealestate.com, stoneinvestment.fr) all
additionally use inertial smooth scrolling, which accounts for much of why they read
as expensive.

The historical argument against GSAP was licensing: SplitText, DrawSVG and
ScrollSmoother were paid Club plugins. That is no longer true — gsap 3.15.0 on public
npm ships DrawSVGPlugin, MorphSVGPlugin, SplitText, ScrollTrigger, ScrollSmoother,
Flip and Observer under the standard no-charge license. Verified against the
published tarball, not from memory.

Alternatives considered. Motion (motion.dev) is roughly a quarter of the weight and
uses native ScrollTimeline where available, but has no pin-and-scrub facility as
mature as ScrollTrigger and no SplitText or DrawSVG equivalent, so the queen
stroke-draw and the per-word scrub become hand-rolled. Pure CSS scroll-driven
animation ships nothing at all, but Safari support remains the weak link and the
pinned sections and reveal-on-scroll behaviour exceed what it does cleanly — it would
have forced visible compromises against references the client has already seen.

For smooth scroll, GSAP's own ScrollSmoother was the obvious pairing (no
scrollerProxy wiring, built-in parallax), but it imposes a specific wrapper/content
DOM structure and is less widely used, so solutions are thinner when it misbehaves.

## Decision

GSAP 3.15 with ScrollTrigger, SplitText and DrawSVG, loaded as a single client-side
island so the rest of the page stays zero-JS. Lenis for smooth scrolling, bridged to
ScrollTrigger.

Lenis is disabled under reduced motion and on touch devices, where native momentum
scrolling is better and hijacking produces the worst jank.

## Consequences

Roughly 70KB gzipped of animation code — by some distance the heaviest dependency in
the project, and the largest single cost to Core Web Vitals.

Scroll orchestration is ours to own. ScrollTrigger and Lenis must be kept in sync,
and ScrollTrigger.refresh() must be called after images decode and on resize, or
trigger positions drift.

Any scroll hijack degrades browser find-in-page scrolling and can feel laggy on
low-end hardware. The touch and reduced-motion opt-outs limit but do not eliminate this.

Two motion systems now exist — scrubbed and reduced — and both need testing. A
scrubbed animation that has no sensible static end-state is a design error.
