# 3. The Intro is a fixed timeline, not a preloader

Date: 2026-08-25

## Status

Accepted

## Context

The client asked for a loading screen before the homepage: the Queen silhouette
resolving, then the line "A LIVING MASTERPIECE INSPIRED BY ART, NATURE AND VISION".
That choreography needs roughly three and a half seconds to read as deliberate rather
than rushed, and the copy alone takes about two seconds to read.

A static Astro page with a preloaded hero image is genuinely interactive in well under
a second. So the honest amount of loading to report is approximately none. Building a
real progress indicator would mean either showing a bar that jumps from nothing to
complete in 400ms — destroying the brand moment the client is paying for — or showing
a fabricated percentage, which is a lie told to the visitor in the first frame of the
brand experience.

A hybrid was considered: play the full timeline but also wait for hero assets,
whichever finishes later. It is the more defensive choice, but adds state to manage
and can silently exceed four seconds on a poor connection with nothing explaining why.

## Decision

The Intro is a fixed GSAP timeline of approximately 3.5 seconds. It is art direction,
not instrumentation. Hero image preloading is awaited in parallel so the handoff is
never a blank frame, but the timeline's duration does not depend on it.

There is no progress bar and no percentage counter.

It plays on every page load, because this is a single-route pitch that the client and
their stakeholders will open repeatedly, and an intro that silently stops appearing
after the first view reads as a bug and invites "the loader is broken" feedback.

It is skippable by click, scroll or Escape, which fast-forwards the timeline. Under
reduced motion it does not play at all; the page opens directly on the Hero.

## Consequences

Every visitor waits about 3.5 seconds for content that was already available. This is
a deliberate trade of measured performance for perceived quality, and it will show up
as poor Time to Interactive in any automated audit. That is expected, not a defect.

The replay-every-load policy is correct for a pitch and hostile in production. It must
be revisited before any real launch — probably to once per session — and that revisit
is a decision, not a cleanup task.

The skip affordance must be genuinely discoverable, or the policy becomes the "no
skip" option by accident.
