import React, { useState, useEffect } from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';
import './SpecialQuestion.scss';

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question, value, onChange }) => {
  // Move ALL hooks to the top level - no conditionals
  // Initialize stones based on question type
  const [stones, setStones] = useState<('left' | 'right')[]>(() => {
    if (question.specialType === 'securityWall') {
      const totalStones = question.options?.totalStones || 10;
      const initialStones = Array(totalStones).fill('left');
      
      // Initialize with saved value
      if (value && typeof value === 'number') {
        for (let i = 0; i < value && i < totalStones; i++) {
          initialStones[i] = 'right';
        }
      }
      return initialStones;
    }
    return Array(question.options?.totalStones || 10).fill('left');
  });
  
  const [leftCount, setLeftCount] = useState(stones.filter(s => s === 'left').length);
  const [rightCount, setRightCount] = useState(stones.filter(s => s === 'right').length);
  const [arrowsThrown, setArrowsThrown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrows, setArrows] = useState<{ x: number; y: number }[]>([]);
  const [currentArrow, setCurrentArrow] = useState<{ targetX: number; targetY: number } | null>(null);

  // Update counts when stones change
  useEffect(() => {
    if (question.specialType === 'securityWall') {
      setLeftCount(stones.filter((s) => s === 'left').length);
      setRightCount(stones.filter((s) => s === 'right').length);
    }
  }, [stones, question.specialType]);

  // Handle drag start
  const handleDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
    // Set drag image (optional)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(img, 0, 0);
    
    // Add visual feedback class
    const element = event.currentTarget as HTMLElement;
    element.classList.add('dragging');
  };
  
  // Handle drag end to remove visual styling
  const handleDragEnd = (event: React.DragEvent) => {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('dragging');
  };
  
  // Handle drop on a zone
  const handleDrop = (event: React.DragEvent, targetSide: 'left' | 'right') => {
    event.preventDefault();
    const index = parseInt(event.dataTransfer.getData('text/plain'));
    if (!isNaN(index) && index >= 0 && index < stones.length) {
      const newStones = [...stones];
      newStones[index] = targetSide;
      setStones(newStones);
      
      // Update counts
      const newLeftCount = newStones.filter(s => s === 'left').length;
      const newRightCount = newStones.filter(s => s === 'right').length;
      setLeftCount(newLeftCount);
      setRightCount(newRightCount);
      
      // Return right count as the value
      onChange(newRightCount);
    }
  };
  
  // Handle drag over
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
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

  // Updated SecurityWall component with better drag handling
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
            
            {/* Drop zone for left side */}
            <div 
              className="stone-drop-zone left-zone"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'left')}
            >
              {stones.map((stone, i) => (
                stone === 'left' && (
                  <div
                    key={i}
                    className={`stone ${stone}`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="stone-texture"></div>
                  </div>
                )
              ))}
            </div>
          </div>
          
          {/* Central wall divider */}
          <div className="wall-divider">
            <div className="divider-line"></div>
            <div className="drag-instruction">
              Drag stones to indicate your political position
            </div>
          </div>
          
          <div className="wall-side right">
            <div className="side-header">
              <span className="icon">{question.options?.rightSide.icon}</span>
              <h3>{question.options?.rightSide.label}</h3>
            </div>
            <p>{question.options?.rightSide.description}</p>
            <div className="count">Current: {rightCount}</div>
            
            {/* Drop zone for right side */}
            <div 
              className="stone-drop-zone right-zone"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'right')}
            >
              {stones.map((stone, i) => (
                stone === 'right' && (
                  <div
                    key={i}
                    className={`stone ${stone}`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="stone-texture"></div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
  
        {/* Add visual indicator for drag instruction */}
        <div className="drag-helper">
          <div className="drag-hand"></div>
          <div className="drag-text">Drag stones between sides</div>
        </div>
      </div>
    );
  }

  // Handle dartBoard type
  if (question.specialType === 'dartBoard' || question.specialType === 'dartThrow') {
    return (
      <div className="special-question dart-throw">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="instruction-text">
          Show your passion for sports by shooting arrows at the target.
          <br />
          <small>Click the button below to shoot - more arrows = more interest!</small>
        </div>
        
        <div className="target-container">
          <svg width="480" height="320">
            <defs>
              <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="20%" stopColor="#5d4037" />
                <stop offset="80%" stopColor="#8d6e63" />
              </linearGradient>
              
              {/* Add this new gradient for the background */}
              <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#444444" />
                <stop offset="80%" stopColor="#333333" />
                <stop offset="100%" stopColor="#222222" />
              </radialGradient>
            </defs>
            
            {/* Replace the rectangle with this */}
            <rect x="80" y="0" width="400" height="320" rx="8" fill="url(#bgGradient)" />
            <rect x="80" y="0" width="400" height="320" rx="8" fill="url(#bgGradient)" 
                  stroke="#555" strokeWidth="2" />
            
            {/* Target - Centered in the grey area */}
            <g transform="translate(280, 160)">
              {/* Outer ring - medium grey (darkened from light grey) */}
              <circle cx="0" cy="0" r="120" fill="#212121" />
              <circle cx="0" cy="0" r="118" fill="#9e9e9e" />
              
              {/* Second ring - darker grey */}
              <circle cx="0" cy="0" r="95" fill="#212121" />
              <circle cx="0" cy="0" r="93" fill="#757575" />
              
              {/* Third ring - very dark grey */}
              <circle cx="0" cy="0" r="70" fill="#212121" />
              <circle cx="0" cy="0" r="68" fill="#616161" />
              
              {/* Fourth ring - extremely dark grey */}
              <circle cx="0" cy="0" r="45" fill="#212121" />
              <circle cx="0" cy="0" r="43" fill="#424242" />
              
              {/* Fifth ring - nearly black */}
              <circle cx="0" cy="0" r="20" fill="#212121" />
              <circle cx="0" cy="0" r="18" fill="#323232" />
              
              {/* Accent ring - darker orange for maturity */}
              <circle cx="0" cy="0" r="12" fill="#212121" />
              <circle cx="0" cy="0" r="10" fill="#e65100" />
              
              {/* Bullseye - black with small white center */}
              <circle cx="0" cy="0" r="5" fill="#000000" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" />
            </g>

            {/* Bow on the left - OUTSIDE the rectangle */}
            <g className="bow" transform="translate(30, 160)">
              {/* Bow gradient definition */}
              <defs>
                <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="20%" stopColor="#5d4037" />
                  <stop offset="80%" stopColor="#8d6e63" />
                </linearGradient>
              </defs>
              
              {/* Upper limb with curve - bigger */}
              <path 
                d="M5,-80 Q48,-45 10,0" 
                stroke="url(#bowGradient)" 
                strokeWidth="10" 
                fill="none" 
                strokeLinecap="round"
              />
              
              {/* Lower limb with curve - bigger */}
              <path 
                d="M10,0 Q48,45 5,80" 
                stroke="url(#bowGradient)" 
                strokeWidth="10" 
                fill="none" 
                strokeLinecap="round"
              />
              
              {/* Center grip decoration - bigger */}
              <rect x="7" y="-18" width="7" height="36" rx="2" fill="#3e2723" />
              <rect x="9" y="-15" width="3" height="30" rx="1" fill="#8d6e63" />
              
              {/* Bow string - will animate when shooting - longer */}
              <path 
                className={isAnimating ? 'bowstring animating' : 'bowstring'}
                d="M5,-80 L-12,0 L5,80" 
                stroke="#e0e0e0" 
                strokeWidth="1.5" 
                fill="none"
              />
              
              {/* String wrappings at the tips */}
              <circle cx="5" cy="-80" r="2" fill="#5d4037" />
              <circle cx="5" cy="80" r="2" fill="#5d4037" />
            </g>

            {/* Landed Arrows on target */}
            {arrows.map((arrow, index) => (
              <PixelArrow 
                key={index} 
                x={280 + arrow.x - 40}  // Adjusted to match new target center (280)
                y={160 + arrow.y - 8}
              />
            ))}
            
            {/* Animating Arrow - starts from bow position */}
            {isAnimating && currentArrow && (
              <g className="flying-arrow">
                <PixelArrow x={40} y={152} />
              </g>
            )}
          </svg>

          <style>
            {`
              .bowstring {
                transition: d 0.1s ease-out;
              }
              
              .bowstring.animating {
                d: path('M5,-60 L15,0 L5,60');
                animation: releaseString 0.6s forwards;
              }
              
              @keyframes releaseString {
                0% { d: path('M5,-60 L15,0 L5,60'); }
                15% { d: path('M5,-60 L10,0 L5,60'); }
                100% { d: path('M5,-60 L10,0 L5,60'); }
              }
              
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
                  transform: translate(${currentArrow ? (280 + currentArrow.targetX - 80) : 0}px, 
                                    ${currentArrow ? (currentArrow.targetY) : 0}px);
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>

        <div className="arrows-count">
          <span className="count-label">Arrows Shot:</span> 
          <span className="count-number">{arrowsThrown}</span> 
          <span className="count-total">of 10</span>
        </div>

        <button
          onClick={throwArrow}
          disabled={arrowsThrown >= 10 || isAnimating}
          className="throw-button"
        >
          {isAnimating ? 
            <><span className="animation-dot"></span> Shooting...</> : 
            <>🏹 Shoot Arrow</>
          }
        </button>

        {arrowsThrown >= 10 && (
          <div className="completion-message">
            <span className="completion-icon">🏆</span> 
            All arrows shot! Your enthusiasm is impressive!
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
      {/* Arrow head (metallic) */}
      <polygon 
        points="40,6 32,1 32,11" 
        fill="#9e9e9e" 
        stroke="#616161" 
        strokeWidth="0.5"
      />
      
      {/* Shaft (wooden) */}
      <rect x="8" y="4" width="24" height="4" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />
      
      {/* Simple nock at the end */}
      <rect x="0" y="3" width="8" height="6" fill="#5d4037" stroke="#3e2723" strokeWidth="0.5" />
    </g>
  </g>
);

export default SpecialQuestion;