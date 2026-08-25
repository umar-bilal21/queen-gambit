/**
 * Every visitor-facing word on the site.
 *
 * The client will change wording — they always do — and when they do it must be
 * one edit in one file, not a hunt through nine templates. Nothing in
 * `src/components` or `src/pages` should contain prose.
 *
 * Vocabulary follows CONTEXT.md: Intro, Hero, Story, Rooms, Beliefs, Gallery,
 * Enter, Footer. "Castle" is canonical throughout (ADR 0004).
 */

export interface Belief {
  /** Displayed as a letterspaced caps title on the row. */
  readonly title: string;
  readonly body: string;
}

export interface Room {
  readonly name: string;
}

export const site = {
  /** Used in <title>, structured data, and the Enter section's mailto subject. */
  name: "The Queen's Gambit Castle",

  meta: {
    title: "The Queen's Gambit Castle — Where the Ocean Meets Imagination",
    description:
      'An immersive oceanfront castle on the Florida coast where art, nature and imagination come together. A living masterpiece by Frank J. Russo.',
  },

  /**
   * The Intro is a brand moment on a fixed timeline, not a preloader — there is
   * no progress to report and so no progress copy (ADR 0003).
   */
  intro: {
    line: 'A LIVING MASTERPIECE INSPIRED BY ART, NATURE AND VISION',
    skipLabel: 'Skip introduction',
  },

  hero: {
    subtitle:
      'DISCOVER AN IMMERSIVE OCEANFRONT CASTLE WHERE ART, NATURE AND IMAGINATION COME TOGETHER',
    title: ['Where the Ocean', 'Meets Imagination'],
    attribution: {
      place: "THE QUEEN'S GAMBIT CASTLE",
      author: 'By Modern-Day Philosopher Frank J. Russo',
    },
    scrollCue: 'Scroll',
  },

  /**
   * One section, both paragraphs.
   *
   * Deliberately whole strings: the recolour splits the lead into words at
   * render time, and pre-splitting it here would put presentation into the
   * content module.
   *
   * An earlier draft split these across a white recolouring section and a
   * separate cream one carrying the artwork, reading the brief's "background to
   * be white" as applying to the ground rather than to the reference image it
   * described. The client corrected it: this is a single beige section holding
   * the reef artwork and both paragraphs.
   */
  story: {
    /*
     * One passage in two paragraphs, not a headline followed by body copy.
     * Both are set the same and both recolour, so the effect runs straight
     * through from the first word to the last.
     */
    paragraphs: [
      'Along the Florida Coast, Where Ocean Winds Bend Palms and Salt Clings to the Air, Rose The Queen’s Gambit Castle',
      'Stepping through the grand entrance, visitors enter a sea of motion frozen in art. Ceramic turtles, each hand-sculpted and unique, meander across the floor, traveling toward the horizon of time.',
    ],
  },

  /**
   * What the marine work in the building means. Three headed blocks and an
   * invitation, in the client's own words.
   *
   * The third is one line against two substantial paragraphs. That imbalance is
   * in the copy as written and is not padded out — a short statement given air
   * reads as deliberate; a padded one reads as filler.
   */
  masterwork: {
    blocks: [
      {
        title: 'Ocean-Inspired Masterwork',
        body: 'Along the walls, marine mosaics shimmer—flying fish leap between rooms, their silver bodies suspend in perpetual flight, bridging the realms of water and air. They are the philosophers of the deep, creatures who refuse confinement, carrying the ocean’s breath into the heavens.',
      },
      {
        title: 'Oceanic Serenity',
        body: 'It is as though the ocean itself breached the doors, seeking its way to the stars above. Each turn reveals new depths of color and meaning—the house breathing in rhythm with the tides, alive with the pulse of creation, wisdom, and vision.',
      },
      {
        title: 'Worldwide Allure',
        body: 'Welcoming guests from around the world.',
      },
    ],
    cta: 'LEARN MORE ABOUT US',
    /** The manifesto is literally the "about us" content, so the link is honest. */
    ctaHref: '#manifesto',
  },

  rooms: {
    heading: 'Explore Every Corner',
    items: [
      { name: 'Living and Dining Beneath the Waves' },
      { name: 'The Door of Perception – Master Chamber' },
      { name: "The Queen's Command Center" },
    ] as const satisfies readonly Room[],
  },

  beliefs: {
    eyebrow: 'OUR BELIEFS',
    title: 'A VISION BUILT WITH PURPOSE',
    intro:
      'We believe meaningful places are created with intention. Every detail should invite curiosity, every space should carry meaning, and every experience should leave something behind.',
    /**
     * Ordered. The order is content, not layout — it builds from how decisions
     * are made, through who the place is for, to what it leaves behind.
     */
    items: [
      {
        title: 'PURPOSE IN EVERY MOVE',
        body: 'Like chess, we believe the strongest decisions are thoughtful ones. Patience, perspective, and intention guide the vision behind The Queen’s Gambit Castle.',
      },
      {
        title: 'CURIOSITY SHOULD BE ENCOURAGED',
        body: 'We believe people of every age should have spaces that make them question, explore, discover, and see the world differently.',
      },
      {
        title: 'CREATIVITY SHOULD BE ACCESSIBLE',
        body: 'Inspiration should not belong to a select few. The Castle was envisioned as a place where children, artists, students, families, and visitors from all backgrounds can experience something extraordinary.',
      },
      {
        title: 'DESIGN SHOULD TELL A STORY',
        body: 'A room should be more than beautiful. It should communicate an idea, evoke emotion, and become part of a larger narrative.',
      },
      {
        title: 'CREATE FOR WHAT COMES NEXT',
        body: 'We believe the greatest spaces do more than exist in the present. They encourage future generations to imagine further, think differently, and create what has not yet been created.',
      },
    ] as const satisfies readonly Belief[],
  },

  gallery: {
    eyebrow: 'THE CASTLE',
    title: 'Our Gallery',
  },

  enter: {
    title: 'Enter The Queen’s Gambit',
    subtitle:
      'FOR PRIVATE VISITS, PARTNERSHIPS, MEDIA AND ALL GENERAL INQUIRIES',
    cta: 'CONTACT US',
  },

  /**
   * The email address reads "landmark" while the copy reads "Castle". That is
   * the client's real working address and the inconsistency is deliberate and
   * reported to them, not papered over with an invented address (ADR 0004).
   *
   * No telephone number and no social accounts appear anywhere in the client's
   * materials, so none are listed. Inventing them would be worse than omitting.
   */
  contact: {
    email: 'thequeensgambitlandmark@gmail.com',
    emailSubject: "Enquiry — The Queen's Gambit Castle",
    address: ['4627 Van Kleeck Dr', 'New Smyrna Beach, FL 32169', 'Florida, USA'],
  },

  footer: {
    backToTop: 'Back to top',
    credit: '© 2026 The Queen’s Gambit Castle. All rights reserved.',
  },

  /**
   * Header links. Every one of these must resolve to a section that exists on
   * this page — there are no inner pages, and a dead link in a pitch is a leak
   * you then have to explain.
   */
  nav: [
    { label: 'The Story', href: '#story' },
    { label: 'Our Beliefs', href: '#beliefs' },
    { label: 'Gallery', href: '#gallery' },
  ],
} as const;

/** Prefilled mailto for the Enter section's CONTACT US button. */
export const contactHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
  site.contact.emailSubject,
)}`;
