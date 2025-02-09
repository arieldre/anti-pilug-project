import React, { useState, useEffect } from 'react';
import './BuildCity.scss';

interface Building {
  id: number;
  name: string;
  baseCost: number;
  level: number;
  baseIncome: number;
  efficiencyMultiplier: number;
  nextBigUpgradeIndex: number; // index into thresholds
}

interface TapPop {
  id: number;
  x: number;
  y: number;
  value: number;
  combo?: string;
}

const thresholds = [10, 25, 50, 100];

// Update the initialBuildings array with bigger income differences
const initialBuildings: Building[] = [
  { id: 1, name: "Farm", baseCost: 50, level: 0, baseIncome: 1, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 2, name: "Bakery", baseCost: 1000, level: 0, baseIncome: 25, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 3, name: "House", baseCost: 25000, level: 0, baseIncome: 600, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 4, name: "School", baseCost: 25000000, level: 0, baseIncome: 65000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 5, name: "Library", baseCost: 375000000, level: 0, baseIncome: 2810000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 6, name: "Hospital", baseCost: 75000000000, level: 0, baseIncome: 900000000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 7, name: "Park", baseCost: 500000, level: 0, baseIncome: 6400, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 8, name: "Museum", baseCost: 2000000, level: 0, baseIncome: 25600, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 9, name: "Skyscraper", baseCost: 10000000, level: 0, baseIncome: 100000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 10, name: "Stadium", baseCost: 50000000, level: 0, baseIncome: 400000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
];

const BuildCity: React.FC = () => {
  // Core game state
  const [money, setMoney] = useState(0);
  const [tapValue, setTapValue] = useState(1);
  const [tapUpgradeCost, setTapUpgradeCost] = useState(50);
  const [totalTaps, setTotalTaps] = useState(0);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [tapPops, setTapPops] = useState<TapPop[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // Derived stats
  const totalBuildingLevels = buildings.reduce((acc, b) => acc + b.level, 0);
  const totalIncome = buildings.reduce((acc, b) => acc + (b.level * b.baseIncome * b.efficiencyMultiplier), 0);

  // Helper: compute building level class
  const getLevelClass = (level: number): string => {
    if (level === 0) return ''; // No building purchased yet.
    if (level < 25) return 'level-1';
    if (level >= 25 && level < 50) return 'level-25 pop';
    if (level >= 50 && level < 75) return 'level-50 pop';
    if (level >= 75) return 'level-75 pop';
    return 'level-1';
  };

  // Add this helper function near your other helpers
  const isUnlocked = (building: Building, buildings: Building[]) => {
    if (building.id === 1) return true; // Farm is always unlocked
    const previousBuilding = buildings.find(b => b.id === building.id - 1);
    return previousBuilding && previousBuilding.level > 0;
  };

  // Manual tap: add tapValue to money, count the tap, and add pop-up feedback.
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't handle taps on control elements
    if ((e.target as HTMLElement).closest('.stats-panel, .tap-section, .buildings-section')) {
      return;
    }

    const now = Date.now();
    if (now - lastTapTime < 500) { // If tapped within 500ms
      setCombo(prev => Math.min(prev + 1, 10)); // Max combo of 10x
      setMultiplier(prev => Math.min(prev + 0.1, 2)); // Max multiplier of 2x
    } else {
      setCombo(0);
      setMultiplier(1);
    }
    setLastTapTime(now);

    const finalTapValue = Math.floor(tapValue * multiplier);
    setMoney(prev => prev + finalTapValue);
    setTotalTaps(prev => prev + 1);

    // Enhanced tap pop-up with combo
    const id = Date.now();
    setTapPops(prev => [...prev, {
      id,
      x: e.clientX,
      y: e.clientY,
      value: finalTapValue,
      combo: combo > 0 ? `${combo}x` : ''
    }]);

    // Clean up pop-up after animation
    setTimeout(() => {
      setTapPops(prev => prev.filter(pop => pop.id !== id));
    }, 800);
  };

  // Upgrade tap: increases tapValue and its cost scales up
  const upgradeTap = () => {
    if (money >= tapUpgradeCost) {
      setMoney(prev => prev - tapUpgradeCost);
      setTapValue(prev => prev + 1);
      setTapUpgradeCost(Math.floor(tapUpgradeCost * 1.7));
    }
  };

  // Buy (upgrade) a building: cost increases with each level
  const buyBuilding = (id: number) => {
    const building = buildings.find(b => b.id === id);
    if (building) {
      const cost = Math.floor(building.baseCost * Math.pow(1.2, building.level));
      if (money >= cost) {
        setMoney(prev => prev - cost);
        setBuildings(prev =>
          prev.map(b =>
            b.id === id ? { ...b, level: b.level + 1 } : b
          )
        );
      }
    }
  };

  // Big upgrade: when a building reaches a threshold level, allow a major efficiency boost.
  const upgradeBuildingEfficiency = (id: number) => {
    const building = buildings.find(b => b.id === id);
    if (building) {
      const currentThreshold = thresholds[building.nextBigUpgradeIndex];
      if (currentThreshold !== undefined && building.level >= currentThreshold) {
        const cost = Math.floor(building.baseCost * currentThreshold * 15);
        if (money >= cost) {
          setMoney(prev => prev - cost);
          setBuildings(prev =>
            prev.map(b =>
              b.id === id
                ? {
                    ...b,
                    efficiencyMultiplier: b.efficiencyMultiplier * 3,
                    nextBigUpgradeIndex: b.nextBigUpgradeIndex + 1
                  }
                : b
            )
          );
        }
      }
    }
  };

  // Automatic income: add income from buildings every second.
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney(prev => prev + totalIncome);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalIncome]);

  // Achievement Checker: unlocks achievements based on milestones.
  useEffect(() => {
    const newAchievements: string[] = [];
    if (totalTaps >= 1 && !achievements.includes("First Tap!")) {
      newAchievements.push("First Tap!");
    }
    if (totalBuildingLevels >= 10 && !achievements.includes("Building Enthusiast")) {
      newAchievements.push("Building Enthusiast");
    }
    if (money >= 10000 && !achievements.includes("Rich Community")) {
      newAchievements.push("Rich Community");
    }
    if (tapValue >= 10 && !achievements.includes("Tap Master")) {
      newAchievements.push("Tap Master");
    }
    if (totalIncome >= 1000 && !achievements.includes("Automation Guru")) {
      newAchievements.push("Automation Guru");
    }
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [totalTaps, totalBuildingLevels, money, tapValue, totalIncome, achievements]);

  // Add idle bonus system
  useEffect(() => {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
      const timeDiff = now - parseInt(lastVisit);
      if (timeDiff > 60000) { // If away for more than 1 minute
        const idleEarnings = Math.floor((timeDiff / 1000) * totalIncome * 0.5); // 50% efficiency while away
        setMoney(prev => prev + idleEarnings);
        alert(`Welcome back! You earned $${idleEarnings} while away!`);
      }
    }
    
    // Save current time
    const saveInterval = setInterval(() => {
      localStorage.setItem('lastVisit', Date.now().toString());
    }, 10000);
  
    return () => clearInterval(saveInterval);
  }, []);

  // Reset game: resets all game state (with confirmation).
  const resetGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setMoney(0);
      setTapValue(1);
      setTapUpgradeCost(50);
      setTotalTaps(0);
      setBuildings(initialBuildings.map(b => ({ ...b, level: 0, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 })));
      setAchievements([]);
    }
  };

  const renderBuildings = () => {
    return buildings.map(b => {
      if (b.level > 0) {
        switch(b.name) {
          case "Farm":
            return (
              <div className="farm" key={b.id}>
                <div className="field">
                  <div className="soil-rows">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="row" 
                        style={{ animationDelay: `${i * 0.2}s` }} 
                      />
                    ))}
                  </div>
                  <div className="crops-container">
                    {[...Array(Math.min(Math.floor(b.level/25) * 2 + 4, 12))].map((_, i) => (
                      <div 
                        key={i} 
                        className={`crop ${getLevelClass(b.level)}`} 
                        style={{ animationDelay: `${i * 0.3}s` }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
            
          case "Bakery":
            return (
              <div className="bakery" key={b.id}>
                <div className="chimney">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="smoke"
                      style={{ 
                        animationDelay: `${i * 0.6}s`,
                        width: '15px',
                        height: '15px',
                        top: `-${20 + i * 10}px`,
                        left: `${i * 5}px`
                      }}
                    />
                  ))}
                </div>
              </div>
            );
            
          case "House":
            return (
              <div className="house" key={b.id}>
                <div className="roof" />
                <div className="window left" />
                <div className="window right" />
                <div className="door" />
              </div>
            );
            
          case "School":
            return (
              <div className="school" key={b.id}>
                <div className="roof" />
                <div className="window w1" />
                <div className="window w2" />
                <div className="window w3" />
                <div className="window w4" />
                <div className="door" />
              </div>
            );
          case "Library":
            return (
              <div className="library" key={b.id}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`window w${i+1}`} />
                ))}
                <div className="door" />
              </div>
            );
          case "Hospital":
            return (
              <div className="hospital" key={b.id}>
                <div className="red-cross" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`window w${i+1}`} />
                ))}
                <div className="door" />
              </div>
            );
          case "Park":
            return (
              <div className="park" key={b.id}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`tree t${i+1}`}>
                    <div className="tree-trunk" />
                    <div className="tree-crown" />
                  </div>
                ))}
              </div>
            );
          case "Museum":
            return (
              <div className="building museum" key={b.id}>
                <div className="sign">Museum</div>
                <div className="columns">
                  <div className="column"></div>
                  <div className="column"></div>
                  <div className="column"></div>
                  <div className="column"></div>
                  <div className="column"></div>
                </div>
                <div className="stairs"></div>
              </div>
            );
          case "Skyscraper":
            return (
              <div className="skyscraper" key={b.id}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`window-row row${i+1}`}>
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="window" />
                    ))}
                  </div>
                ))}
              </div>
            );
          case "Stadium":
            return (
              <div className="stadium" key={b.id}>
                <div className="scoreboard" />
                <div className="field" />
              </div>
            );
          default:
            return null;
        }
      }
      return null;
    });
  };

  return (
    <div className="build-city" onClick={handleTap}>
      {/* Tap pop-ups */}
      {tapPops.map(pop => (
        <div 
          key={pop.id}
          className="tap-pop"
          style={{ left: `${pop.x}px`, top: `${pop.y}px` }}
        >
          +{pop.value} {pop.combo}
        </div>
      ))}

      {/* Stats Panel */}
      <section className="stats-panel">
        <div className="stat">
          <span className="label">Money</span>
          <span className="value">${money.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="label">Tap Value</span>
          <span className="value">+{tapValue}</span>
        </div>
        <div className="stat">
          <span className="label">Total Taps</span>
          <span className="value">{totalTaps}</span>
        </div>
        <div className="stat">
          <span className="label">Income/sec</span>
          <span className="value">${totalIncome.toFixed(1)}</span>
        </div>
      </section>

      {/* Tap Controls */}
      <section className="tap-section">
        <button 
          className="upgrade-tap-button" 
          onClick={(e) => { 
            e.stopPropagation();
            upgradeTap();
          }} 
          disabled={money < tapUpgradeCost}
        >
          Upgrade Tap (${tapUpgradeCost})
        </button>
        <button 
          className="reset-button" 
          onClick={(e) => {
            e.stopPropagation();
            resetGame(e);
          }}
        >
          Reset Game
        </button>
      </section>

      {/* Sky and other background elements */}
      <div className="sky">
        <div className="clouds">
          <div className="cloud c1"></div>
          <div className="cloud c2"></div>
          <div className="cloud c3"></div>
        </div>
      </div>
      <div className="city-silhouette"></div>

      {/* Main city layout container */}
      <div className="city-layout">
        <div className="buildings-container">
          {/* First row buildings (bottom row) */}
          {buildings.map(b => {
            if (b.level > 0 && b.id <= 5) {
              return (
                <div 
                  key={b.id} 
                  className={`building ${b.name.toLowerCase()}`}
                >
                  {/* Building content */}
                </div>
              );
            }
            return null;
          })}

          {/* Second row buildings (top row) */}
          {buildings.map(b => {
            if (b.level > 0 && b.id > 5) {
              return (
                <div 
                  key={b.id} 
                  className={`building ${b.name.toLowerCase()}`}
                >
                  {/* Building content */}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Main UI */}
      <header className="game-header" onClick={(e) => e.stopPropagation()}>
        <h1>Build Your Community</h1>
      </header>
      
      <section className="achievements-section" onClick={(e) => e.stopPropagation()}>
        <h2>Achievements</h2>
        {achievements.length === 0 ? (
          <p>No achievements yet. Keep going!</p>
        ) : (
          <ul>
            {achievements.map((ach, index) => (
              <li key={index}>{ach}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="buildings-section" onClick={(e) => e.stopPropagation()}>
        <h2>Buildings</h2>
        <div className="buildings-list">
          {buildings.map(b => {
            const cost = Math.floor(b.baseCost * Math.pow(1.2, b.level));
            const currentThreshold = thresholds[b.nextBigUpgradeIndex];
            let bigUpgradeCost = 0;
            let showBigUpgrade = false;
            if (currentThreshold !== undefined && b.level >= currentThreshold) {
              bigUpgradeCost = Math.floor(b.baseCost * currentThreshold * 15);
              showBigUpgrade = true;
            }
            const unlocked = isUnlocked(b, buildings);
            const canBuy = money >= cost;

            return (
              <div 
                key={b.id} 
                className={`building-card ${unlocked ? 'unlocked' : ''} ${canBuy && unlocked ? 'can-buy' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{b.name}</h3>
                <p>Level: {b.level}</p>
                <p>Income: ${(b.level * b.baseIncome * b.efficiencyMultiplier).toFixed(1)}/sec</p>
                {unlocked ? (
                  <>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        buyBuilding(b.id); 
                      }} 
                      disabled={money < cost}
                    >
                      Buy (Cost: ${cost})
                    </button>
                    {showBigUpgrade && (
                      <button 
                        className="big-upgrade"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          upgradeBuildingEfficiency(b.id); 
                        }} 
                        disabled={money < bigUpgradeCost}
                      >
                        Big Upgrade (Cost: ${bigUpgradeCost})
                      </button>
                    )}
                  </>
                ) : (
                  <p className="locked-message">
                    Build previous building first
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Buildings on the map */}
      <div className={`city-layout ${buildings.filter(b => b.level > 0).length > 6 ? 'zoomed-out' : ''}`}>
        <div className={`buildings-container ${buildings.filter(b => b.level > 0).length > 6 ? 'many-buildings' : ''}`}>
          {buildings.map(b => {
            if (b.level > 0) {
              switch(b.name) {
                case "Farm":
                  return (
                    <div className="farm" key={b.id}>
                      <div className="field">
                        <div className="soil-rows">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className="row" 
                              style={{ animationDelay: `${i * 0.2}s` }} 
                            />
                          ))}
                        </div>
                        <div className="crops-container">
                          {[...Array(Math.min(Math.floor(b.level/25) * 2 + 4, 12))].map((_, i) => (
                            <div 
                              key={i} 
                              className={`crop ${getLevelClass(b.level)}`} 
                              style={{ animationDelay: `${i * 0.3}s` }} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                  
                case "Bakery":
                  return (
                    <div className="bakery" key={b.id}>
                      <div className="chimney">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="smoke"
                            style={{ 
                              animationDelay: `${i * 0.6}s`,
                              width: '15px',
                              height: '15px',
                              top: `-${20 + i * 10}px`,
                              left: `${i * 5}px`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                  
                case "House":
                  return (
                    <div className="house" key={b.id}>
                      <div className="roof" />
                      <div className="window left" />
                      <div className="window right" />
                      <div className="door" />
                    </div>
                  );
                  
                case "School":
                  return (
                    <div className="school" key={b.id}>
                      <div className="roof" />
                      <div className="window w1" />
                      <div className="window w2" />
                      <div className="window w3" />
                      <div className="window w4" />
                      <div className="door" />
                    </div>
                  );
                case "Library":
                  return (
                    <div className="library" key={b.id}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`window w${i+1}`} />
                      ))}
                      <div className="door" />
                    </div>
                  );
                case "Hospital":
                  return (
                    <div className="hospital" key={b.id}>
                      <div className="red-cross" />
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`window w${i+1}`} />
                      ))}
                      <div className="door" />
                    </div>
                  );
                case "Park":
                  return (
                    <div className="park" key={b.id}>
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className={`tree t${i+1}`}>
                          <div className="tree-trunk" />
                          <div className="tree-crown" />
                        </div>
                      ))}
                    </div>
                  );
                case "Museum":
                  return (
                    <div className="building museum" key={b.id}>
                      <div className="sign">Museum</div>
                      <div className="columns">
                        <div className="column"></div>
                        <div className="column"></div>
                        <div className="column"></div>
                        <div className="column"></div>
                        <div className="column"></div>
                      </div>
                      <div className="stairs"></div>
                    </div>
                  );
                case "Skyscraper":
                  return (
                    <div className="skyscraper" key={b.id}>
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`window-row row${i+1}`}>
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="window" />
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                case "Stadium":
                  return (
                    <div className="stadium" key={b.id}>
                      <div className="scoreboard" />
                      <div className="field" />
                    </div>
                  );
                default:
                  return null;
              }
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default BuildCity;