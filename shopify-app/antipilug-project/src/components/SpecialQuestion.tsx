import React, { useState, useEffect } from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';
import './SpecialQuestion.scss';

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question, onChange }) => {
  const [stones, setStones] = useState<'left' | 'right'[]>(Array(question.options?.totalStones || 12).fill('left') as ('left' | 'right')[]);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [dartScore, setDartScore] = useState(0);
  const [arrowsThrown, setArrowsThrown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrows, setArrows] = useState<{ x: number; y: number }[]>([]);
  const [currentArrow, setCurrentArrow] = useState<{ targetX: number; targetY: number } | null>(null);

  useEffect(() => {
    setLeftCount(stones.filter((s) => s === 'left').length);
    setRightCount(stones.filter((s) => s === 'right').length);
  }, [stones]);

  const handleStoneClick = (index: number) => {
    const newStones = [...stones];
    newStones[index] = newStones[index] === 'left' ? 'right' : 'left';
    setStones(newStones);
    onChange(newStones.filter((s) => s === 'right').length);
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
        setArrows([...arrows, { x: targetX, y: targetY }]);
        setArrowsThrown(arrowsThrown + 1);
        setIsAnimating(false);
        setCurrentArrow(null);
        setDartScore(dartScore + calculateScore(targetX, targetY));
        onChange(arrowsThrown + 1); // Update enthusiasm count
      }, 600);
    }
  };

  const calculateScore = (x: number, y: number) => {
    const distance = Math.sqrt(x * x + y * y);
    if (distance < 25) return 100;
    if (distance < 50) return 50;
    return 10;
  };

  if (question.specialType === 'securityWall') {
    return (
      <div className="special-question security-wall">
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

  if (question.specialType === 'dartThrow') {
    return (
      <div className="special-question dart-throw">
        <div className="text-xl font-bold my-4 px-4 py-2 bg-white rounded shadow">
          Your enthusiasm for sports is shown by how many arrows you throw.
        </div>
        <div className="relative w-[320px] h-[320px] bg-gray-300 rounded-lg shadow-lg">
          <svg width="320" height="320">
            {/* Target */}
            <g transform="translate(160, 160)">
              <rect x="-102" y="-102" width="204" height="204" fill="#000000" />
              <rect x="-100" y="-100" width="200" height="200" fill="#ff0000" />
              <rect x="-77" y="-77" width="154" height="154" fill="#000000" />
              <rect x="-75" y="-75" width="150" height="150" fill="#ffffff" />
              <rect x="-52" y="-52" width="104" height="104" fill="#000000" />
              <rect x="-50" y="-50" width="100" height="100" fill="#ff0000" />
              <rect x="-27" y="-27" width="54" height="54" fill="#000000" />
              <rect x="-25" y="-25" width="50" height="50" fill="#ffff00" />
            </g>
            
            {/* Stand */}
            <rect x="110" y="280" width="100" height="20" fill="#333" />
            <rect x="140" y="270" width="40" height="10" fill="#444" />
            
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
                animation: flyToTarget 0.6s cubic-bezier(0.3, 0, 0.7, 1) forwards;
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

        <div className="text-xl font-bold my-4 px-4 py-2 bg-white rounded shadow">
          Arrows Thrown: {arrowsThrown}/10
        </div>

        <button
          onClick={throwArrow}
          disabled={arrowsThrown >= 10 || isAnimating}
          className={`px-8 py-3 rounded-lg text-lg shadow-lg ${
            arrowsThrown >= 10 || isAnimating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white transform transition-transform hover:scale-105'
          }`}
        >
          {isAnimating ? 'Flying...' : 'Throw Arrow'}
        </button>

        {arrowsThrown >= 10 && (
          <div className="mt-4 text-green-600 text-lg font-semibold bg-white px-4 py-2 rounded shadow">
            All arrows thrown! Thank you for sharing your enthusiasm!
          </div>
        )}
      </div>
    );
  }

  return null;
};

const PixelArrow = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Head (gray) */}
    <rect x="36" y="6" width="4" height="4" fill="#666666" />
    <rect x="32" y="4" width="4" height="8" fill="#666666" />
    <rect x="28" y="2" width="4" height="12" fill="#666666" />
    
    {/* Shaft (brown) */}
    <rect x="8" y="6" width="20" height="4" fill="#8B4513" />
    
    {/* Fletching (brown & gray) */}
    <rect x="4" y="4" width="4" height="8" fill="#A0522D" />
    <rect x="0" y="2" width="4" height="12" fill="#666666" />
  </g>
);

export default SpecialQuestion;