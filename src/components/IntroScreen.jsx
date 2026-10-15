import React, { useEffect } from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';
import gigiImg from '../assets/gigi.png';
import { useAudio } from '../hooks/useAudio.js';
import { introNarration } from '../utils/narration.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The mystery' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Savanna guide' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 ranger labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Debrief & scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    narrate(introNarration());
    return () => stopAll();
  }, [narrate, stopAll]);

  function startFresh() {
    stopAll();
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Header Group */}
      <div className="intro-header-group">
        <div className="intro-top-badge">
          ✨ Grade 8 Geometry · The Savanna Ranger Academy
        </div>
        <h1 className="intro-title">
          <span className="text-orange">Quad</span><span className="text-white">Quest</span>
        </h1>
        <h2 className="intro-subtitle">Master Sides, Angles, Diagonals &amp; Inclusions</h2>
      </div>

      {/* Mascot & Mission Hero Card */}
      <div className="intro-mascot-card">
        <div className="intro-mascot-circle">
          <img src={gigiImg} alt="Gigi the Ranger Giraffe" className="intro-mascot-img" />
        </div>
        <div className="intro-speech-content">
          <p className="speech-quote">
            "Stop naming shapes by how they look — start proving them by what can be shown!"
          </p>
          <p className="speech-desc">
            Classify the six special quadrilaterals, find missing angles with geometric proof, solve algebraic equations, and conquer the family tree!
          </p>
        </div>
      </div>

      {/* Journey Card (Single sleek horizontal row) */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>
        <div className="journey-steps-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() => {
                  stopAll();
                  dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() });
                }}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">➔</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="intro-btn-row">
        {hasSaved ? (
          <>
            <button className="btn btn-outline btn-lg" onClick={startFresh} aria-label="Start fresh session">
              Restart Journey 🔄
            </button>
            <button className="btn btn-primary btn-lg pulse-glow" onClick={resumeSession} aria-label="Resume existing session">
              Resume Journey ➔
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg pulse-glow" onClick={startFresh} aria-label="Begin learning journey">
            Begin QuadQuest Journey 🚀
          </button>
        )}
      </div>
    </div>
  );
}
