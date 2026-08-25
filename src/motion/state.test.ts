import { describe, expect, it } from 'vitest';

import {
  activeBeliefIndex,
  createIntroState,
  introReducer,
  type IntroEvent,
  type IntroState,
} from './state';

/**
 * These are the two behaviours in the project with real edge cases, pulled out
 * of the animation callbacks so they can be proved without a browser.
 *
 * They assert what a caller can depend on — which row is Active, what state the
 * Intro is in — and never how the animation achieves it.
 */

describe('activeBeliefIndex', () => {
  const COUNT = 5;

  it('is the first Belief at the start of the range', () => {
    expect(activeBeliefIndex(0, COUNT, null)).toBe(0);
  });

  it('is the last Belief at the end of the range', () => {
    expect(activeBeliefIndex(1, COUNT, null)).toBe(COUNT - 1);
  });

  it('walks through every Belief across the range', () => {
    const seen = new Set<number>();
    for (let step = 0; step <= 100; step += 1) {
      seen.add(activeBeliefIndex(step / 100, COUNT, null));
    }
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('advances at each boundary between rows and not before', () => {
    // Five rows divide the range into fifths. Just under a boundary is still
    // the previous row; at the boundary it is the next one.
    expect(activeBeliefIndex(0.1999, COUNT, null)).toBe(0);
    expect(activeBeliefIndex(0.2, COUNT, null)).toBe(1);
    expect(activeBeliefIndex(0.3999, COUNT, null)).toBe(1);
    expect(activeBeliefIndex(0.4, COUNT, null)).toBe(2);
  });

  it('clamps progress below the range', () => {
    expect(activeBeliefIndex(-0.5, COUNT, null)).toBe(0);
    expect(activeBeliefIndex(-1000, COUNT, null)).toBe(0);
  });

  it('clamps progress above the range', () => {
    expect(activeBeliefIndex(1.5, COUNT, null)).toBe(COUNT - 1);
    expect(activeBeliefIndex(1000, COUNT, null)).toBe(COUNT - 1);
  });

  it('lets hover win outright over scroll position', () => {
    // Scroll says the last row; the pointer is on the first.
    expect(activeBeliefIndex(1, COUNT, 0)).toBe(0);
    expect(activeBeliefIndex(0, COUNT, 4)).toBe(4);
  });

  it('ignores a hover index outside the range and falls back to scroll', () => {
    expect(activeBeliefIndex(0, COUNT, 99)).toBe(0);
    expect(activeBeliefIndex(1, COUNT, -3)).toBe(COUNT - 1);
  });

  it('returns a valid index for every input, never null', () => {
    const inputs = [-2, -0.001, 0, 0.5, 0.999, 1, 2, Number.NaN];
    for (const progress of inputs) {
      const index = activeBeliefIndex(progress, COUNT, null);
      expect(Number.isInteger(index)).toBe(true);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(COUNT);
    }
  });

  it('is 0 for a single Belief regardless of progress', () => {
    expect(activeBeliefIndex(0, 1, null)).toBe(0);
    expect(activeBeliefIndex(1, 1, null)).toBe(0);
  });

  it('is 0 rather than negative when there are no Beliefs', () => {
    // Degenerate, but a caller reading an empty array must not get -1 and
    // index into nothing.
    expect(activeBeliefIndex(0.5, 0, null)).toBe(0);
  });
});

describe('the Intro state machine', () => {
  const run = (initial: IntroState, events: readonly IntroEvent[]): IntroState =>
    events.reduce(introReducer, initial);

  it('starts playing when motion is welcome', () => {
    expect(createIntroState({ prefersReducedMotion: false })).toBe('playing');
  });

  it('starts bypassed under reduced motion', () => {
    expect(createIntroState({ prefersReducedMotion: true })).toBe('bypassed');
  });

  it('goes from playing to done when the timeline completes', () => {
    expect(run('playing', ['completed'])).toBe('done');
  });

  it('goes from playing through skipped to done', () => {
    expect(run('playing', ['skipped'])).toBe('skipped');
    expect(run('playing', ['skipped', 'completed'])).toBe('done');
  });

  it('ignores a second skip while already skipping', () => {
    expect(run('playing', ['skipped', 'skipped'])).toBe('skipped');
  });

  it('ignores a skip once done — it never replays', () => {
    expect(run('playing', ['completed', 'skipped'])).toBe('done');
  });

  it('ignores a skip once bypassed — reduced motion is not overridden', () => {
    expect(run('bypassed', ['skipped'])).toBe('bypassed');
    expect(run('bypassed', ['skipped', 'completed'])).toBe('bypassed');
  });

  it('ignores completion once bypassed', () => {
    expect(run('bypassed', ['completed'])).toBe('bypassed');
  });

  it('treats done and bypassed as terminal under any sequence of events', () => {
    const events: IntroEvent[] = ['skipped', 'completed', 'skipped', 'completed'];
    expect(run('done', events)).toBe('done');
    expect(run('bypassed', events)).toBe('bypassed');
  });
});

describe('isIntroFinished', () => {
  it('is true only for the terminal states', async () => {
    const { isIntroFinished } = await import('./state');
    expect(isIntroFinished('playing')).toBe(false);
    expect(isIntroFinished('skipped')).toBe(false);
    expect(isIntroFinished('done')).toBe(true);
    expect(isIntroFinished('bypassed')).toBe(true);
  });
});
