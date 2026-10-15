// src/data/storyContent.js
// 4 Story Panels for QuadQuest (PRD §8.2 / TRD §4.3)
// Strictly synchronized with 1:1 parity to audio narration scripts.

export const STORY_PANELS = [
  {
    panel: 0,
    title: "A Strange Sighting",
    text: "Hui Min and Sanjay arrive at the Savanna Ranger Academy as dawn breaks over the plains. Through their binoculars, strange four-sided geometric creatures roam the grasslands. Look over there! Hui Min points excitedly. That enclosure sign says RECTANGLE, but from here it looks like a skewed fence! Sanjay grabs his ranger toolkit. At the academy, we never identify a species just by squinting from the jeep. We need to check its sides, angles, and diagonals before writing any field-guide entry!",
    highlight: "Never classify a species by appearance — inspect its features!",
    character: "Hui Min & Sanjay",
    characterEmoji: "👧🏻🧑🏽",
    imageBg: "linear-gradient(135deg, #1b2838 0%, #2c3e50 100%)",
    imageEmoji: "🔭",
  },
  {
    panel: 1,
    title: "Check the Features",
    text: "Gigi the Giraffe, the academy's senior lookout, strides over to the field-guide desk with a specimen sketch. Rangers, Gigi warns, looks deceive. Behold this creature with four equal sides stretched out very thin! Hui Min thought it was just a diamond kite. But test its diagonals: they cross at exactly ninety degrees and bisect each other! Sanjay checks his notes: Four equal sides and perpendicular bisecting diagonals — that is a true Rhombus!",
    highlight: "Three vital feature groups: Sides equal and parallel, Angles equal and supplementary, Diagonals bisect, equal, and perpendicular.",
    character: "Gigi the Giraffe",
    characterEmoji: "🦒",
    imageBg: "linear-gradient(135deg, #2b1f1d 0%, #4a2818 100%)",
    imageEmoji: "📏",
  },
  {
    panel: 2,
    title: "The Family Tree",
    text: "Gigi points her neck toward the grand Savanna Lineage Board. Quadrilateral species belong to a living family tree. Just as a golden retriever is still a dog, every square is still a rectangle and a rhombus! Hui Min gasps. A square inherits opposite sides parallel from the parallelogram branch, four right angles from the rectangle branch, and four equal sides with perpendicular diagonals from the rhombus branch! The inclusion hierarchy: a square earns every title, but its most specific name is Square!",
    highlight: "The inclusion hierarchy: a square earns every title, but its most specific name is Square!",
    character: "Gigi & Hui Min",
    characterEmoji: "🦒👧🏻",
    imageBg: "linear-gradient(135deg, #1e3a2f 0%, #2a4d3b 100%)",
    imageEmoji: "🌳",
  },
  {
    panel: 3,
    title: "Filed in the Field Guide",
    text: "At the observation post, a creature rests against the riverbank. Sanjay measures: opposite sides are parallel, angle A is sixty-eight degrees. By co-interior angles between parallel lines, angle B must be one hundred and eighty minus sixty-eight, which is one hundred and twelve degrees! Hui Min records: Confirmed: Parallelogram, with reasoned angle derivation. Gigi stamps the certificate with the Academy Seal: APPROVED. Ready for the field, Rangers — let the QuadQuest begin!",
    highlight: "Always provide a geometric reason: every angle and side follows rigorous proof!",
    character: "Sanjay & Gigi",
    characterEmoji: "🧑🏽🦒",
    imageBg: "linear-gradient(135deg, #2c2541 0%, #3e3258 100%)",
    imageEmoji: "📋",
  },
];

export default STORY_PANELS;
