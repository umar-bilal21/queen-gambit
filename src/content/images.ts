/**
 * The property's photography, addressed by what it is rather than by filename.
 *
 * Sections ask for `images.hero` or `images.beliefs[2]`. Nothing outside this
 * file names a file, so recropping, replacing or reordering the photography is
 * a change here and nowhere else.
 *
 * Every entry carries a real alt description. These are not decorative: for a
 * visitor using a screen reader they are the only way the Castle exists, and
 * "interior photograph" would convey nothing about a room with a hand-painted
 * solar system on the ceiling.
 *
 * Copyright note: this is a listing shoot by Florida Home Photo. Copyright most
 * likely sits with the photographer or the brokerage rather than the client.
 * Flagged for the client to resolve before any production launch.
 */

import type { ImageMetadata } from 'astro';

import heroCastle from '../assets/images/hero-castle-oceanfront.jpg';
import roomWaves from '../assets/images/room-living-beneath-the-waves.jpg';
import roomChamber from '../assets/images/room-master-chamber.jpg';
import roomCommand from '../assets/images/room-command-center.jpg';
import beliefPurpose from '../assets/images/belief-purpose.jpg';
import beliefCuriosity from '../assets/images/belief-curiosity.jpg';
import beliefCreativity from '../assets/images/belief-creativity.jpg';
import beliefStory from '../assets/images/belief-story.jpg';
import beliefNext from '../assets/images/belief-what-comes-next.jpg';
import galleryPoolOcean from '../assets/images/gallery-pool-ocean.jpg';
import galleryDoorway from '../assets/images/gallery-painted-doorway.jpg';
import gallerySunCeiling from '../assets/images/gallery-sun-ceiling.jpg';
import galleryTurtle from '../assets/images/gallery-turtle-mural.jpg';
import galleryTerrace from '../assets/images/gallery-pool-terrace.jpg';
import galleryBalcony from '../assets/images/gallery-balcony-shore.jpg';
import galleryHearth from '../assets/images/gallery-terrace-hearth.jpg';
import galleryElevation from '../assets/images/gallery-castle-elevation.jpg';
import enterColonnade from '../assets/images/enter-ocean-colonnade.jpg';
import enterEvening from '../assets/images/enter-castle-evening.jpg';

// The castle direction's photography, supplied by the client.
import crownedTurtle from '../assets/images/crowned-turtle-mural.jpg';
import sunCeiling from '../assets/images/sun-ceiling-chandelier.jpg';
import clamShell from '../assets/images/giant-clam-shell.jpg';
import marlinSunrise from '../assets/images/marlin-at-sunrise.jpg';
import mantaRay from '../assets/images/manta-ray-mosaic.jpg';
import coralWall from '../assets/images/coral-reef-wall.jpg';
import seaGod from '../assets/images/sea-god-mural.jpg';
import poolToOcean from '../assets/images/pool-to-ocean.jpg';

/**
 * How the Hero photograph is generated.
 *
 * Shared deliberately: the document head preloads this image and the Hero
 * section renders it, and if the two disagree by so much as a quality setting
 * they resolve to different files — the preload then fetches an image nobody
 * displays and the visible one starts from scratch, which is worse than not
 * preloading at all.
 */
export const HERO_IMAGE = {
  widths: [640, 1024, 1600, 2048],
  sizes: '100vw',
  quality: 82,
} as const;

export interface Photo {
  readonly src: ImageMetadata;
  readonly alt: string;
}

const photo = (src: ImageMetadata, alt: string): Photo => ({ src, alt });

