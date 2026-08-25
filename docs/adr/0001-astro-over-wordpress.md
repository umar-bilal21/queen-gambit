# 1. Build the redesign in Astro, not in the existing WordPress site

Date: 2026-08-25

## Status

Accepted

## Context

thequeensgambithouse.com runs WordPress 7.0.4 with WooCommerce 10.3.8 on the Beaver
Builder theme (`bb-theme`, `bb-plugin`, `bbpowerpack`, `bb-ultimate-addon`) plus a
mega-menu plugin. The brief asked to "make it on astra", which read ambiguously as
either Astro the static site framework or Astra the WordPress theme — a plausible
reading, since switching a Beaver Builder site to Astra is a common WordPress
redesign path and would have preserved WooCommerce, the CMS, and every existing URL.

The homepage the client wants is almost entirely custom motion: a full-screen
animated intro, a scroll-scrubbed per-word colour transition, a pinned five-row
section with photographic reveals, and a travelling gallery rail. None of that is
page-builder work. Delivering it inside WordPress would mean an Astra child theme
with a hand-coded front-page template, at which point the CMS contributes markup
constraints and plugin CSS to fight, but very little authoring benefit — the client
would not be editing a GSAP timeline in the WordPress admin.

## Decision

Build a standalone Astro site, scoped to the homepage only. The deliverable is a
deployable static page whose purpose is to win client approval on direction.

It explicitly does not replace the WordPress site. WooCommerce, the existing pages,
and the current URLs are untouched, and this build has no CMS.

## Consequences

Full control of markup and near-zero shipped JavaScript outside the animation
island; GSAP behaves exactly as authored, with no theme or builder CSS to defeat.

The integration question is deferred, not answered. If the client approves, someone
must still decide between porting this homepage into WordPress, migrating the whole
site to Astro, or running Astro in front of WordPress — and the third option needs a
content strategy for WooCommerce that nobody has written.

Navigation links to sections on this page only. There are no inner pages, so the
pitch cannot demonstrate site-wide navigation.

Content is hard-coded. Any copy change is a code change until a CMS decision is made.
