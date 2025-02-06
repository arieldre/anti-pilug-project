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

const thresholds = [10, 25, 50, 100];

const initialBuildings: Building[] = [
  { id: 1, name: "Farm", baseCost: 50, level: 0, baseIncome: 1, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 2, name: "Bakery", baseCost: 150, level: 0, baseIncome: 3, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 3, name: "House", baseCost: 500, level: 0, baseIncome: 10, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 4, name: "School", baseCost: 1200, level: 0, baseIncome: 25, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 5, name: "Library", baseCost: 3000, level: 0, baseIncome: 50, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 6, name: "Hospital", baseCost: 8000, level: 0, baseIncome: 100, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 7, name: "Park", baseCost: 20000, level: 0, baseIncome: 200, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 8, name: "Museum", baseCost: 50000, level: 0, baseIncome: 500, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 9, name: "Skyscraper", baseCost: 120000, level: 0, baseIncome: 1000, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
  { id: 10, name: "Stadium", baseCost: 300000, level: 0, baseIncome: 2500, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 },
];

const BuildCity: React.FC = () => {
  // Core game state
  const [money, setMoney] = useState(0);
  const [tapValue, setTapValue] = useState(1);
  const [tapUpgradeCost, setTapUpgradeCost] = useState(50);
  const [totalTaps, setTotalTaps] = useState(0);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Derived stats
  const totalBuildingLevels = buildings.reduce((acc, b) => acc + b.level, 0);
  const totalIncome = buildings.reduce((acc, b) => acc + (b.level * b.baseIncome * b.efficiencyMultiplier), 0);

  // Manual tap: add tapValue to money and count the tap
  const handleTap = () => {
    setMoney(prev => prev + tapValue);
    setTotalTaps(prev => prev + 1);
  };

  // Upgrade tap: increases tapValue and scales up its cost
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

  // Reset game: resets all game state (with confirmation).
  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setMoney(0);
      setTapValue(1);
      setTapUpgradeCost(50);
      setTotalTaps(0);
      setBuildings(initialBuildings.map(b => ({ ...b, level: 0, efficiencyMultiplier: 1, nextBigUpgradeIndex: 0 })));
      setAchievements([]);
    }
  };

  return (
    <div className="build-city-game">
      <header className="game-header">
        <h1>Build Your Community</h1>
      </header>
      
      <section className="stats-panel">
        <div className="stat">
          <span className="label">Money:</span>
          <span className="value">${money.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="label">Tap Value:</span>
          <span className="value">{tapValue}</span>
        </div>
        <div className="stat">
          <span className="label">Income/sec:</span>
          <span className="value">{totalIncome.toFixed(0)}</span>
        </div>
        <div className="stat">
          <span className="label">Total Taps:</span>
          <span className="value">{totalTaps}</span>
        </div>
      </section>
      
      <section className="tap-section">
        <button className="tap-button" onClick={handleTap}>
          Tap!
        </button>
        <button className="upgrade-tap-button" onClick={upgradeTap} disabled={money < tapUpgradeCost}>
          Upgrade Tap (Cost: ${tapUpgradeCost})
        </button>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </section>

      <section className="achievements-section">
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

      <section className="buildings-section">
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
            return (
              <div key={b.id} className="building-card">
                <h3>{b.name}</h3>
                <p>Level: {b.level}</p>
                <p>Income: ${(b.level * b.baseIncome * b.efficiencyMultiplier).toFixed(0)}/sec</p>
                <button onClick={() => buyBuilding(b.id)} disabled={money < cost}>
                  Buy (Cost: ${cost})
                </button>
                {showBigUpgrade && (
                  <button onClick={() => upgradeBuildingEfficiency(b.id)} disabled={money < bigUpgradeCost}>
                    Big Upgrade (Cost: ${bigUpgradeCost})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default BuildCity;
