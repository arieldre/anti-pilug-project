import React, { useState, useEffect } from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';
import './SpecialQuestion.scss';

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question, value, onChange }) => {
  // Common state for all question types
  const [stones, setStones] = useState<('left' | 'right')[]>(() => {
    if (question.specialType === 'securityWall') {
      const totalStones = question.options?.totalStones || 12;
      const initialStones = Array(totalStones).fill('left');
      if (value && typeof value === 'number') {
        for (let i = 0; i < value && i < totalStones; i++) {
          initialStones[i] = 'right';
        }
      }
      return initialStones;
    }
    return Array(question.options?.totalStones || 12).fill('left');
  });
  
  // States for stone wall
  const [leftCount, setLeftCount] = useState(stones.filter(s => s === 'left').length);
  const [rightCount, setRightCount] = useState(stones.filter(s => s === 'right').length);
  
  // States for dart throw
  const [arrows, setArrows] = useState<{x: number, y: number}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const maxArrows = 10; // Maximum score is 10
  
  // Track which stone is being dragged
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Update counts when stones change
  useEffect(() => {
    setLeftCount(stones.filter(s => s === 'left').length);
    setRightCount(stones.filter(s => s === 'right').length);
  }, [stones]);

  // Update the score whenever arrows change for dart throw
  useEffect(() => {
    if (question.specialType === 'dartThrow') {
      // Score is simply the number of arrows thrown
      onChange(arrows.length);
    }
  }, [arrows, onChange, question.specialType]);

  // IMPROVED DRAG AND DROP HANDLERS
  const handleStoneClick = (index: number) => {
    const newStones = [...stones];
    // Toggle the stone's position
    newStones[index] = newStones[index] === 'left' ? 'right' : 'left';
    setStones(newStones);
    
    // Update the score based on stones on the right
    const newRightCount = newStones.filter(s => s === 'right').length;
    onChange(newRightCount);
  };
  
  const handleDragStart = (event: React.DragEvent, index: number) => {
    // Store the stone's index
    event.dataTransfer.setData('stone-index', index.toString());
    
    // Set a custom drag image (invisible 1x1 pixel)
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
    
    // Track the dragged stone
    setDraggedIndex(index);
    
    // Add a class to show which stone is being dragged
    const element = event.currentTarget as HTMLElement;
    element.classList.add('dragging');
    
    // Add effect allowed
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    // Clear dragged stone tracking
    setDraggedIndex(null);
    
    // Remove dragging class from all stones
    document.querySelectorAll('.stone').forEach(stone => {
      stone.classList.remove('dragging');
    });
    
    // Remove dragover class from drop zones
    document.querySelectorAll('.stone-drop-zone').forEach(zone => {
      zone.classList.remove('dragover');
    });
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    // Allow dropping
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    // Add visual feedback
    event.currentTarget.classList.add('dragover');
  };
  
  const handleDragLeave = (event: React.DragEvent) => {
    // Remove visual feedback
    event.currentTarget.classList.remove('dragover');
  };
  
  const handleDrop = (event: React.DragEvent, targetSide: 'left' | 'right') => {
    event.preventDefault();
    
    // Get the index of the dropped stone
    const indexStr = event.dataTransfer.getData('stone-index');
    const index = parseInt(indexStr, 10);
    
    // Validate the index
    if (!isNaN(index) && index >= 0 && index < stones.length) {
      // Skip if already on target side
      if (stones[index] === targetSide) {
        return;
      }
      
      // Update the stone's position
      const newStones = [...stones];
      newStones[index] = targetSide;
      setStones(newStones);
      
      // Update the score
      const newRightCount = newStones.filter(s => s === 'right').length;
      onChange(newRightCount);
    }
    
    // Clean up
    setDraggedIndex(null);
    event.currentTarget.classList.remove('dragover');
    document.querySelectorAll('.stone').forEach(stone => {
      stone.classList.remove('dragging');
    });
  };

  // Event handlers for dart throw
  const throwDart = () => {
    if (arrows.length >= maxArrows || isAnimating) return;
    
    setIsAnimating(true);
    
    // Calculate random position within the dartboard
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 90;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    // Play the bow animation
    const bowPath = document.querySelector('.bow-container path:first-child');
    const bowString = document.querySelector('.bowstring');
    
    if (bowPath && bowString) {
      // Reset animations to ensure they play again
      bowPath.classList.remove('bow-string-drawn');
      bowString.classList.remove('animating');
      
      // Force reflow
      void bowPath.getBoundingClientRect();
      void bowString.getBoundingClientRect();
      
      // Start animations
      bowPath.classList.add('bow-string-drawn');
      bowString.classList.add('animating');
    }
    
    // Wait for animation to complete before showing the landed arrow
    setTimeout(() => {
      // Add the new arrow at the randomly calculated position
      setArrows(prev => [...prev, {x, y}]);
      setIsAnimating(false);
    }, 500); // Time should match animation duration
  };
  
  const resetDarts = () => {
    setArrows([]);
    onChange(0);
  };

  // Render different question types
  if (question.specialType === 'securityWall' && question.options?.leftSide && question.options?.rightSide) {
    return (
      <div className="special-question security-wall">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="wall-sides">
          <div className="wall-side left">
            <div className="side-header">
              <span className="icon">{question.options.leftSide.icon}</span>
              <h3>{question.options.leftSide.label}</h3>
            </div>
            <p>{question.options.leftSide.description}</p>
            <div className="count">Current: {leftCount}</div>
            
            <div 
              className="stone-drop-zone left-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                handleDrop(e, 'left');
                e.currentTarget.classList.remove('dragover');
              }}
            >
              {stones.map((stone, i) => (
                stone === 'left' && (
                  <div
                    key={i}
                    className={`stone ${stone}`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleStoneClick(i)} // Add this line to use handleStoneClick
                  >
                    <div className="stone-texture"></div>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="wall-divider">
            <div className="divider-line"></div>
            <div className="drag-instruction">
              Drag stones to indicate your political position
            </div>
          </div>
          
          <div className="wall-side right">
            <div className="side-header">
              <span className="icon">{question.options.rightSide.icon}</span>
              <h3>{question.options.rightSide.label}</h3>
            </div>
            <p>{question.options.rightSide.description}</p>
            <div className="count">Current: {rightCount}</div>
            
            <div 
              className="stone-drop-zone right-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                handleDrop(e, 'right');
                e.currentTarget.classList.remove('dragover');
              }}
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

        <div className="drag-helper">
          <div className="drag-hand"></div>
          <div className="drag-text">Drag stones between sides</div>
        </div>

        <div className="score-display">
          <p>Your score: <strong>{10 - leftCount}</strong> out of 10</p> {/* Change from 12 to 10 */}
          <p className="score-explanation">
            (More stones removed = stronger agreement with {question.options.rightSide.label})
          </p>
        </div>
      </div>
    );
  }

  if (question.specialType === 'dartThrow') {
    return (
      <div className="special-question dart-throw">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="dartboard-container">
          {/* Bow on the left side */}
          <div className="bow-container">
            <svg width="120" height="160" viewBox="0 0 100 120">
              {/* Bow */}
              <path 
                d="M 15,-60 Q -20,0 15,60" 
                stroke="#8B4513" 
                strokeWidth="8" 
                fill="none"
                className={isAnimating ? 'bow-string-drawn' : ''}
              />
              {/* Bowstring */}
              <path 
                d="M 15,-60 L 15,60" 
                stroke="#000000" 
                strokeWidth="1.5" 
                fill="none"
                className={isAnimating ? 'bowstring animating' : 'bowstring'}
              />
            </svg>
          </div>

          {/* Dartboard SVG */}
          <svg width="300" height="300" viewBox="-100 -100 200 200">
            {/* Dartboard rings */}
            <circle cx="0" cy="0" r="100" fill="#f3f3f3" stroke="#d0d0d0" strokeWidth="2" />
            <circle cx="0" cy="0" r="80" fill="#e0e0e0" stroke="#d0d0d0" strokeWidth="2" />
            <circle cx="0" cy="0" r="60" fill="#d0d0d0" stroke="#c0c0c0" strokeWidth="2" />
            <circle cx="0" cy="0" r="40" fill="#c0c0c0" stroke="#b0b0b0" strokeWidth="2" />
            <circle cx="0" cy="0" r="20" fill="#b0b0b0" stroke="#a0a0a0" strokeWidth="2" />
            <circle cx="0" cy="0" r="10" fill="#FF9800" stroke="#FF8800" strokeWidth="2" />
            
            {/* Thrown arrows */}
            {arrows.map((arrow, i) => (
              <g key={i} transform={`translate(${arrow.x}, ${arrow.y})`}>
                <line x1="-20" y1="0" x2="3" y2="0" stroke="#8B4513" strokeWidth="3" /> {/* Arrow shaft - thicker */}
                <polygon points="3,0 -2,-5 -5,0 -2,5" fill="#8B4513" /> {/* Arrow head points right - larger */}
                <line x1="-20" y1="0" x2="-16" y2="-4" stroke="#8B4513" strokeWidth="1.5" /> {/* Feather */}
                <line x1="-20" y1="0" x2="-16" y2="4" stroke="#8B4513" strokeWidth="1.5" /> {/* Feather */}
              </g>
            ))}
          </svg>
            
          {/* Animated arrow when shooting */}
          {isAnimating && (
            <div className="flying-arrow-container">
              <svg className="flying-arrow" width="40" height="10" viewBox="-20 -5 40 10">
                <line x1="-20" y1="0" x2="3" y2="0" stroke="#8B4513" strokeWidth="3" /> {/* Arrow shaft */}
                <polygon points="3,0 -2,-5 -5,0 -2,5" fill="#8B4513" /> {/* Arrow head */}
                <line x1="-20" y1="0" x2="-16" y2="-4" stroke="#8B4513" strokeWidth="1.5" /> {/* Feather */}
                <line x1="-20" y1="0" x2="-16" y2="4" stroke="#8B4513" strokeWidth="1.5" /> {/* Feather */}
              </svg>
            </div>
          )}
        </div>
        
        <div className="instructions">
          <p>Shoot arrows at the target (0-10) to show your interest in sports.</p>
          <p>More arrows = more interest!</p>
        </div>
        
        <div className="controls">
          <button 
            className="throw-button" 
            onClick={throwDart}
            disabled={arrows.length >= maxArrows || isAnimating}
          >
            Shoot Arrow
          </button>
          
          <button 
            className="reset-button"
            onClick={resetDarts}
            disabled={arrows.length === 0 || isAnimating}
          >
            Reset
          </button>
        </div>
        
        <div className="score">
          <p>Your sports interest score: <strong>{arrows.length}</strong>/10</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SpecialQuestion;