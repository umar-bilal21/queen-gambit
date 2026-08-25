# Context: The Queen's Gambit Castle

Ubiquitous language for the homepage redesign. Glossary only — no implementation
detail, no specification. If a term here conflicts with wording in a brief, an
asset, or the code, the conflict is a bug in one of them.

## Naming

**The Queen's Gambit Castle** — the canonical name of the property and the brand,
used in all visitor-facing copy. Adopted from the client's redesign brief.

**Landmark** — a competing name for the same entity, present in the existing logo
wordmark ("The Queen's Gambit Landmark"), the live site title ("Ocean Inspired Art
Landmark | TQGL"), and the client's contact address
(thequeensgambitlandmark@gmail.com). *Deprecated in copy.* Its survival in brand
assets and the email address is a known, unresolved client branding item — see
[[adr-0004]].

**House** — appears only in the legacy domain (thequeensgambithouse.com). Not used
anywhere in copy or design. Historical.

**TQGL** — acronym on the live site, derived from "Landmark". Not used.

**Monogram** — the interlocking Q/O + G mark, with a fish/eye form inside the Q and
a crown on the G. Used alone, without any wordmark, to avoid surfacing "Landmark".

**Wordmark** — the typeset "The Queen's Gambit Landmark" lockup. Not used, because
it contradicts the canonical name.

## Page anatomy

**Intro** — the full-screen sequence that precedes the homepage: the Queen
silhouette draws in over deep navy, the line "A LIVING MASTERPIECE INSPIRED BY ART,
NATURE AND VISION" resolves, then the screen lifts to reveal the Hero. Called the
Intro, not a "loader" or "preloader", because it is a brand moment on a fixed
timeline and is not reporting real load progress. See [[adr-0003]].

**Queen silhouette** — the vector chess queen that is the Intro's subject. A
purpose-drawn outline, not the Monogram and not the client's ChatGPT reference image.

**Hero** — the first section of the homepage proper. One full-bleed oceanfront
photograph, the display line "Where the Ocean Meets Imagination", and attribution to
Frank J. Russo.

**Story** — the single cream-beige section carrying the Castle's opening passage
and the Reef artwork. Its upper edge is a straight line, never the wavy divider
from the earlier mockup.

**Passage** — the Story's text: two paragraphs, but one piece of writing. Both are
set identically and both recolour, so the effect runs unbroken from the first word
to the last. It is not a headline followed by body copy, and treating it as one was
a correction the client had to make twice.

An earlier draft split this in two — a white recolouring section and a separate
cream one for the artwork. That was wrong, and the client corrected it: one
section, one ground, both paragraphs.

**Reef** — the hand-drawn line work of turtles and kelp within the Story. Artwork,
not a section: it has no copy of its own and no landmark.

**Rooms** — the three-up row of interior frames, each labelled in caps *above* its
image: Living and Dining Beneath the Waves; The Door of Perception – Master Chamber;
The Queen's Command Center. Headed "Explore Every Corner".

**Beliefs** — the section titled OUR BELIEFS / "A VISION BUILT WITH PURPOSE",
comprising five Belief rows.

**Belief** — one row of the Beliefs section: a short caps title and a paragraph, with
a photograph that washes in behind the row when the row is Active. There are exactly
five, and they are ordered.

**Active** (of a Belief) — the state in which that Belief's photograph is shown.
Determined by scroll position — the row nearest the viewport centre — and overridden
by pointer hover where a fine pointer exists. At most one Belief is Active.

**Gallery** — the section presenting the property photography as a horizontally
travelling rail beneath a large display title.

**Enter** — the closing call-to-action: two photographs combined into one full-bleed
field, the title "Enter The Queen's Gambit", and the CONTACT US button.

**Footer** — cream, centred Monogram, address, contact, and a return-to-top control.

## Motion

**Scrub** — motion whose progress is bound to scroll position rather than to elapsed
time. The Story recolour and the Gallery rail are scrubbed.

**Reveal** — motion triggered once when an element enters the viewport, then left
alone. Most section entrances are Reveals.

**Reduced motion** — the state signalled by the visitor's `prefers-reduced-motion`
setting. In it, the Intro does not play, Scrubs become static end-states, and
smooth scrolling is off. Not an afterthought: it is a supported presentation.

## Property

**The property** — 4627 Van Kleeck Dr, New Smyrna Beach, Florida 32169. Note the
earlier mockup's "Westport, Connecticut" is erroneous.

**Frank J. Russo** — the creator, credited in the Hero as "Modern-Day Philosopher".