export const images = {
  hero: photo(
    heroCastle,
    "The Queen's Gambit Castle seen head-on from its ocean lawn: a white and blue-tiled facade of columns, balconies and gabled roofs, with a tall marlin sculpture rising from a mosaic fountain at the centre.",
  ),

  /** In the same order as `site.rooms.items`. */
  rooms: [
    photo(
      roomWaves,
      'A living and dining room walled almost entirely in glass, opening onto the Atlantic. A crystal chandelier hangs above pale curved armchairs set on a mosaic floor of sea creatures.',
    ),
    photo(
      roomChamber,
      'The master chamber, painted floor to ceiling in deep blues and greens. A tufted white headboard and midnight bedspread sit beneath a mural of underwater light.',
    ),
    photo(
      roomCommand,
      "A bedroom facing the ocean where a chess set waits on a small table by the window, beneath a ceiling painted with sea turtles gliding overhead.",
    ),
  ] as const satisfies readonly Photo[],

  /** In the same order as `site.beliefs.items`. */
  beliefs: [
    photo(
      beliefPurpose,
      'A dark games room with a round table and upholstered chairs, its walls carrying mosaic panels of a serpent and a watching eye.',
    ),
    photo(
      beliefCuriosity,
      'A ceiling painted as the solar system: planets, a golden sun and a burst of white light spreading across deep blue above a room of tall windows.',
    ),
    photo(
      beliefCreativity,
      'A hand-painted wall of turquoise water in which starfish, shells and a diving whale drift across the surface.',
    ),
    photo(
      beliefStory,
      'A painted panel of a bearded sea god rising from a coral reef with a trident in his hand, framed like a doorway in the wall.',
    ),
    photo(
      beliefNext,
      'A ceiling mural of hammerhead sharks circling an orrery of planets, painted in blues and golds.',
    ),
  ] as const satisfies readonly Photo[],

  gallery: [
    photo(
      galleryPoolOcean,
      'The swimming pool framed by tiled columns, its water continuing visually into the Atlantic beyond.',
    ),
    photo(
      galleryDoorway,
      'A doorway set into a wall painted with an underwater scene, opening onto a further blue room.',
    ),
    photo(
      gallerySunCeiling,
      'A ceiling mosaic of a golden sun, from whose centre a cascading crystal chandelier falls.',
    ),
    photo(
      galleryTurtle,
      'A large sea turtle painted across the ceiling, its shell patterned in coral and gold.',
    ),
    photo(
      galleryTerrace,
      'The pool terrace seen from above, its mosaic surround set against the beach and open ocean.',
    ),
    photo(
      galleryBalcony,
      'A balustraded balcony painted with an octopus, looking north along an empty shoreline.',
    ),
    photo(
      galleryHearth,
      'An outdoor kitchen and bar under a painted ceiling, with blue stools drawn up to a tiled counter.',
    ),
    photo(
      galleryElevation,
      "The Castle's ocean elevation seen at an angle, its terraces, columns and blue-tiled roofs stepping down to the lawn.",
    ),
  ] as const satisfies readonly Photo[],

  /**
   * The photographs the castle direction is built from.
   *
   * Two notes worth carrying:
   *
   * The sea god mural was shot sideways and has been rotated upright in source
   * rather than with a CSS transform, so nothing downstream has to know.
   *
   * The crowned turtle is the most on-brand image anyone has supplied and also
   * the smallest at 1290×716. Behind a full-width band it will be visibly soft
   * on a large display. Raised with the client and accepted — do not upscale it
   * and do not quietly substitute another photograph.
   */
  castle: {
    crownedTurtle: photo(
      crownedTurtle,
      'A painted sea turtle wearing a jewelled crown, its shell patterned in green and gold, swimming through deep blue water.',
    ),
    sunCeiling: photo(
      sunCeiling,
      'A ceiling painted with a blazing orange sun, from whose centre a cascading chandelier of pale blue crystal falls.',
    ),
    clamShell: photo(
      clamShell,
      'A giant clam shell in close view, its mantle rippling in bands of gold, cream and deep blue.',
    ),
    marlinSunrise: photo(
      marlinSunrise,
      'A tall blue glass marlin sculpture on a mosaic plinth, standing against a balustrade as the sun rises over the ocean behind it.',
    ),
    mantaRay: photo(
      mantaRay,
      'A mosaic of a manta ray gliding through deep blue water beneath a shoal of small silver fish.',
    ),
    coralWall: photo(
      coralWall,
      'A mosaic wall of a coral reef in full colour: yellow and white fish moving among red, orange and green corals against blue.',
    ),
    seaGod: photo(
      seaGod,
      'A mural of a sea god with long flowing hair rising through turquoise water, framed like a doorway, small tropical fish drifting past.',
    ),
  },

  /**
   * The three sealife grounds behind the Masterwork bands.
   *
   * Two are drawn from the listing shoot rather than the client's folder,
   * because the pairing is better: "the ocean seeking its way to the stars
   * above" belongs over the painted solar system, and "marine mosaics shimmer"
   * belongs over the painted reef wall. The client's folder is spent on the
   * Beliefs, where they were asked for.
   */
  masterwork: [
    photo(
      beliefCreativity,
      'A hand-painted wall of turquoise water in which starfish, shells and a diving whale drift across the surface.',
    ),
    photo(
      beliefCuriosity,
      'A ceiling painted as the solar system: planets, a golden sun and a burst of white light spreading across deep blue.',
    ),
    photo(
      marlinSunrise,
      'A tall blue glass marlin sculpture standing against a balustrade as the sun rises over the ocean behind it.',
    ),
  ] as const satisfies readonly Photo[],

  /**
   * The ground beneath Explore Every Corner and the Beliefs heading.
   *
   * A photograph rather than a flat colour so the two sections read as one
   * descent instead of two slabs — which is the whole point of it spanning
   * them. Graded hard toward navy in the component: it is texture under type,
   * not a picture anyone is meant to look at.
   */
  descent: photo(
    coralWall,
    'A mosaic wall of a coral reef: fish moving among red, orange and green corals in deep blue water.',
  ),

  /**
   * The Beliefs rows, in the client's requested order.
   *
   * These are the photographs from the folder the client pointed at, mapped as
   * agreed: the crowned turtle for purpose, the sun ceiling for curiosity, the
   * clam shell for creativity, the sea god for storytelling, the manta ray for
   * what comes next.
   *
   * The reef wall is deliberately absent — it is the ground the whole descent
   * sits on, and using it again a few hundred pixels further down would read as
   * a repeat rather than a return.
   */
  beliefRows: [
    photo(
      crownedTurtle,
      'A painted sea turtle wearing a jewelled crown, swimming through deep blue water.',
    ),
    photo(
      sunCeiling,
      'A ceiling painted with a blazing orange sun, a cascading crystal chandelier falling from its centre.',
    ),
    photo(
      clamShell,
      'A giant clam shell in close view, its mantle rippling in bands of gold, cream and deep blue.',
    ),
    photo(
      seaGod,
      'A mural of a sea god with long flowing hair rising through turquoise water, small fish drifting past.',
    ),
    photo(
      mantaRay,
      'A mosaic of a manta ray gliding through deep blue water beneath a shoal of small silver fish.',
    ),
  ] as const satisfies readonly Photo[],

  /** The view the page closes on. */
  poolToOcean: photo(
    poolToOcean,
    'The swimming pool, sea turtles set in mosaic across its floor, running between tiled columns straight out to the open Atlantic.',
  ),

  /** The two photographs combined into the Enter section's single field. */
  enter: {
    left: photo(
      enterColonnade,
      'The Atlantic seen between two tiled columns from the Castle terrace.',
    ),
    right: photo(
      enterEvening,
      'The Castle exterior, its balconies and pool terrace catching low light.',
    ),
  },
} as const;
