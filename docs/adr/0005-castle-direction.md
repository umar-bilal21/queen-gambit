# 5. Adopt the client's castle direction as the design system

Date: 2026-08-25

## Status

Accepted. Supersedes the art direction implied by ADR 0002's palette choices and
by the typography decision recorded during the first build.

## Context

The homepage was designed from the client's first set of references —
thebendclub.com, springs.estate, hillbrookestate.co.nz, findrealestate.com — and
those references are light, editorial and restrained. The result was navy, cream
and light aqua, minimal ornament, motion used sparingly. It was a defensible
reading of the materials available.

The client then supplied a second set: their own mockups. Those are midnight
navy and gold. Heraldic numerals beneath crowns. Chess motifs. Ornamental rules
with tapering wings. Dramatic underwater grounds. Held next to them, the built
page reads as tasteful and generic — the word "Castle" appears three times in
the copy and nothing in the design believes it.

The Story section alone went through three rounds of correction, and the pattern
was the same each time: part of the existing direction was kept and the client's
reference grafted onto it, and the result read as neither one thing nor the
other. Offered the choice between a full re-skin, additions only, and a hybrid
that borrowed the motifs, the client chose the full re-skin — and the hybrid was
explicitly the option that had already failed three times.

## Decision

The mockups become the design system rather than a reference to be gestured at.

Midnight navy is the default ground. Gold carries ornament and rule work.
Ornament is real and reusable — a crowned numeral, a divider with a chess piece,
corner brackets — built as strokable components so each draws itself on, the
same technique as the Queen and the reef.

Cream survives with a narrowed job: it is the ground for the two writing
sections, where a reader wants paper rather than night. It is no longer an
alternate surface any section may reach for.

Light aqua survives in exactly one place — the colour the Story's words fade to
once read. It is doing a specific, requested job there and nothing else.

Surfaces re-point the semantic role tokens rather than each component choosing
colours, so a section cannot quietly invent its own palette.

## Consequences

Every existing section is re-skinned. Between the moment the tokens change and
the moment the last section's ticket lands, the page holds two languages and
looks worse than it did. That is expected and was flagged to the client.

Gold on navy is the site's most fragile contrast pairing. Ornament is decorative
and hidden from assistive technology, so it carries no contrast obligation, but
any gold used for *text* has to be checked rather than assumed.

Ornament as strokable components costs more to author than icons would, and the
crowned numerals in particular required drawing the digits as paths — a text
node cannot be stroked on. The payoff is that the twelfth ornament costs
nothing and every one of them moves like the rest of the site.

The earlier palette is not recoverable by flipping a token. Reverting would mean
reverting this direction wholesale, which is the correct granularity: the
decision is the direction, not the colours.
