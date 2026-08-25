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
