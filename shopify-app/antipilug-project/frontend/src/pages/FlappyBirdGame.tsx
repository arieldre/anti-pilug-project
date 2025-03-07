import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import './FlappyBirdGame.scss';

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 40;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const BASE_PIPE_SPEED = 3;
const PIPES_PER_LEVEL = 5;
const INITIAL_PIPE_DISTANCE = GAME_WIDTH + 100;
const FRAME_TIME = 1000 / 60;
const RESET_DELAY = 100;
const HIGH_SCORE_KEY = 'flappyHighScore';

// Cloud constants
const NUM_CLOUDS = 4;
const MIN_CLOUD_SIZE = 40;
const MAX_CLOUD_SIZE = 80;
const MIN_CLOUD_SPEED = 0.2;
const MAX_CLOUD_SPEED = 0.8;

// Visual effect constants
const FLASH_DURATION = 100;
const SCORE_POPUP_DURATION = 1000;

// Coin constants
const COIN_SIZE = 30;
const COIN_FREQUENCY = 200; // Higher number = less frequent (was 6)
const COIN_VALUE = 2; 

// Add after existing constants
const WEATHER_TYPES = ['sunny', 'windy', 'rainy', 'snowy', 'foggy', 'night'] as const;
type WeatherType = typeof WEATHER_TYPES[number];

// Add this after your other constants at the top of the file
// Weather-specific pipe colors
const PIPE_COLORS = {
  'sunny': '#4CAF50',  // Classic green
  'rainy': '#3498db',  // Blue
  'snowy': '#a8d5ff',  // Light blue
  'foggy': '#b8b8b8',  // Gray
  'windy': '#d2b48c',  // Tan/brown
  'night': '#1a1a3a',  // Dark blue
};

// Add these constants at the top with your other constants
const SKY_COLORS = {
  'sunny': ['#87CEEB', '#1E90FF'],
  'rainy': ['#708090', '#4682B4'],
  'snowy': ['#E0FFFF', '#B0E0E6'],
  'foggy': ['#DCDCDC', '#A9A9A9'],
  'windy': ['#ADD8E6', '#87CEEB'],
  'night': ['#191970', '#000033']
};

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface ScorePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  opacity: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  rotation: number;
}

// 1. Add this interface with your other interfaces at the top of the file:
interface Feather {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  color: string;
}

// Add these interfaces with your other interfaces
interface Mountain {
  id: number;
  x: number;
  height: number;
  width: number;
  color: string;
  snowCapped: boolean;
}

interface Hill {
  id: number;
  x: number;
  height: number;
  width: number;
  color: string;
}

