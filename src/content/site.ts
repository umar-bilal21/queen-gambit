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

/** One experience block on the Essence page: photo row, copy, details card. */
export interface RoomExperience {
  readonly name: string;
  readonly location: string;
  readonly heading: string;
  readonly subheading: string;
  readonly paragraphs: readonly string[];
  /** The philosophy line, when the block has one. */
  readonly quote?: string;
  /** Bullets shown on the details card, in the reference's style. */
  /** Heads the plaque, so the card says what it is listing. */
  readonly detailsLabel: string;
  readonly details: readonly string[];
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

  /**
   * Frank J. Russo's statement of what the Castle is for — the longest piece of
   * writing on the site and the one that has to persuade.
   */
  manifesto: {
    title: 'The Queen’s Gambit Castle',
    paragraphs: [
      'The Queen’s Gambit Castle is more than an extraordinary residence. It is a living expression of imagination, artistry, and purpose, created to inspire and ultimately be shared with the public.',
      'From the beginning, the vision extended far beyond a single audience. The Castle was conceived as a place where people of all ages and backgrounds can experience architecture, art, storytelling, and creativity in an environment unlike any other. Local officials, cultural organizations, art centers, and schools have been invited to become part of that vision, helping shape the Castle into a meaningful cultural destination.',
      'At its heart is a commitment to the next generation. The Queen’s Gambit Castle is intended to inspire children, students with special needs, emerging artists, and young creators by giving them an opportunity to experience what is possible when imagination is given space to flourish.',
      'The Castle brings together traditional artistic expression with architecture, storytelling, technology, and emerging creative tools such as artificial intelligence. It is a place where young minds can explore freely, experiment boldly, and discover new ways of expressing their ideas.',
      'Every room, detail, and experience has been designed to encourage curiosity and expand what people believe they can create. The goal is for The Queen’s Gambit Castle to grow into a nationally recognized cultural destination, shaped not simply by the property itself, but by the people who experience it.',
      'A place where art meets imagination. Where technology meets human creativity. And where possibility is meant to be shared for generations to come.',
    ],
    signature: {
      name: 'Frank J. Russo',
      role: 'Visionary & Creator',
    },
    cta: 'TALK TO US TODAY',
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
   * The Essence page — "Home: The Essence Of The Queen's Gambit Castle"
   * (issue #30). Two room experiences, each with a photo row and a details
   * card in the reference's "Photos | details of room" style.
   */
  essence: {
    meta: {
      title: 'The Essence — The Queen’s Gambit Castle',
      description:
        'Oceanfront terrace gardens and the Door of Perception master chamber — the spaces that make The Queen’s Gambit Castle a living work of art on the Florida coast.',
    },
    hero: {
      eyebrow: 'THE ESSENCE',
      title: 'The Essence of The Queen’s Gambit Castle',
      subtitle:
        'TWO SIGNATURE EXPERIENCES — THE OCEANFRONT TERRACE AND GARDENS, AND THE DOOR OF PERCEPTION MASTER CHAMBER',
      scrollCue: 'Scroll',
    },
    rooms: [
      {
        name: 'Oceanfront Terrace and Gardens',
        location: 'OUTDOOR LIVING',
        heading: 'Oceanfront Terrace and Gardens',
        subheading: 'Featuring “The Patience Move” — a master’s philosophy in motion',
        paragraphs: [
          'Set against sweeping ocean views, the Oceanfront Terrace and Gardens extend The Queen’s Gambit into an immersive outdoor setting designed for gathering, reflection, and entertaining.',
          'The space brings the estate’s larger chess philosophy into the landscape. Mona, the Divine Goddess of Philosophy, represents strategy and intention, while Norma, Mother Nature, symbolizes balance. Throughout the experience, marine life becomes part of the living chessboard: coral reefs as bishops, fish as pawns, whales as rooks, and sea turtles as knights moving as between land and sea.',
          'At the center is The Patience Move, a reminder that every meaningful move requires foresight. Through its gardens, oceanfront setting, and symbolic design, the terrace connects luxury real estate with a deeper message of conservation, balance, and protecting the natural world that surrounds the estate.',
        ],
        detailsLabel: 'THE TERRACE AT A GLANCE',
        details: [
          'Sweeping ocean views',
          'The Patience Move at its centre',
          'Mona — Goddess of Philosophy',
          'Norma — Mother Nature',
          'Marine-life living chessboard',
        ],
      },
      {
        name: 'Door of Perception Master Chamber',
        location: 'MASTER SUITE',
        heading: 'Door of Perception Master Chamber',
        subheading: 'Master Suite | New Smyrna Beach',
        paragraphs: [
          'The Door of Perception Master Chamber is a private retreat designed to feel immersive, luxurious, and deeply serene. Inspired by themes of perception, reflection, and awakening, the suite brings together custom art, architectural detail, and ocean inspired elements to create a one of a kind residential experience.',
          'The main wall features Mona, the Goddess of Philosophy, whose painted gaze becomes a striking focal point within the room. Surrounding her, detailed coral imagery and marine inspired artwork bring depth and movement to the space, while a sculptural octopus extends across the ceiling with a jeweled third eye, adding an unexpected layer of artistry and symbolism.',
          'Peacock mosaics introduce rich color and intricate craftsmanship throughout the suite. In the adjoining space, the Fire Rain chandelier combines glass and light to create the appearance of suspended droplets, giving the room the atmosphere of a private luxury hotel or destination resort.',
          'Designed for privacy, comfort, and quiet reflection, the master chamber offers an intimate escape within the residence. Every detail has been curated to make the suite feel less like a traditional bedroom and more like a private experiential retreat overlooking the coastal setting of New Smyrna Beach.',
          'At the heart of the room is a philosophy that reflects its calm and contemplative character:',
        ],
        quote: '“Love is not kind. Love is patience.”',
        detailsLabel: 'THE CHAMBER AT A GLANCE',
        details: [
          'Custom art and architecture',
          'Mona — Goddess of Philosophy',
          'Sculptural octopus with jeweled third eye',
          'Peacock mosaics',
          'Fire Rain chandelier',
          'Overlooking New Smyrna Beach',
        ],
      },
    ] as const satisfies readonly RoomExperience[],
    cta: {
      title: 'Experience the Essence',
      subtitle: 'FOR PRIVATE VISITS, PARTNERSHIPS, MEDIA AND ALL GENERAL INQUIRIES',
      label: 'CONTACT US',
    },
  },

  /**
   * The Contact page (issue #31). Follows the reference's single-column
   * layout: a main heading, contact details, a gambit piece in place of the
   * key, and a two-column inquiry form. The form submits to a mailto with the
   * subject prefilled — the pitch has no backend.
   */
  contactPage: {
    meta: {
      title: 'Contact — The Queen’s Gambit Castle',
      description:
        'Connect with The Queen’s Gambit Castle for private events, partnerships, property inquiries, media, or general information.',
    },
    hero: {
      eyebrow: 'CONTACT',
      title: 'Connect With The Queen’s Gambit',
      subtitle: 'Step Into The Queen’s Gambit',
      intro:
        'For private events, partnerships, property inquiries, media, or general information, connect with our team.',
    },
    inquiries: {
      heading: 'ALL INQUIRIES',
      email: 'thequeensgambitlandmark@gmail.com',
      phone: null,
      location: 'NEW SMYRNA BEACH, FLORIDA',
    },
    form: {
      heading: 'SEND AN INQUIRY',
      fields: {
        name: 'FULL NAME',
        email: 'EMAIL',
        phone: 'PHONE',
        message: 'MESSAGE',
      },
      submit: 'SUBMIT INQUIRY',
    },
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
    /*
     * Only anchors that resolve. The client's mockup also shows EXPERIENCE,
     * LEGACY and two social icons; there are no such pages and no account
     * appears anywhere in the material supplied, so they are omitted rather
     * than rendered dead. Confirmed with the client.
     */
    nav: [
      { label: 'The Story', href: '#story' },
      { label: 'Our Beliefs', href: '#beliefs' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'The Essence', href: '/essence/' },
      { label: 'Contact', href: '/contact/' },
    ],
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

  /**
   * The inner pages, shown in the header of the Essence and Contact pages.
   * "Home" always resolves to the homepage; the other two are the pages
   * themselves. The homepage header keeps its section links instead.
   */
  navPages: [
    { label: 'Home', href: '/' },
    { label: 'The Essence', href: '/essence/' },
    { label: 'Contact', href: '/contact/' },
  ],
} as const;

/** Prefilled mailto for the Enter section's CONTACT US button. */
export const contactHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
  site.contact.emailSubject,
)}`;
