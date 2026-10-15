// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files in QuadQuest.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

export const phrases = [
  // ─── INTRO ─────────────────────────────────────────────────────────────────
  { text: "Welcome to QuadQuest at the Savanna Ranger Academy!", style: 'statement' },
  { text: "Stop naming shapes by how they look — start proving them by what can be shown!", style: 'emphasis' },
  { text: "Classify the six special quadrilaterals, find missing angles with geometric proof, solve algebraic equations, and conquer the family tree!", style: 'instruction' },

  // ─── WONDER ────────────────────────────────────────────────────────────────
  { text: "A new savanna enclosure sign says RECTANGLE because the builder checked that opposite sides are equal.", style: 'statement' },
  { text: "A ranger isn't convinced! It could be a tilted parallelogram. One single measurement would settle it — which one?", style: 'question' },
  { text: "Stop guessing shapes by looks! Let's discover how measuring diagonals reveals the truth!", style: 'celebration' },

  // ─── STORY PANEL 0 ─────────────────────────────────────────────────────────
  { text: "Hui Min and Sanjay arrive at the Savanna Ranger Academy as dawn breaks over the plains.", style: 'statement' },
  { text: "Through their binoculars, strange four-sided geometric creatures roam the grasslands.", style: 'statement' },
  { text: "Look over there! Hui Min points excitedly. That enclosure sign says RECTANGLE, but from here it looks like a skewed fence!", style: 'statement' },
  { text: "Sanjay grabs his ranger toolkit. At the academy, we never identify a species just by squinting from the jeep. We need to check its sides, angles, and diagonals before writing any field-guide entry!", style: 'statement' },
  { text: "Never classify a species by appearance — inspect its features!", style: 'emphasis' },

  // ─── STORY PANEL 1 ─────────────────────────────────────────────────────────
  { text: "Gigi the Giraffe, the academy's senior lookout, strides over to the field-guide desk with a specimen sketch.", style: 'statement' },
  { text: "Rangers, Gigi warns, looks deceive. Behold this creature with four equal sides stretched out very thin!", style: 'statement' },
  { text: "Hui Min thought it was just a diamond kite. But test its diagonals: they cross at exactly ninety degrees and bisect each other!", style: 'statement' },
  { text: "Sanjay checks his notes: Four equal sides and perpendicular bisecting diagonals — that is a true Rhombus!", style: 'statement' },
  { text: "Three vital feature groups: Sides equal and parallel, Angles equal and supplementary, Diagonals bisect, equal, and perpendicular.", style: 'emphasis' },

  // ─── STORY PANEL 2 ─────────────────────────────────────────────────────────
  { text: "Gigi points her neck toward the grand Savanna Lineage Board. Quadrilateral species belong to a living family tree.", style: 'statement' },
  { text: "Just as a golden retriever is still a dog, every square is still a rectangle and a rhombus!", style: 'statement' },
  { text: "Hui Min gasps. A square inherits opposite sides parallel from the parallelogram branch, four right angles from the rectangle branch, and four equal sides with perpendicular diagonals from the rhombus branch!", style: 'statement' },
  { text: "The inclusion hierarchy: a square earns every title, but its most specific name is Square!", style: 'emphasis' },

  // ─── STORY PANEL 3 ─────────────────────────────────────────────────────────
  { text: "At the observation post, a creature rests against the riverbank. Sanjay measures: opposite sides are parallel, angle A is sixty-eight degrees.", style: 'statement' },
  { text: "By co-interior angles between parallel lines, angle B must be one hundred and eighty minus sixty-eight, which is one hundred and twelve degrees!", style: 'statement' },
  { text: "Hui Min records: Confirmed: Parallelogram, with reasoned angle derivation.", style: 'statement' },
  { text: "Gigi stamps the certificate with the Academy Seal: APPROVED. Ready for the field, Rangers — let the QuadQuest begin!", style: 'celebration' },
  { text: "Always provide a geometric reason: every angle and side follows rigorous proof!", style: 'emphasis' },

  // ─── SIMULATE INTROS ───────────────────────────────────────────────────────
  { text: "Welcome to Station A — The Shape Shifter Lab!", style: 'instruction' },
  { text: "Drag the diagonal sliders to reshape the quadrilateral. Observe how diagonal lengths, angles, and split ratios transform the species!", style: 'instruction' },
  { text: "Welcome to Station B — Build to Spec Challenge!", style: 'instruction' },
  { text: "Adjust the diagonal sliders until your quadrilateral fulfills all requirements on the mission specification card!", style: 'instruction' },
  { text: "Welcome to Station C — File the Field-Guide Entry!", style: 'instruction' },
  { text: "Inspect the raw measurements of specimen eight-oh-four, verify its features, calculate the missing angle with a reason, and place it on the family tree!", style: 'instruction' },
  { text: "Welcome to Station D — The Mislabelled Exhibit!", style: 'instruction' },
  { text: "A fellow ranger filed an exhibit plaque with a seeded misconception. Tap the erroneous line, and submit the scientifically proven correction!", style: 'instruction' },

  // ─── PRACTICE & FEEDBACK ───────────────────────────────────────────────────
  { text: "Feature confirmed! That is correct!", style: 'celebration' },
  { text: "Spotter badge worthy! Three correct in a row!", style: 'celebration' },
  { text: "Incredible tracker streak! Your geometric reasoning is unstoppable!", style: 'celebration' },
  { text: "Not quite — check the marked sides and angles, review the geometric theorem, and try again!", style: 'thinking' },
  { text: "Here is your first clue! Inspect the parallel sides and equal side tick marks.", style: 'encouragement' },
  { text: "Here is your second clue! Use the angle sum or diagonal bisection property step by step.", style: 'encouragement' },
  { text: "Savanna Habitat Mastered! Outstanding geometric proof work on this district!", style: 'celebration' },
  { text: "The Habitat Boss approaches! Prove your quadrilateral knowledge to earn the World Badge!", style: 'emphasis' },
  { text: "Victory! You outwitted the habitat boss and earned the Savanna Badge!", style: 'celebration' },

  // ─── REFLECT DEBRIEF ───────────────────────────────────────────────────────
  { text: "Welcome to the Ranger Debrief! Let's review the headline misconceptions and check your scorecard!", style: 'statement' },
  { text: "Outstanding! You have mastered sides, angles, diagonals, and the inclusion hierarchy! You are a true Chief Ranger!", style: 'celebration' },
];