const FlappyBirdGame: React.FC = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0');
  });
  const [level, setLevel] = useState(1);
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinCount, setCoinCount] = useState(0);
  
  // Add to component state
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('sunny');
  const [weatherParticles, setWeatherParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const particleIdRef = useRef(0);
  
  // Fix 1: Add a reference to track when weather changes happened
  const lastWeatherChangeRef = useRef(0);
  
  // Refs
  const velocityRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const cloudIdRef = useRef(0);
  const lastBirdPosRef = useRef(GAME_HEIGHT / 2);
  const isResettingRef = useRef(false);
  const popupIdRef = useRef(0);
  const coinIdRef = useRef(0);

  // 2. Add feather state and ref with your other states:
  const [feathers, setFeathers] = useState<Feather[]>([]);
  const featherIdRef = useRef(0);

  // Add these to the FlappyBird component state declarations
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [hills, setHills] = useState<Hill[]>([]);
  const [transitioningWeather, setTransitioningWeather] = useState(false);
  const [skyGradient, setSkyGradient] = useState<string[]>(SKY_COLORS.sunny);
  const mountainIdRef = useRef(0);
  const hillIdRef = useRef(0);

  // Add these state variables to your component
  const [birdExpression, setBirdExpression] = useState('normal'); // 'normal', 'happy', 'worried', 'surprised'
  const [eyeBlink, setEyeBlink] = useState(false);
  const [wingPosition, setWingPosition] = useState(0); // 0-3 for wing animation
  const [birdRotation, setBirdRotation] = useState(0);
  const [isShivering, setIsShivering] = useState(false);

  // Add these refs
  const blinkTimerRef = useRef<NodeJS.Timeout>();
  const wingTimerRef = useRef<NodeJS.Timeout>();
  const expressionTimerRef = useRef<NodeJS.Timeout>();

  // Add these state variables to your FlappyBirdGame component
  const [screenShake, setScreenShake] = useState(false);
  const [ambientObjects, setAmbientObjects] = useState<{
    id: number, 
    type: 'butterfly' | 'leaf' | 'snowflake' | 'paper', 
    x: number, 
    y: number, 
    rotation: number,
    scale: number
  }[]>([]);

  const createCloud = useCallback(() => ({
    id: cloudIdRef.current++,
    x: GAME_WIDTH,
    y: Math.random() * (GAME_HEIGHT * 0.7),
    speed: MIN_CLOUD_SPEED + Math.random() * (MAX_CLOUD_SPEED - MIN_CLOUD_SPEED),
    size: MIN_CLOUD_SIZE + Math.random() * (MAX_CLOUD_SIZE - MIN_CLOUD_SIZE)
  }), []);

  const createPipe = useCallback((startX = GAME_WIDTH) => {
    const minHeight = 100;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    return { x: startX, height, passed: false };
  }, []);

  const createCoin = useCallback(() => {
    const minY = 80;
    const maxY = GAME_HEIGHT - 80;
    const safeBuffer = 80; // Buffer distance from pipes
    
    // Generate a random Y position
    let y = Math.random() * (maxY - minY) + minY;
    
    // Check against existing pipes to ensure the coin is reachable
    let isValidPosition = false;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    while (!isValidPosition && attempts < maxAttempts) {
      attempts++;
      isValidPosition = true;
      
      // Check against all existing pipes
      for (const pipe of pipes) {
        // Calculate where the pipe will be when the coin reaches the bird
        const pipePositionWhenCoinReaches = pipe.x - BASE_PIPE_SPEED * ((GAME_WIDTH - 50) / BASE_PIPE_SPEED);
        
        // Only check pipes that will be in range
        if (pipePositionWhenCoinReaches < -PIPE_WIDTH) {
          continue; // Pipe will be gone when coin reaches the bird
        }
        
        // Check if the coin's Y position conflicts with pipe + buffer
        if (
          (y < pipe.height + safeBuffer) || // Too close to top pipe
          (y > pipe.height + PIPE_GAP - safeBuffer - COIN_SIZE) // Too close to bottom pipe
        ) {
          // Position conflicts with this pipe, try a new position
          isValidPosition = false;
          y = Math.random() * (maxY - minY) + minY;
          break;
        }
      }
    }
    
    // If we still don't have a valid position after max attempts,
    // place the coin in the middle of the gap of the furthest pipe
    if (!isValidPosition && pipes.length > 0) {
      const lastPipe = pipes[pipes.length - 1];
      y = lastPipe.height + PIPE_GAP / 2 - COIN_SIZE / 2;
    }
    
    return {
      id: coinIdRef.current++,
      x: GAME_WIDTH,
      y: y,
      collected: false,
      rotation: 0
    };
  }, [pipes]);

  const addScorePopup = useCallback((value: number) => {
    const popup = {
      id: popupIdRef.current++,
      value,
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 3,
      opacity: 1
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, SCORE_POPUP_DURATION);
  }, []);

  const handleCollision = useCallback(() => {
    if (!gameOver) {
      setGameOver(true);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), FLASH_DURATION);
      
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = undefined;
    }

    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBirdPos(GAME_HEIGHT / 2);
    setPipes([]);
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
    setScorePopups([]);
    setIsPaused(false);
    setShowFlash(false);
    setCoins([]);
    setCoinCount(0);

    velocityRef.current = 0;
    lastTimeRef.current = 0;
    lastBirdPosRef.current = GAME_HEIGHT / 2;

    // Fix 3: In resetGame, add this:
    lastWeatherChangeRef.current = 0;
    setCurrentWeather('sunny');
    setWeatherParticles([]);

    // 6. Add this to resetGame function:
    setFeathers([]);

    // Update resetGame to also reset mountains and hills
    setMountains([]);
    setHills([]);
    setBgBirds([]); // Add this line
    setStars([]); // Add this line
    setAmbientObjects([]); // Add this line

    setTimeout(() => {
      isResettingRef.current = false;
    }, RESET_DELAY);
  }, [createCloud]);

  // 3. Add this function with your other creation functions:
  const createFeathers = useCallback(() => {
    const newFeathers: Feather[] = [];
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 feathers
    
    const featherColors = ['#FFD700', '#FFA500', '#FF8C00'];
    
    for (let i = 0; i < count; i++) {
      newFeathers.push({
        id: featherIdRef.current++,
        x: 60,  // Just after bird position
        y: birdPos + 20,
        rotation: Math.random() * 360,
        size: 4 + Math.random() * 7,
        opacity: 1,
        // Change to negative values for backward movement
        velocityX: -2 - Math.random() * 5, // Negative values (was positive)
        velocityY: -3 + Math.random() * 6, 
        rotationSpeed: -8 + Math.random() * 16,
        color: featherColors[Math.floor(Math.random() * featherColors.length)]
      });
    }
    
    setFeathers(prev => [...prev, ...newFeathers]);
  }, [birdPos]);

  // Add these creation functions with your other creation functions
  const createMountain = useCallback(() => ({
    id: mountainIdRef.current++,
    x: GAME_WIDTH,
    height: 80 + Math.random() * 60, // Slightly smaller mountains
    width: 160 + Math.random() * 100, // Slightly narrower mountains
    color: currentWeather === 'night' ? '#2c3e50' : 
           currentWeather === 'snowy' ? '#95a5a6' : '#7f8c8d',
    snowCapped: Math.random() > 0.5 // 50% chance of snow caps (was 0.3)
  }), [currentWeather]);

  const createHill = useCallback(() => ({
    id: hillIdRef.current++,
    x: GAME_WIDTH,
    height: 40 + Math.random() * 40,
    width: 100 + Math.random() * 80,
    color: currentWeather === 'night' ? '#1a2530' : 
           currentWeather === 'snowy' ? '#bdc3c7' : '#2ecc71'
  }), [currentWeather]);

  // 4. Update your handleJump function:
  const handleJump = useCallback(() => {
    if (gameStarted && !gameOver && !isPaused) {
      velocityRef.current = JUMP_FORCE;
      if (Math.random() < 0.4) createFeathers(); // 40% chance (was 30%)
    }
  }, [gameStarted, gameOver, isPaused, createFeathers]);

  const handleClick = useCallback(() => {
    if (gameOver) {
      resetGame();
    } else if (!gameStarted) {
      setGameStarted(true);
      setPipes([createPipe(INITIAL_PIPE_DISTANCE)]);
    } else if (!isPaused) {
      handleJump();
    }
  }, [gameOver, gameStarted, isPaused, createPipe, handleJump, resetGame]);

  const handlePause = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Escape' && gameStarted && !gameOver) {
      setIsPaused(prev => !prev);
    }
  }, [gameStarted, gameOver]);

  // Add before gameLoop function
  const updateWeatherParticles = useCallback((deltaTime: number) => {
    if (!gameStarted || isPaused) return;
  
    setWeatherParticles(prev => {
      let updated = [...prev];
      
      // Remove particles that are out of bounds
      updated = updated.filter(particle => 
        particle.y < GAME_HEIGHT && particle.x > -10
      );
      
      // Add new particles based on weather
      if (currentWeather === 'rainy' && updated.length < 80) {
        for (let i = 0; i < 3; i++) {
          updated.push({
            id: particleIdRef.current++,
            x: Math.random() * GAME_WIDTH,
            y: -10
          });
        }
      } else if (currentWeather === 'snowy' && updated.length < 60) {
        for (let i = 0; i < 2; i++) {
          updated.push({
            id: particleIdRef.current++,
            x: Math.random() * GAME_WIDTH,
            y: -10
          });
        }
      } else if (currentWeather === 'foggy' && updated.length < 20) {
        updated.push({
          id: particleIdRef.current++,
          x: GAME_WIDTH,
          y: Math.random() * GAME_HEIGHT * 0.8
        });
      } else if (currentWeather === 'windy' && updated.length < 40) {
        updated.push({
          id: particleIdRef.current++,
          x: GAME_WIDTH + 5,
          y: Math.random() * GAME_HEIGHT
        });
      }
      
      // Move particles
      return updated.map(particle => {
        let dx = 0, dy = 0;
        
        if (currentWeather === 'rainy') {
          dx = -2 * deltaTime;
          dy = 10 * deltaTime;
        } else if (currentWeather === 'snowy') {
          dx = Math.sin(Date.now() / 1000 + particle.id) * deltaTime;
          dy = 1.5 * deltaTime;
        } else if (currentWeather === 'foggy') {
          dx = -1.5 * deltaTime;
          dy = 0;
        } else if (currentWeather === 'windy') {
          dx = -8 * deltaTime;
          dy = Math.sin(Date.now() / 300 + particle.id) * deltaTime;
        }
        
        return {
          ...particle,
          x: particle.x + dx,
          y: particle.y + dy
        };
      });
    });
  }, [currentWeather, gameStarted, isPaused]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameStarted || gameOver || isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = lastTimeRef.current ? 
      Math.min((timestamp - lastTimeRef.current) / FRAME_TIME, 2) : 1;
    lastTimeRef.current = timestamp;

    // Update bird physics
    velocityRef.current += GRAVITY * deltaTime;
    setBirdPos(prev => {
      const newPos = prev + velocityRef.current * deltaTime;
      lastBirdPosRef.current = prev;
      
      if (newPos < 0 || newPos > GAME_HEIGHT - BIRD_SIZE) {
        handleCollision();
        return prev;
      }
      return newPos;
    });

    // Update score popups
    setScorePopups(prev => 
      prev.map(popup => ({
        ...popup,
        y: popup.y - deltaTime,
        opacity: popup.opacity - deltaTime / SCORE_POPUP_DURATION
      }))
    );

    // Update clouds with parallax effect
    setClouds(prevClouds => {
      const updatedClouds = prevClouds
        .map(cloud => ({
          ...cloud,
          x: cloud.x - cloud.speed * deltaTime
        }))
        .filter(cloud => cloud.x > -cloud.size);

      while (updatedClouds.length < NUM_CLOUDS) {
        updatedClouds.push(createCloud());
      }

      return updatedClouds;
    });

    // Update coins
    setCoins(prevCoins => {
      const pipeSpeed = (BASE_PIPE_SPEED + (level - 1) * 0.3) * deltaTime;
      let updatedCoins = prevCoins
        .map(coin => ({
          ...coin,
          x: coin.x - pipeSpeed,
          rotation: (coin.rotation + 2 * deltaTime) % 360
        }))
        .filter(coin => coin.x > -COIN_SIZE);

      // Maybe add a new coin
      if (
        (prevCoins.length === 0 || prevCoins[prevCoins.length - 1].x < GAME_WIDTH - 200) && 
        Math.random() < 1/COIN_FREQUENCY // CHANGE FROM > TO <
      ) {
        updatedCoins.push(createCoin());
      }

      // Check for coin collection
      const birdCenterX = 50 + BIRD_SIZE / 2;
      const birdCenterY = birdPos + BIRD_SIZE / 2;
      
      updatedCoins = updatedCoins.map(coin => {
        if (!coin.collected) {
          const coinCenterX = coin.x + COIN_SIZE / 2;
          const coinCenterY = coin.y + COIN_SIZE / 2;
          const distance = Math.sqrt(
            Math.pow(birdCenterX - coinCenterX, 2) + 
            Math.pow(birdCenterY - coinCenterY, 2)
          );
          
          if (distance < (BIRD_SIZE + COIN_SIZE) / 2 - 5) {
            // Collect the coin
            addScorePopup(COIN_VALUE);
            setCoinCount(prev => prev + 1);
            setScore(prev => prev + COIN_VALUE);
            return { ...coin, collected: true };
          }
        }
        return coin;
      });

      return updatedCoins;
    });

    // Add this line in your gameLoop function after updating coins but before updating pipes
    updateWeatherParticles(deltaTime);

    // 5. Add this inside your gameLoop before the pipes update:
    // Update feathers
    setFeathers(prev => {
      return prev
        .map(feather => ({
          ...feather,
          x: feather.x + feather.velocityX * deltaTime,
          y: feather.y + feather.velocityY * deltaTime,
          rotation: feather.rotation + 5 * deltaTime,
          velocityY: feather.velocityY + 0.1 * deltaTime,
          opacity: feather.opacity - 0.01 * deltaTime
        }))
        .filter(feather => feather.opacity > 0);
    });

    // Add this inside the gameLoop callback, before updating pipes
    // Update mountains (slow parallax)
    setMountains(prev => {
      const speed = 0.5 * deltaTime;
      const updatedMountains = prev
        .map(m => ({...m, x: m.x - speed}))
        .filter(m => m.x > -m.width);
      
      // Make mountains extremely rare (0.002 -> 0.0005)
      if (Math.random() < 0.005) {
        updatedMountains.push(createMountain());
      }
      
      return updatedMountains;
    });

    // Update hills (medium parallax)
    setHills(prev => {
      const speed = 1 * deltaTime;
      const updatedHills = prev
        .map(h => ({...h, x: h.x - speed}))
        .filter(h => h.x > -h.width);
      
      // Make hills much more rare (0.005 -> 0.001)
      if (Math.random() < 0.005) {
        updatedHills.push(createHill());
      }
      
      return updatedHills;
    });

    // Update pipes with immediate collision detection
    setPipes(prevPipes => {
      const pipeSpeed = (BASE_PIPE_SPEED + (level - 1) * 0.3) * deltaTime;
      const updatedPipes = prevPipes
        .map(pipe => ({
          ...pipe,
          x: pipe.x - pipeSpeed
        }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < GAME_WIDTH - 300) {
        updatedPipes.push(createPipe());
      }

      const birdLeft = 50 + 5;
      const birdRight = birdLeft + BIRD_SIZE - 10;
      const birdTop = birdPos + 5;
      const birdBottom = birdPos + BIRD_SIZE - 5;

      for (const pipe of updatedPipes) {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          addScorePopup(1);
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore % PIPES_PER_LEVEL === 0) {
              setLevel(l => l + 1);
            }
            return newScore;
          });
        }

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP)
        ) {
          handleCollision();
          return updatedPipes;
        }
      }

      return updatedPipes;
    });

    // Update background birds in the game loop
    // Add this to your gameLoop function along with other updates
    setBgBirds(prev => {
      return prev
        .map(bird => ({
          ...bird,
          // Move left or right based on direction
          x: bird.direction === 'right' 
             ? bird.x + bird.speed * deltaTime 
             : bird.x - bird.speed * deltaTime,
          // Animate wings every few frames
          wingPosition: (timestamp % (600 - bird.speed * 200) < 16) ? 
                        (bird.wingPosition + 1) % 4 : bird.wingPosition
        }))
        .filter(bird => 
          (bird.direction === 'right' && bird.x < GAME_WIDTH + 50) ||
          (bird.direction === 'left' && bird.x > -50)
        );
    });

    // In your gameLoop function, modify the ambient objects update:
    setAmbientObjects(prev => {
      return prev
        .map(obj => {
          let newX, newY, newRotation;
          
          switch (obj.type) {
            case 'butterfly':
              // Butterflies move slower
              newX = obj.x - 0.5 * deltaTime; // Reduced from 1.2
              newY = obj.y + Math.sin(timestamp / 500) * 0.5;
              newRotation = obj.rotation;
              break;
              
            case 'leaf':
              // Leaves fall slower
              newX = obj.x - 0.8 * deltaTime; // Reduced from 2
              newY = obj.y + 0.4 * deltaTime; // Reduced from 0.8
              newRotation = obj.rotation + 0.5 * deltaTime; // Reduced rotation speed
              break;
              
            case 'snowflake':
              // Snowflakes float even slower
              newX = obj.x - 0.3 * deltaTime; // Reduced from 0.6
              newY = obj.y + 0.3 * deltaTime; // Reduced from 0.5
              newRotation = obj.rotation + 0.1 * deltaTime; // Reduced rotation 
              break;
              
            case 'paper':
              // Papers move slower too
              newX = obj.x - 0.6 * deltaTime; // Reduced from 1.5
              newY = obj.y + (Math.sin(timestamp / 300) * 0.3);
              newRotation = obj.rotation + (Math.sin(timestamp / 400) * 1);
              break;
              
            default:
              newX = obj.x - deltaTime;
              newY = obj.y;
              newRotation = obj.rotation;
          }
          
          return {
            ...obj,
            x: newX,
            y: newY,
            rotation: newRotation
          };
        })
        // Keep objects longer on screen by extending their lifetime
        .filter(obj => obj.x > -150 && obj.y < GAME_HEIGHT + 150); // Was -50/+50
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, isPaused, birdPos, level, createCloud, createPipe, handleCollision, addScorePopup, updateWeatherParticles, createMountain, createHill]);

  // Initialize game
  useEffect(() => {
    setClouds(Array(NUM_CLOUDS).fill(null).map(createCloud));
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [createCloud]);

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handlePause);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else if (!gameStarted) {
          setGameStarted(true);
          setPipes([createPipe(INITIAL_PIPE_DISTANCE)]);
        } else if (!isPaused) {
          handleJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handlePause);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, isPaused, createPipe, handleJump, resetGame, handlePause]);

  // Fix 2: Replace your weather change effect with this improved version
  useEffect(() => {
    // Only change weather when crossing 12-point thresholds
    const currentThreshold = Math.floor(score / 12);
    
    if (score > 0 && currentThreshold > lastWeatherChangeRef.current) {
      // Update the reference so we don't trigger multiple times
      lastWeatherChangeRef.current = currentThreshold;
      
      // Calculate weather index (0=sunny, 1=rainy, etc)
      const weatherIndex = currentThreshold % WEATHER_TYPES.length;
      console.log(`Weather changing to: ${WEATHER_TYPES[weatherIndex]} at score: ${score}`);
      
      // Set the weather
      setCurrentWeather(WEATHER_TYPES[weatherIndex]);
    }
  }, [score]);

  // Add this effect to handle weather transitions
  useEffect(() => {
    if (currentWeather) {
      setTransitioningWeather(true);
      setSkyGradient(SKY_COLORS[currentWeather] || SKY_COLORS.sunny);
      
      const timer = setTimeout(() => {
        setTransitioningWeather(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentWeather]);

  // Add this effect for bird animations
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      // Wing flapping animation - adjust speed based on weather
      let wingSpeed = 200; // base speed
      if (currentWeather === 'windy') wingSpeed = 100; // faster in wind
      if (currentWeather === 'rainy') wingSpeed = 150; // slightly faster in rain
      
      wingTimerRef.current = setInterval(() => {
        setWingPosition(prev => (prev + 1) % 4);
      }, wingSpeed);
      
      // Random eye blinking
      blinkTimerRef.current = setInterval(() => {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 150);
      }, 3000 + Math.random() * 2000); // Blink every 3-5 seconds
      
      // Handle bird rotation based on velocity
      setBirdRotation(velocityRef.current > 0 ? Math.min(velocityRef.current * 3, 30) : Math.max(velocityRef.current * 2, -20));
      
      // Weather-specific behaviors
      if (currentWeather === 'snowy' && !isShivering) {
        // Random shivering in snow
        const shouldShiver = Math.random() < 0.2;
        if (shouldShiver) {
          setIsShivering(true);
          setTimeout(() => setIsShivering(false), 1000);
        }
      }
    }
    
    return () => {
      if (wingTimerRef.current) clearInterval(wingTimerRef.current);
      if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
      if (expressionTimerRef.current) clearTimeout(expressionTimerRef.current);
    };
  }, [gameStarted, gameOver, isPaused, currentWeather, velocityRef.current]);

  // Add this effect to change expressions based on game events
  useEffect(() => {
    // Don't change expressions if game is over
    if (gameOver) return;
    
    // Near miss detection (within 30px of a pipe)
    const isNearPipe = pipes.some(pipe => {
      return pipe.x > 30 && pipe.x < 110 && 
             (birdPos < pipe.height + 30 || birdPos > pipe.height + PIPE_GAP - 30);
    });
    
    if (isNearPipe) {
      setBirdExpression('worried');
    } else {
      // Reset to normal after being worried
      if (birdExpression === 'worried') {
        setBirdExpression('normal');
      }
    }
    
    // Show happy expression when scoring
    const justScoredPipe = pipes.find(pipe => 
      pipe.x + PIPE_WIDTH < 55 && pipe.x + PIPE_WIDTH > 45
    );
    
    if (justScoredPipe) {
      setBirdExpression('happy');
      if (expressionTimerRef.current) clearTimeout(expressionTimerRef.current);
      expressionTimerRef.current = setTimeout(() => {
        setBirdExpression('normal');
      }, 1000);
    }
    
    // Show surprised expression when collecting coins
    const coinCollected = coins.some(coin => {
      if (coin.collected) return false;
      const birdCenterX = 50 + BIRD_SIZE / 2;
      const birdCenterY = birdPos + BIRD_SIZE / 2;
      const coinCenterX = coin.x + COIN_SIZE / 2;
      const coinCenterY = coin.y + COIN_SIZE / 2;
      const distance = Math.sqrt(
        Math.pow(birdCenterX - coinCenterX, 2) + 
        Math.pow(birdCenterY - coinCenterY, 2)
      );
      return distance < (BIRD_SIZE + COIN_SIZE) / 2;
    });
    
    if (coinCollected) {
      setBirdExpression('surprised');
      if (expressionTimerRef.current) clearTimeout(expressionTimerRef.current);
      expressionTimerRef.current = setTimeout(() => {
        setBirdExpression('normal');
      }, 800);
    }
  }, [birdPos, pipes, coins, gameOver]);

  // Add these state variables to your FlappyBirdGame component
  const [bgBirds, setBgBirds] = useState<{
    id: number,
    x: number,
    y: number,
    speed: number,
    size: number,
    wingPosition: number,
    color: string,
    direction: 'left' | 'right'
  }[]>([]);
  const [lightning, setLightning] = useState(false);
  const bgBirdIdRef = useRef(0);
  const lightningTimerRef = useRef<NodeJS.Timeout>();

  // More sophisticated function to create realistic background birds
  const createBackgroundBird = useCallback(() => {
    // Define a palette of natural bird colors
    const birdColors = [
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', // Golden (like main bird)
      'linear-gradient(135deg, #A52A2A 0%, #8B4513 100%)', // Brown
      'linear-gradient(135deg, #708090 0%, #2F4F4F 100%)', // Slate gray
      'linear-gradient(135deg, #000000 0%, #2F4F4F 100%)', // Black-gray
      'linear-gradient(135deg, #FFFFFF 0%, #E6E6FA 100%)', // White
    ];
    
    // 25% chance the bird will fly right-to-left instead of left-to-right
    const direction = Math.random() > 0.75 ? 'left' : 'right';
    const startX = direction === 'right' ? -50 : GAME_WIDTH + 50;
    
    return {
      id: bgBirdIdRef.current++,
      x: startX,
      y: 50 + Math.random() * (GAME_HEIGHT * 0.6), // Keep birds in sky area
      speed: 0.5 + Math.random() * 1, // Slower for background birds
      size: 15 + Math.random() * 10, // Smaller than main bird
      wingPosition: Math.floor(Math.random() * 4),
      color: birdColors[Math.floor(Math.random() * birdColors.length)],
      direction: direction
    };
  }, []);

  // Add this useEffect to initialize and manage background birds
  useEffect(() => {
    // Initialize with a few background birds
    setBgBirds(Array(3).fill(null).map(createBackgroundBird));
    
    // Add new birds periodically when game is active
    const interval = setInterval(() => {
      if (gameStarted && !gameOver && !isPaused && Math.random() < 0.1) {
        setBgBirds(prev => {
          // Limit the number of birds
          if (prev.length >= 5) return prev;
          return [...prev, createBackgroundBird()];
        });
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, isPaused, createBackgroundBird]);

  // Add this useEffect to manage lightning in rainy weather
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || currentWeather !== 'rainy') {
      if (lightningTimerRef.current) {
        clearTimeout(lightningTimerRef.current);
      }
      return;
    }
    
    const scheduleLightning = () => {
      // Random time between 3-8 seconds for next lightning
      const nextTime = 3000 + Math.random() * 5000;
      
      lightningTimerRef.current = setTimeout(() => {
        setLightning(true);
        
        // Flash duration
        setTimeout(() => {
          setLightning(false);
          scheduleLightning();
        }, 150);
      }, nextTime);
    };
    
    scheduleLightning();
    
    return () => {
      if (lightningTimerRef.current) {
        clearTimeout(lightningTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, currentWeather]);

  // Add these state variables to your FlappyBirdGame component
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, delay: number}[]>([]);
  const starIdRef = useRef(0);

  // Add this function to create stars
  const createStars = useCallback(() => {
    const newStars = [];
    const numStars = 20 + Math.floor(Math.random() * 15); // 20-35 stars
    
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: starIdRef.current++,
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT * 0.7), // Keep stars in upper 70% of sky
        size: 1 + Math.random() * 2, // 1-3px size
        delay: Math.random() * 5 // Random delay for twinkling
      });
    }
    
    return newStars;
  }, []);

  // Add this useEffect to manage stars in night mode
  useEffect(() => {
    if (currentWeather === 'night') {
      // Only create stars if we don't already have them
      if (stars.length === 0) {
        setStars(createStars());
      }
    } else {
      // Remove stars for other weather conditions
      setStars([]);
    }
  }, [currentWeather, createStars]);

  // Update your effect that creates ambient objects
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    
    const interval = setInterval(() => {
      // Increase creation probability from 5% to 15%
      if (Math.random() < 0.15) {
        let type: 'butterfly' | 'leaf' | 'snowflake' | 'paper' = 'leaf';
        
        switch (currentWeather) {
          case 'sunny': type = 'butterfly'; break;
          case 'windy': type = 'leaf'; break;
          case 'snowy': type = 'snowflake'; break;
          case 'foggy': type = 'paper'; break;
          default: return; // Don't create objects in rainy or night
        }
        
        setAmbientObjects(prev => {
          // Allow more objects on screen - increased from 8 to 12
          if (prev.length >= 12) {
            const newList = [...prev];
            newList.shift(); // Remove oldest
            return [...newList, createAmbientObject(type)];
          }
          return [...prev, createAmbientObject(type)];
        });
      }
    }, 1000); // Reduced from 2000ms to 1000ms for more frequent creation
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, isPaused, currentWeather]);

  // Function to create ambient objects with proper positioning and properties
  const createAmbientObject = useCallback((type: 'butterfly' | 'leaf' | 'snowflake' | 'paper') => {
    return {
      id: Date.now() + Math.random(),
      type,
      x: GAME_WIDTH,
      y: 50 + Math.random() * (GAME_HEIGHT - 150), // Keep away from bottom
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    };
  }, []);

  // Add this to your collision detection code (where you detect pipe collision)
  useEffect(() => {
    // Check for collision with pipes
    if (gameStarted && !gameOver && !isPaused) {
      const birdTop = birdPos;
      const birdBottom = birdPos + BIRD_SIZE;
      const birdLeft = 50;
      const birdRight = 50 + BIRD_SIZE;

      // Check for collision with each pipe
      const collision = pipes.some(pipe => {
        // Add the missing collision check
        const hasCollided = birdRight > pipe.x &&
                           birdLeft < pipe.x + PIPE_WIDTH &&
                           (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP);
        
        // If collision detected
        if (hasCollided) {
          // Trigger screen shake
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), 200);
          return true;
        }
        return false;
      });

      if (collision) {
        handleCollision();
      }
    }
  }, [birdPos, pipes, gameStarted, gameOver, isPaused, handleCollision]);

  // Modify this effect to create fewer ambient objects when weather changes
  useEffect(() => {
    // Create ambient objects when weather changes (except for rainy and night)
    if (gameStarted && !gameOver && !isPaused && 
        (currentWeather === 'sunny' || currentWeather === 'windy' || 
         currentWeather === 'snowy' || currentWeather === 'foggy')) {
      
      // Create an initial batch of objects of appropriate type
      const type = 
        currentWeather === 'sunny' ? 'butterfly' :
        currentWeather === 'windy' ? 'leaf' :
        currentWeather === 'snowy' ? 'snowflake' : 'paper';
        
      // Create only 1 object instead of 5
      const initialCount = currentWeather === 'sunny' ? 1 : 2; // 1 butterfly, 2 of others
      
      const newObjects = [];
      for (let i = 0; i < initialCount; i++) {
        newObjects.push({
          id: Date.now() + Math.random() + i,
          type,
          // Position it more centrally for visibility
          x: GAME_WIDTH * (0.4 + Math.random() * 0.4),
          y: 50 + Math.random() * (GAME_HEIGHT - 150),
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.6
        });
      }
      
      setAmbientObjects(prev => [...prev, ...newObjects]);
    }
  }, [currentWeather, gameStarted, gameOver, isPaused]);

  return (
    <Box className="flappy-bird-wrapper">
      <div 
        className={`game-container ${currentWeather} ${transitioningWeather ? 'weather-transition' : ''} ${showFlash ? 'flash' : ''} ${screenShake ? 'screen-shake' : ''}`}
        onClick={handleClick}
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          background: `linear-gradient(to bottom, ${skyGradient[0]}, ${skyGradient[1]})`
        }}
      >
        {/* Parallax mountains in the background */}
        {mountains.map(mountain => (
          <div 
            key={mountain.id}
            className="mountain"
            style={{
              left: mountain.x,
              bottom: 0,
              width: mountain.width,
              height: mountain.height,
              backgroundColor: mountain.color,
              zIndex: 0
            }}
          >
            {mountain.snowCapped && (
              <div 
                className="mountain-cap"
                style={{
                  width: '80%',
                  height: '30%',
                  backgroundColor: currentWeather === 'night' ? '#597387' : 'white',
                  margin: '0 auto'
                }}
              />
            )}
          </div>
        ))}

        {/* Parallax hills in middle distance */}
        {hills.map(hill => (
          <div 
            key={hill.id}
            className="hill"
            style={{
              left: hill.x,
              bottom: 0,
              width: hill.width,
              height: hill.height,
              backgroundColor: hill.color,
              zIndex: 0
            }}
          />
        ))}

        {/* Weather particles */}
        {weatherParticles.map(particle => (
          <div
            key={particle.id}
            className={`weather-particle ${currentWeather}`}
            style={{
              left: particle.x,
              top: particle.y
            }}
          />
        ))}

        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="cloud"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: cloud.size,
              height: cloud.size * 0.6,
              zIndex: 1
            }}
          />
        ))}
        
        {scorePopups.map(popup => (
          <div
            key={popup.id}
            className="score-popup"
            style={{
              left: popup.x,
              top: popup.y,
              opacity: popup.opacity
            }}
          >
            +{popup.value}
          </div>
        ))}
        
        {/* Background birds */}
        {bgBirds.map(bird => (
          <div
            key={bird.id}
            className={`bg-bird wing-position-${bird.wingPosition}`}
            style={{
              left: bird.x,
              top: bird.y,
              width: bird.size,
              height: bird.size * 0.75,
              transform: `scaleX(${bird.direction === 'left' ? -1 : 1})`,
              zIndex: 1
            }}
          >
            <div 
              className="bg-bird-body" 
              style={{ background: bird.color }}
            ></div>
            <div className="bg-bird-wing"></div>
            <div className="bg-bird-head"></div>
            <div className="bg-bird-tail"></div>
            <div className="bg-bird-eye"></div>
            <div className="bg-bird-beak"></div>
          </div>
        ))}

        {/* Lightning effect */}
        {lightning && <div className="lightning" />}

        {/* Stars in night mode */}
        {currentWeather === 'night' && stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        <div 
          className={`bird ${birdExpression} ${eyeBlink ? 'blinking' : ''} ${isShivering ? 'shivering' : ''} wing-${wingPosition} weather-${currentWeather}`} 
          style={{
            top: birdPos,
            transform: `rotate(${birdRotation}deg)`
          }}
        >
          <div className="hat"></div>
          <div className="eye"></div>
          <div className="beak"></div>
          <div className="cheek"></div>
        </div>

        {/* 7. Add this to your JSX right after the bird component: */}
        {feathers.map(feather => (
          <div
            key={feather.id}
            className="feather"
            style={{
              left: feather.x,
              top: feather.y,
              width: feather.size,
              height: feather.size * 1.5,
              opacity: feather.opacity,
              transform: `rotate(${feather.rotation}deg)`,
              backgroundColor: feather.color
            }}
          />
        ))}
        
        {pipes.map((pipe, index) => {
          const pipeColor = PIPE_COLORS[currentWeather] || '#4CAF50';
          const pipeBorderColor = currentWeather === 'night' ? '#0a0a20' : 
                                   currentWeather === 'snowy' ? '#7baee0' : 
                                   '#006400'; // Default cap color
          
          return (
            <div key={index} className={`pipes weather-${currentWeather}`} style={{ zIndex: 2 }}>
              <div 
                className="pipe top" 
                style={{ 
                  left: pipe.x, 
                  height: pipe.height,
                  backgroundColor: pipeColor,
                  '--pipe-cap-color': pipeBorderColor
                } as React.CSSProperties} 
              />
              <div 
                className="pipe bottom" 
                style={{ 
                  left: pipe.x, 
                  height: GAME_HEIGHT - pipe.height - PIPE_GAP,
                  top: pipe.height + PIPE_GAP,
                  backgroundColor: pipeColor,
                  '--pipe-cap-color': pipeBorderColor
                } as React.CSSProperties} 
              />
            </div>
          );
        })}

        {coins.map(coin => (
          <div
            key={coin.id}
            className={`coin ${coin.collected ? 'collected' : ''}`}
            style={{
              left: coin.x,
              top: coin.y,
              width: COIN_SIZE,
              height: COIN_SIZE,
              transform: `rotate(${coin.rotation}deg)`,
              zIndex: 2
            }}
          />
        ))}

        {/* Ambient weather objects */}
        {ambientObjects.map(obj => (
          <div
            key={obj.id}
            className={`ambient-object ${obj.type}`}
            style={{
              left: obj.x,
              top: obj.y,
              transform: `rotate(${obj.rotation}deg) scale(${obj.scale})`,
            }}
          />
        ))}

        <div className="score">Score: {score}</div>
        <div className="high-score">Best: {highScore}</div>
        <div className="level">Level: {level}</div>
        <div className="weather-indicator">{currentWeather}</div>
        
        {isPaused && (
          <div className="pause-overlay">
            <div className="message">
              PAUSED<br/>Press ESC to Resume
            </div>
          </div>
        )}
        
        {!gameStarted && !gameOver && (
          <div className="message">
            Click to Start<br/>Press Space to Jump<br/>Press ESC to Pause
          </div>
        )}
        {gameOver && (
          <div className="message">
            Game Over!<br/>
            Score: {score}<br/>
            High Score: {highScore}<br/>
            Level: {level}<br/>
            Click to Restart
          </div>
        )}
      </div>
    </Box>
  );
};

export default FlappyBirdGame;