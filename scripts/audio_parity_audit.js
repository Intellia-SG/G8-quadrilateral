// scripts/audio_parity_audit.js
// Systematic verification for Audio Generation & Narration Pipeline in QuadQuest.
// Adheres strictly to audio_generation_pipeline (5).md and PRD §11.

import fs from 'fs';
import path from 'path';
import { audioMap } from '../src/utils/audioMap.js';
import {
  introNarration,
  wonderNarration,
  storyNarration,
  simStationIntro,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossStartNarration,
  bossWinNarration,
  reflectNarration,
  reflectCompleteNarration,
  cleanMathTextForSpeech,
} from '../src/utils/narration.js';
import { STORY_PANELS } from '../src/data/storyContent.js';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../src/config/audio.config.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('   QUADQUEST AUDIO PIPELINE & PARITY AUDIT SUITE    ');
console.log('====================================================\n');

// 1. Audit Voice Profile & Config
console.log('[Check 1] Auditing Voice Profile & Emotional Presets...');
assert(VOICE_ID === 'Xb7hH8MSUJpSbSDYk0k2', 'Voice ID matches Alice (Xb7hH8MSUJpSbSDYk0k2)');
assert(VOICE_MODEL === 'eleven_multilingual_v2', 'Model matches eleven_multilingual_v2');
const styles = ['statement', 'instruction', 'question', 'encouragement', 'emphasis', 'thinking', 'celebration'];
for (const s of styles) {
  assert(Boolean(VOICE_SETTINGS[s]), `Voice setting preset '${s}' exists with proper params`);
}

// 2. Audit Static Audio Assets on Disk
console.log('\n[Check 2] Auditing static audio assets on disk...');
const audioDir = path.resolve('public/assets/audio');
assert(fs.existsSync(audioDir), 'public/assets/audio directory exists');

const keys = Object.keys(audioMap);
assert(keys.length > 0, `audioMap contains entries (found: ${keys.length})`);

for (const [text, relPath] of Object.entries(audioMap)) {
  const fullPath = path.join('public', relPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 1000, `Audio asset for "${text.substring(0, 35)}..." exists (${size} bytes)`);
}

// 3. Audit 1:1 Parity Between Narration Functions & Audio Map
console.log('\n[Check 3] Auditing 1:1 Parity between Narration and Audio Map...');

function checkSegments(name, segments) {
  for (const seg of segments) {
    const hasMatch = Boolean(audioMap[seg.text]);
    assert(hasMatch, `${name}: "${seg.text.substring(0, 40)}..." has exact 1:1 audioMap entry`);
  }
}

checkSegments('Intro Narration', introNarration());
checkSegments('Wonder Narration', wonderNarration());

for (let p = 0; p < 4; p++) {
  checkSegments(`Story Panel ${p}`, storyNarration(p));
}

for (let st = 0; st < 4; st++) {
  checkSegments(`Sim Station ${st}`, simStationIntro(st));
}

checkSegments('Play Correct (streak 1)', playCorrectNarration(1));
checkSegments('Play Correct (streak 3)', playCorrectNarration(3));
checkSegments('Play Correct (streak 5)', playCorrectNarration(5));
checkSegments('Play Wrong', playWrongNarration());
checkSegments('Play Hint 1', playHint1Narration());
checkSegments('Play Hint 2', playHint2Narration());
checkSegments('District Complete', districtCompleteNarration());
checkSegments('Boss Start', bossStartNarration());
checkSegments('Boss Win', bossWinNarration());
checkSegments('Reflect Narration', reflectNarration());
checkSegments('Reflect Complete', reflectCompleteNarration());

// 4. Audit 1:1 Parity with storyContent.js
console.log('\n[Check 4] Auditing Story Content UI text vs Narration scripts...');
for (let p = 0; p < STORY_PANELS.length; p++) {
  const panel = STORY_PANELS[p];
  const segs = storyNarration(p);
  const highlightSeg = segs[segs.length - 1];

  assert(highlightSeg.text === panel.highlight, `Panel ${p} highlight exactly matches narration segment (${panel.highlight})`);

  for (const s of segs) {
    const inText = panel.text.includes(s.text) || panel.highlight === s.text;
    assert(inText, `Panel ${p} spoken line "${s.text.substring(0, 35)}..." exists on UI panel`);
  }
}

// 5. Audit cleanMathTextForSpeech for Grade 8 Geometry Rules (PRD §11)
console.log('\n[Check 5] Auditing cleanMathTextForSpeech geometric conversions...');
const testInput = 'In parallelogram ABCD, AB ∥ DC and ∠ABC = 72°. Is △ABC ≅ △CDA? θ = 90°';
const cleanOutput = cleanMathTextForSpeech(testInput);
assert(cleanOutput.includes('A B C D'), 'ABCD is converted letter-by-letter to "A B C D"');
assert(cleanOutput.includes('A B is parallel to D C'), 'AB ∥ DC is converted to "A B is parallel to D C"');
assert(cleanOutput.includes('angle A B C equals 72 degrees'), '∠ABC = 72° is converted to "angle A B C equals 72 degrees"');
assert(cleanOutput.includes('triangle A B C is congruent to triangle C D A'), '△ABC ≅ △CDA converted to spoken words');
assert(cleanOutput.includes('theta equals 90 degrees'), 'θ = 90° is converted to "theta equals 90 degrees"');

console.log('\n====================================================');
console.log(`TOTAL PARITY AUDIT RESULTS: Passed: ${passed}, Failed: ${failed}`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 AUDIO PIPELINE & NARRATION PARITY 100% PERFECT!\n');
}
