import React, { useState, useEffect, useRef } from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';
import './SpecialQuestion.scss';

// --- PixelArrow Component (Keep as is) ---
const PixelArrow = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <filter id="shadow">
      <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
    </filter>
    <g filter="url(#shadow)">
      <polygon points="40,6 32,1 32,11" fill="#9e9e9e" stroke="#616161" strokeWidth="0.5" />
      <rect x="8" y="4" width="24" height="4" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />
      <rect x="0" y="3" width="8" height="6" fill="#5d4037" stroke="#3e2723" strokeWidth="0.5" />
    </g>
  </g>
);

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question, value, onChange }) => {
  // --- State Hooks (Keep all hooks at the top) ---
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
  const [leftCount, setLeftCount] = useState(() => stones.filter(s => s === 'left').length);
  const [rightCount, setRightCount] = useState(() => stones.filter(s => s === 'right').length);

  // Dart/Bow specific state
  const [arrowsThrown, setArrowsThrown] = useState(value || 0); // Initialize with passed value if dart type
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrows, setArrows] = useState<{ x: number; y: number }[]>([]);
  const [currentArrow, setCurrentArrow] = useState<{ targetX: number; targetY: number } | null>(null);
  const [isDraggingString, setIsDraggingString] = useState(false);
  const [stringPosition, setStringPosition] = useState({ x: -12, y: 0 }); // Resting position
  const bowStringRef = useRef<SVGPathElement>(null);
  const [isTargetHit, setIsTargetHit] = useState(false);
  const [releasedStringPos, setReleasedStringPos] = useState({ x: -12, y: 0 }); // Store release position

  // --- Effects (Keep stone effect) ---
  useEffect(() => {
    if (question.specialType === 'securityWall') {
      setLeftCount(stones.filter((s) => s === 'left').length);
      setRightCount(stones.filter((s) => s === 'right').length);
    }
  }, [stones, question.specialType]);

  // --- Bow Drag Effect ---
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingString && bowStringRef.current) {
        const svgRect = bowStringRef.current.ownerSVGElement!.getBoundingClientRect();
        let relativeX = event.clientX - svgRect.left - 30; // Relative to bow group
        let relativeY = event.clientY - svgRect.top - 160; // Relative to bow group
        relativeX = Math.max(-52, Math.min(-12, relativeX)); // Clamp pull
        relativeY = Math.max(-10, Math.min(10, relativeY)); // Clamp vertical
        setStringPosition({ x: relativeX, y: relativeY });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingString) {
        setIsDraggingString(false);
        setReleasedStringPos(stringPosition); // Store release position for animation
        if (stringPosition.x < -15) { // Shoot only if pulled back enough
           shootArrow();
        } else {
           setStringPosition({ x: -12, y: 0 }); // Reset if not pulled enough
        }
      }
    };

    if (isDraggingString) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      // Only reset visual position if not animating the release
      if (!isAnimating) {
         setStringPosition({ x: -12, y: 0 });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingString, isAnimating, stringPosition]); // Dependencies

  // --- Event Handlers (Keep stone handlers) ---
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
      
      // Update counts
      const newLeftCount = newStones.filter(s => s === 'left').length;
      const newRightCount = newStones.filter(s => s === 'right').length;
      setLeftCount(newLeftCount);
      setRightCount(newRightCount);
      
      // Return right count as the value
      onChange(newRightCount);
    }
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Allow drop
  };

  // --- Bow Handlers ---
  const handleStringMouseDown = (event: React.MouseEvent) => {
    if (arrowsThrown < 10 && !isAnimating && bowStringRef.current) {
      setIsDraggingString(true);
      event.preventDefault();
    }
  };

  const shootArrow = () => {
    if (arrowsThrown < 10 && !isAnimating) {
      setIsAnimating(true); // START animation state

      // Determine target
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 10;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      // Set the target for the current arrow being animated
      setCurrentArrow({ targetX, targetY });

      // Wait for animation duration (0.6s) then update state
      setTimeout(() => {
        const newArrows = [...arrows, { x: targetX, y: targetY }];
        setArrows(newArrows); // Add arrow to landed list

        const newArrowsThrown = arrowsThrown + 1;
        setArrowsThrown(newArrowsThrown); // Increment count

        setIsAnimating(false); // END animation state
        setCurrentArrow(null); // Clear the animating arrow data
        setStringPosition({ x: -12, y: 0 }); // Ensure string visually resets
        onChange(newArrowsThrown); // Notify parent

        // Trigger target wobble
        setIsTargetHit(true);
        setTimeout(() => setIsTargetHit(false), 200);

      }, 600); // MUST match CSS animation duration
    }
  };

  // --- Conditional Rendering ---

  // Handle securityWall type (Keep as is)
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

  // --- Handle dartBoard / dartThrow type ---
  if (question.specialType === 'dartBoard' || question.specialType === 'dartThrow') {

    // --- ALL JAVASCRIPT CALCULATIONS MOVED HERE (Before Return) ---
    // Bow Bending
    const maxPull = 40;
    // Use stringPosition state which is updated by the drag effect
    const pullDistance = Math.abs(stringPosition.x - (-12));
    const pullRatio = Math.min(1, pullDistance / maxPull);
    const bendFactor = 0.6;
    const upperControlX = 48 * (1 - pullRatio * bendFactor);
    const upperControlY = -45 * (1 - pullRatio * bendFactor * 0.5);
    const lowerControlX = 48 * (1 - pullRatio * bendFactor);
    const lowerControlY = 45 * (1 - pullRatio * bendFactor * 0.5);

    // Rotation Calculation
    const calculateAngle = () => {
      if (!currentArrow) return 0; // Needed when not animating
      const startX = 70; const startY = 160; // Approx start point relative to SVG
      const endX = 280 + currentArrow.targetX; const endY = 160 + currentArrow.targetY; // Target point
      const deltaX = endX - startX; const deltaY = endY - startY;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };
    const flightAngle = calculateAngle(); // Calculate angle based on currentArrow
    // --- END OF MOVED CALCULATIONS ---

    return (
      <div className="special-question dart-throw">
        <h3 className="question-text">{question.text}</h3>
        <div className="instruction-text">
          {/* Instruction for drag interaction */}
          <small>Pull the bowstring back and release to shoot - more arrows = more interest!</small>
        </div>

        <div className="target-container">
          <svg width="480" height="320" style={{ userSelect: 'none' }}>
            <defs>
              <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="20%" stopColor="#5d4037" /> <stop offset="80%" stopColor="#8d6e63" />
              </linearGradient>
              <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                 <stop offset="0%" stopColor="#444444" /> <stop offset="80%" stopColor="#333333" /> <stop offset="100%" stopColor="#222222" />
              </radialGradient>
            </defs>

            {/* Background Rects */}
            <rect x="80" y="0" width="400" height="320" rx="8" fill="url(#bgGradient)" />
            <rect x="80" y="0" width="400" height="320" rx="8" fill="none" stroke="#555" strokeWidth="2" />

            {/* Target - Apply wobble class */}
            {/* FIX: Added className for wobble */}
            <g transform="translate(280, 160)" className={isTargetHit ? 'target-hit' : ''}>
               {/* Outer ring */}
               <circle cx="0" cy="0" r="120" fill="#212121" /> <circle cx="0" cy="0" r="118" fill="#9e9e9e" />
               {/* Second ring */}
               <circle cx="0" cy="0" r="95" fill="#212121" /> <circle cx="0" cy="0" r="93" fill="#757575" />
               {/* Third ring */}
               <circle cx="0" cy="0" r="70" fill="#212121" /> <circle cx="0" cy="0" r="68" fill="#616161" />
               {/* Fourth ring */}
               <circle cx="0" cy="0" r="45" fill="#212121" /> <circle cx="0" cy="0" r="43" fill="#424242" />
               {/* Fifth ring */}
               <circle cx="0" cy="0" r="20" fill="#212121" /> <circle cx="0" cy="0" r="18" fill="#323232" />
               {/* Accent ring */}
               <circle cx="0" cy="0" r="12" fill="#212121" /> <circle cx="0" cy="0" r="10" fill="#e65100" />
               {/* Bullseye */}
               <circle cx="0" cy="0" r="5" fill="#000000" /> <circle cx="0" cy="0" r="2" fill="#ffffff" />
            </g>

            {/* Bow */}
            <g className="bow" transform="translate(30, 160)">
              {/* REMOVED calculation code from here */}
              {/* Use calculated variables for bow paths */}
              <path d={`M5,-80 Q${upperControlX},${upperControlY} 10,0`} stroke="url(#bowGradient)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d={`M5,80 Q${lowerControlX},${lowerControlY} 10,0`} stroke="url(#bowGradient)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <rect x="0" y="-15" width="10" height="30" fill="#4e342e" rx="3" />
              {/* Bow string - Use stringPosition state directly */}
              <path
                ref={bowStringRef}
                className={isAnimating ? 'bowstring animating' : 'bowstring'}
                // Use the stringPosition state directly for the pulled position
                d={`M5,-80 L${isDraggingString ? stringPosition.x : (isAnimating ? 15 : -12)},${isDraggingString ? stringPosition.y : 0} L5,80`}
                stroke="#e0e0e0"
                strokeWidth="1.5"
                fill="none"
                onMouseDown={handleStringMouseDown}
                style={{ cursor: arrowsThrown >= 10 || isAnimating ? 'default' : 'pointer' }}
              />

              {/* String wrappings at the tips */}
              <circle cx="5" cy="-80" r="2" fill="#5d4037" />
              <circle cx="5" cy="80" r="2" fill="#5d4037" />
            </g>

            {/* Arrow nocked on string while dragging */}
            {isDraggingString && stringPosition.x < -12 && !isAnimating && (
              <g transform={`translate(${30 + stringPosition.x + 5}, ${160 + stringPosition.y - 8})`}>
                {/* Position arrow slightly behind the string pull point */}
                <PixelArrow x={0} y={0} />
              </g>
            )}

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
              // Set the starting position via transform
              <g className="flying-arrow" transform="translate(40, 152)">
                {/* Place the arrow at the group's origin */}
                <PixelArrow x={0} y={0} />
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
                transform-origin: 8px 8px; // Set rotation origin to approx center of arrow
                animation: flyToTarget 0.6s cubic-bezier(0.4, 0.1, 0.8, 0.2) forwards; // Adjusted bezier for arc feel
                filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
              }
              
              // Add rotation calculation
              const calculateAngle = () => {
                if (!currentArrow) return 0;
                // Start point approx: bow x=30 + arrow offset x=40 = 70
                // Start point approx: bow y=160 + arrow offset y=152 = 312 (relative to SVG top-left)
                // Target point: target center x=280 + targetX offset
                // Target point: target center y=160 + targetY offset
                const startX = 70;
                const startY = 160; // Arrow starts vertically centered with bow string pull point
                const endX = 280 + currentArrow.targetX;
                const endY = 160 + currentArrow.targetY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                return Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Angle in degrees
              };
              const flightAngle = calculateAngle();

              // Update the @keyframes flyToTarget
              @keyframes flyToTarget {
                0% {
                  transform: translate(0px, 0px) rotate(${flightAngle}deg); // Add rotation
                  opacity: 1;
                }
                100% {
                  transform: translate(${currentArrow ? (240 + currentArrow.targetX) : 0}px,
                                    ${currentArrow ? (8 + currentArrow.targetY) : 0}px) rotate(${flightAngle}deg); // Add rotation
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
          onClick={shootArrow}
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

export default SpecialQuestion;