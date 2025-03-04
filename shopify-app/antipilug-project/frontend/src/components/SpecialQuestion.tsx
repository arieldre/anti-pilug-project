import React, { useState, useEffect } from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';
import './SpecialQuestion.scss';

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question, value, onChange }) => {
  const [stones, setStones] = useState<('left' | 'right')[]>(Array(question.options?.totalStones || 12).fill('left'));
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  // Always start with 0 arrows for dart board
  const [arrowsThrown, setArrowsThrown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrows, setArrows] = useState<{ x: number; y: number }[]>([]);
  const [currentArrow, setCurrentArrow] = useState<{ targetX: number; targetY: number } | null>(null);

  useEffect(() => {
    setLeftCount(stones.filter((s) => s === 'left').length);
    setRightCount(stones.filter((s) => s === 'right').length);
  }, [stones]);

  // For security wall, use the value prop
  useEffect(() => {
    if (question.specialType === 'securityWall') {
      // Initialize stones based on value
      if (value > 0) {
        const newStones = [...stones];
        for (let i = 0; i < value && i < newStones.length; i++) {
          newStones[i] = 'right';
        }
        setStones(newStones);
      }
    }
  }, [question.specialType, value, stones.length]); // Only run on initial render

  const handleStoneClick = (index: number) => {
    const newStones = [...stones];
    newStones[index] = newStones[index] === 'left' ? 'right' : 'left';
    setStones(newStones);
    
    const rightCount = newStones.filter(s => s === 'right').length;
    onChange(rightCount);
  };

  const throwArrow = () => {
    if (arrowsThrown < 10 && !isAnimating) {
      setIsAnimating(true);
      
      // Calculate random position within target bounds
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 90;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      
      setCurrentArrow({ targetX, targetY });

      setTimeout(() => {
        const newArrows = [...arrows, { x: targetX, y: targetY }];
        setArrows(newArrows);
        
        const newArrowsThrown = arrowsThrown + 1;
        setArrowsThrown(newArrowsThrown);
        setIsAnimating(false);
        setCurrentArrow(null);
        
        // Only return how many arrows are thrown
        onChange(newArrowsThrown);
      }, 600);
    }
  };

  // Render based on question type
  if (question.specialType === 'securityWall') {
    return (
      <div className="special-question security-wall">
        <h3 className="question-text">{question.text}</h3>
        <div className="wall-sides">
          <div className="wall-side left">
            <div className="side-header">
              <span className="icon">{question.options?.leftSide.icon}</span>
              <h3>{question.options?.leftSide.label}</h3>
            </div>
            <p>{question.options?.leftSide.description}</p>
            <div className="count">Current: {leftCount}</div>
          </div>
          <div className="wall-container">
            {Array(question.options?.totalStones || 12).fill(null).map((_, i) => (
              <div
                key={i}
                className={`stone ${stones[i]}`}
                onClick={() => handleStoneClick(i)}
              />
            ))}
          </div>
          <div className="wall-side right">
            <div className="side-header">
              <span className="icon">{question.options?.rightSide.icon}</span>
              <h3>{question.options?.rightSide.label}</h3>
            </div>
            <p>{question.options?.rightSide.description}</p>
            <div className="count">Current: {rightCount}</div>
          </div>
        </div>
      </div>
    );
  }

  // Handle dartBoard type
  if (question.specialType === 'dartBoard') {
    console.log("Rendering dart board for question:", question.id);
    return (
      <div className="special-question dart-throw">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="instruction-text">
          Show your passion for sports by throwing arrows at the target.
          <br />
          <small>Click the button below to throw - more throws = more interest!</small>
        </div>
        
        <div className="target-container">
          <svg width="320" height="320">
            {/* Target - Fun, game-like appearance */}
            <g transform="translate(160, 160)">
              <circle cx="0" cy="0" r="120" fill="#212121" />
              <circle cx="0" cy="0" r="118" fill="#e53935" />  {/* Red */}
              <circle cx="0" cy="0" r="95" fill="#212121" />
              <circle cx="0" cy="0" r="93" fill="#43a047" />   {/* Green */}
              <circle cx="0" cy="0" r="70" fill="#212121" />
              <circle cx="0" cy="0" r="68" fill="#1e88e5" />   {/* Blue */}
              <circle cx="0" cy="0" r="45" fill="#212121" />
              <circle cx="0" cy="0" r="43" fill="#ffb300" />   {/* Yellow */}
              <circle cx="0" cy="0" r="20" fill="#212121" />
              <circle cx="0" cy="0" r="18" fill="#e91e63" />   {/* Pink */}
              
              {/* Remove the division lines */}
              
              {/* Bullseye with fun appearance */}
              <circle cx="0" cy="0" r="5" fill="#f5f5f5" />
            </g>
            
            {/* Landed Arrows */}
            {arrows.map((arrow, index) => (
              <PixelArrow 
                key={index} 
                x={160 + arrow.x - 20}  // Centered on hit point
                y={160 + arrow.y - 8}   // Centered on hit point
              />
            ))}
            
            {/* Animating Arrow */}
            {isAnimating && currentArrow && (
              <g className="flying-arrow">
                <PixelArrow x={0} y={152} />
              </g>
            )}
          </svg>

          <style>
            {`
              .flying-arrow {
                transform-origin: center;
                animation: flyToTarget 0.6s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
                filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
              }
              
              @keyframes flyToTarget {
                0% {
                  transform: translate(0px, 0px);
                  opacity: 1;
                }
                100% {
                  transform: translate(${currentArrow ? (160 + currentArrow.targetX - 20) : 0}px, 
                                    ${currentArrow ? (currentArrow.targetY) : 0}px);
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>

        <div className="arrows-count">
          <span className="count-label">Arrows Thrown:</span> 
          <span className="count-number">{arrowsThrown}</span> 
          <span className="count-total">of 10</span>
        </div>

        <button
          onClick={throwArrow}
          disabled={arrowsThrown >= 10 || isAnimating}
          className="throw-button"
        >
          {isAnimating ? 
            <><span className="animation-dot"></span> Throwing...</> : 
            <>🎯 Throw Arrow</>
          }
        </button>

        {arrowsThrown >= 10 && (
          <div className="completion-message">
            <span className="completion-icon">🏆</span> 
            All arrows thrown! Your enthusiasm is impressive!
          </div>
        )}
      </div>
    );
  }

  // Fallback for unknown special types
  return (
    <div className="special-question unknown-type">
      <h3 className="question-text">{question.text}</h3>
      <div>Unknown special question type: {question.specialType}</div>
    </div>
  );
};

const PixelArrow = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Drop shadow */}
    <filter id="shadow">
      <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
    </filter>
    
    <g filter="url(#shadow)">
      {/* Head (metallic) */}
      <polygon 
        points="40,6 32,2 32,10" 
        fill="#9e9e9e" 
        stroke="#616161" 
        strokeWidth="0.5"
      />
      
      {/* Shaft (wooden) */}
      <rect x="8" y="5" width="24" height="6" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />
      
      {/* Fletching */}
      <polygon 
        points="8,0 8,16 0,8" 
        fill="#f44336" 
        stroke="#d32f2f" 
        strokeWidth="0.5"
      />
      <polygon 
        points="4,5 4,11 0,8" 
        fill="#2196f3" 
        stroke="#1976d2" 
        strokeWidth="0.5"
      />
    </g>
  </g>
);

export default SpecialQuestion;