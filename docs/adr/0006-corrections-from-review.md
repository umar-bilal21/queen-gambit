# 6. What client review changed, and why it kept changing

Date: 2026-08-25

## Status

Accepted. Amends ADR 0005 in several particulars; the direction itself stands.

## Context

The castle direction was built as specified and then reviewed against the live
page at the client's own screen. A run of corrections followed, and the pattern
in them is worth recording, because it was not random.

**The page had been designed at 1440x900 and the client browses at roughly
2300x1180.** At that width the compositions did not fill the screen. The Story's
travelling window was around 400px of text centred in a 1180px viewport, and the
reef line work was capped at 20rem and pinned to the extreme edges — so the
section read as a screen of empty beige. The client reported this as "elements
not showing" and "section missing", and both descriptions were accurate: the
elements were there, and nobody could see them.

The pinned text drew the same complaint for a measurable reason. The manifesto
moved roughly 700px of copy across 1900px of scrolling, so a full wheel turn
barely shifted a line. "Feels stuck" was a precise description of a ratio.

Two further corrections reversed decisions taken in good faith:

The three Masterwork bands were turned into flip cards to save height. The
client rejected it. They were right — three cards in a row is a features grid,
and that copy is three consecutive thoughts rather than three options. What the
cards were solving was real; what they were solving it with was wrong.

Land tortoises were drawn for the manifesto on the client's instruction to use
"turtles, not sea turtles", and flagged at the time as a strange note. Seeing
them on the page the client asked for the Story's artwork back.

## Decision

**Compositions are checked at the width the client actually browses at**, not
the width they were designed at. Windows are taller, artwork is far larger and
drawn at near-full strength, and both pinned sections lost dead height so their
text keeps pace with the wheel.

**Height problems are solved inside the layout the client chose, not by
replacing it.** The Masterwork keeps its three full-width bands and they now
stack: each is sticky at the top of the viewport so the next climbs over the
last, three screens of content occupying one screen at a time. Each band carries
its own veil, because a stack only holds if every layer is opaque.

**The manifesto uses the same reef artwork as the Story.** Two different
creatures across two cream panels of an ocean-themed site read as an
inconsistency rather than a distinction.

**Dividers are removed from every section heading**, at the client's request.
The Intro keeps its one: it is not a heading but the closing beat of the arrival.

**The Gallery drifts on its own** at 44px/s, pauses under the pointer, and can be
dragged. It was previously scrubbed by vertical scroll, so it was still whenever
the visitor was. Every frame is the same size — a gallery of one building reads
better as an even contact sheet than as a composition.

**The site publishes itself** to GitHub Pages on every push to `main`, so the
link the client is sent is always current.

## Consequences

Fonts had to move out of `public/`. Files there are copied verbatim, so an
absolute `/fonts/...` path breaks the moment a site is served from a
subdirectory — which is what a GitHub Pages project site is. They are imported
and hashed now, and the base path is applied only in CI so local preview stays
at the root.

The stack means the Masterwork occupies three viewport heights of scroll while
showing one screen at a time. That is the effect working, not a cost, but it does
make the section's scroll length invisible in the markup.

The Gallery renders its photographs twice for a seamless loop. The duplicate
pass is hidden from assistive technology; anything added to that rail must be
added to both passes or the loop will jump.

Three reversals landed on the same section in a row — bands, cards, bands. Each
time the change optimised for something the client had not raised while altering
something they had. The rule that came out of it is the second decision above,
and it is the one most worth keeping.
