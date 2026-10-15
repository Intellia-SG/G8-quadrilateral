// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';
import wonderImg from '../../assets/wonder.png';

const PARTICLES = ['🦒', '📐', '📏', '🔷', '🟩', '🦏', '✨', '🌿', '🪵', '🧭'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-hero-img-wrap">
            <img src={wonderImg} alt="The Savanna Enclosure Mystery" className="wonder-hero-img" />
          </div>
          <h1 className="wonder-title headline">The Savanna Enclosure Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">Opposite Sides Equal ➔ Rectangle? Or Parallelogram?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A new savanna enclosure sign says <strong className="wonder-em">RECTANGLE</strong> because the builder checked that opposite sides are equal.
            </p>
            <p className="body-text wonder-q">
              A ranger isn't convinced! It could be a tilted parallelogram. <span className="wonder-highlight">One single measurement would settle it</span> — which one?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Stop guessing shapes by looks! Let's discover how measuring diagonals reveals the truth!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Enter the Academy 🔭
          </button>
        </div>
      </div>
    </div>
  );
}