async function generate() {
  if (!apiKey) {
    console.log("No ElevenLabs API key found in environment (.env.local).");
    console.log("Generating empty audioMap.js stub as per fallback rules.");
    writeAudioMap({});
    return;
  }

  const audioDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  const map = {};
  console.log(`\n🎙️ Starting ElevenLabs Pre-Generation (${phrases.length} phrases)...`);
  console.log(`Voice: Alice (${VOICE_ID}) | Model: ${VOICE_MODEL}\n`);

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 35);
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(audioDir, filename);

    if (fs.existsSync(filepath)) {
      map[text] = `/assets/audio/${filename}`;
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${filename}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 45)}..." -> ${filename}`);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
        }),
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        map[text] = `/assets/audio/${filename}`;
        console.log(`   ✅ Saved: ${filename}`);
      } else {
        const errText = await response.text();
        console.warn(`   ❌ Failed HTTP ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.warn(`   ❌ Error for "${text}":`, err.message);
    }

    // Rate-limit safety: small pause between requests
    await new Promise(r => setTimeout(r, 200));
  }

  writeAudioMap(map);
}

function writeAudioMap(map) {
  const content = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration in QuadQuest\n\nexport const audioMap = ${JSON.stringify(map, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync(path.resolve('src/utils/audioMap.js'), content, 'utf-8');
  console.log("\n✨ src/utils/audioMap.js updated successfully!");
  console.log(`🎉 Audio pre-generation complete. Total entries mapped: ${Object.keys(map).length}\n`);
}

generate();
