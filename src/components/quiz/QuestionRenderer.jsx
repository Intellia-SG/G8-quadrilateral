// src/components/quiz/QuestionRenderer.jsx
import React, { useState } from 'react';
import './QuestionRenderer.css';
import QuadVisual from '../shared/QuadVisual.jsx';
import { REASONS } from '../../utils/quadProperties.js';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev,
}) {
  // State for step-matching interaction if steps are present
  const [selectedStepReasons, setSelectedStepReasons] = useState({});

  if (!question) return null;

  const { category, questionText, options, visual, visualData, hint1, hint2, steps } = question;
  const categoryTag = category || 'GEOMETRY RANGER';

  function handleSelectStepReason(stepIdx, reasonKey) {
    if (isLocked) return;
    const updated = { ...selectedStepReasons, [stepIdx]: reasonKey };
    setSelectedStepReasons(updated);
  }

  function submitStepReasons() {
    if (isLocked) return;
    // Find matching option from options array
    if (options && options.length > 0) {
      onAnswer(question.correctAnswer);
    }
  }

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">🦒</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Visual aid if available */}
      {visual && visualData && (
        <div className="qr-visual">
          <QuadVisual type={visual} data={visualData} compact={true} />
        </div>
      )}

      {/* Interactive Step-Reason Matching UI if steps are provided */}
      {steps && steps.length > 0 && (
        <div className="step-matcher-box">
          <h4 className="step-matcher-title">Match each step to its geometric reason:</h4>
          {steps.map((st, sIdx) => (
            <div key={sIdx} className="step-row">
              <span className="step-statement">{st.statement}</span>
              <select
                className="step-reason-select"
                value={selectedStepReasons[sIdx] || ''}
                onChange={(e) => handleSelectStepReason(sIdx, e.target.value)}
                disabled={isLocked}
                aria-label={`Reason for step ${sIdx + 1}`}
              >
                <option value="">-- Select Geometric Reason --</option>
                {Object.entries(REASONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Options — standard 4-option grid */}
      <div className="options-grid">
        {options?.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => !isLocked && onAnswer(opt)}
            disabled={isLocked}
            aria-label={`Option: ${opt}`}
          >
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {/* Hint display */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Action Row: Hint Button + Prev + Next in one sleek bar */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev Question
            </button>
          )}
          {onNext && (
            <button
              className="btn btn-primary btn-sm qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
