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
      if (value && typeof value === 'number') {
        const initialStones = Array(10).fill('left');
        for (let i = 0; i < value; i++) {
          if (i < initialStones.length) initialStones[i] = 'right';
        }
        return initialStones;
      }
      return Array(10).fill('left');
    }
    return Array(question.options?.totalStones || 12).fill('left');
  });
  
  const [leftCount, setLeftCount] = useState(stones.filter(s => s === 'left').length);
  const [rightCount, setRightCount] = useState(stones.filter(s => s === 'right').length);
  const [arrowsThrown, setArrowsThrown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrows, setArrows] = useState<{ x: number; y: number }[]>([]);
  const [currentArrow, setCurrentArrow] = useState<{ x: number; y: number } | null>(null);

  // Update counts when stones change
  useEffect(() => {
    setLeftCount(stones.filter(s => s === 'left').length);
    setRightCount(stones.filter(s => s === 'right').length);
  }, [stones]);

  // Initialize stones based on value for security wall
  useEffect(() => {
    if (question.specialType === 'securityWall' && value > 0) {
      const newStones = [...stones];
      for (let i = 0; i < value && i < newStones.length; i++) {
        newStones[i] = 'right';
      }
      setStones(newStones);
    }
  }, [question.specialType, value, stones.length]);

  // Event handlers
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
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 90;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      setCurrentArrow({ x, y });

      setTimeout(() => {
        const newArrows = [...arrows, { x, y }];
        setArrows(newArrows);
        
        const newArrowsThrown = arrowsThrown + 1;
        setArrowsThrown(newArrowsThrown);
        setIsAnimating(false);
        setCurrentArrow(null);
        
        onChange(newArrowsThrown);
      }, 600);
    }
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    event.dataTransfer.setDragImage(img, 0, 0);
    
    const element = event.currentTarget as HTMLElement;
    element.classList.add('dragging');
  };
  
  const handleDragEnd = (event: React.DragEvent) => {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('dragging');
  };
  
  const handleDrop = (event: React.DragEvent, targetSide: 'left' | 'right') => {
    event.preventDefault();
    const index = parseInt(event.dataTransfer.getData('text/plain'));
    if (!isNaN(index) && index >= 0 && index < stones.length) {
      const newStones = [...stones];
      newStones[index] = targetSide;
      setStones(newStones);
      
      const newRightCount = newStones.filter(s => s === 'right').length;
      onChange(newRightCount);
    }
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
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

        <div className="drag-helper">
          <div className="drag-hand"></div>
          <div className="drag-text">Drag stones between sides</div>
        </div>
      </div>
    );
  }

  if (question.specialType === 'dartThrow') {
    return (
      <div className="special-question dart-throw">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="instruction-text">
          Show your passion for sports by shooting arrows at the target.
          <br />
          <small>Click the button below to shoot - more arrows = more interest!</small>
        </div>
        
        <div className="target-container">
          <svg width="420" height="320">
            <g transform="translate(210, 160)">
              <circle cx="0" cy="0" r="120" fill="#212121" />
              <circle cx="0" cy="0" r="118" fill="#e53935" />
              <circle cx="0" cy="0" r="95" fill="#212121" />
              <circle cx="0" cy="0" r="93" fill="#43a047" />
              <circle cx="0" cy="0" r="70" fill="#212121" />
              <circle cx="0" cy="0" r="68" fill="#1e88e5" />
              <circle cx="0" cy="0" r="45" fill="#212121" />
              <circle cx="0" cy="0" r="43" fill="#ffb300" />
              <circle cx="0" cy="0" r="20" fill="#212121" />
              <circle cx="0" cy="0" r="18" fill="#e91e63" />
              <circle cx="0" cy="0" r="5" fill="#f5f5f5" />
            </g>
            
            {arrows.map((arrow, index) => (
              <g key={index} transform={`translate(210, 160)`}>
                <line
                  x1="0"
                  y1="0"
                  x2={arrow.x}
                  y2={arrow.y}
                  stroke="#ffd700"
                  strokeWidth="2"
                />
                <circle
                  cx={arrow.x}
                  cy={arrow.y}
                  r="3"
                  fill="#ffd700"
                />
              </g>
            ))}
          </svg>
        </div>
        
        <button 
          className="throw-button"
          onClick={throwArrow}
          disabled={isAnimating || arrowsThrown >= 10}
        >
          {isAnimating ? 'Throwing...' : `Throw Arrow (${arrowsThrown}/10)`}
        </button>
      </div>
    );
  }

  return null;
};

export default SpecialQuestion;