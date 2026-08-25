import { createContext, initSections, settle, watchResize } from './index';
import { initAnchors } from './anchors';

/**
 * Island entry point.
 *
 * Section modules are imported for their side effect — each registers itself
 * with the island — and then everything starts in one place, in this order.
 */

import './sections/intro';
import './sections/reveal';
import './sections/ornament';
import './sections/header';
import './sections/menu';
import './sections/hero';
import './sections/story';
import './sections/beliefs';
import './sections/gallery';

const context = createContext();

/*
 * Anchors first. If a later section throws during setup, navigation still
 * works, which is the difference between a degraded page and a stuck one.
 */
initAnchors(context.scroller);

initSections(context);
watchResize();

/*
 * Re-measuring waits on the photography; nothing else does. The Intro's
 * timeline in particular must start now rather than after the last lazy image
 * three sections down has arrived.
 */
void settle();
