import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import './Mine.css';

const MINE_DURATION = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
const CLAIM_AMOUNT = 18;

const Mine = () => {
  const { addToBalance } = useBalance();
  const [timeRemaining, setTimeRemaining] = useState(MINE_DURATION);
  const [miningStarted, setMiningStarted] = useState(false);
  const [canClaim, setCanClaim] = useState(false); // New state to track claim availability

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('mineData'));

    if (storedData) {
      const { startTime, miningComplete } = storedData;
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      if (miningComplete) {
        setCanClaim(true);
      } else if (elapsedTime < MINE_DURATION) {
        setTimeRemaining(MINE_DURATION - elapsedTime);
        setMiningStarted(true);
      } else {
        setCanClaim(true);
        localStorage.setItem('mineData', JSON.stringify({ ...storedData, miningComplete: true }));
      }
    }
  }, []);

  useEffect(() => {
    if (miningStarted) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            setCanClaim(true);
            localStorage.setItem('mineData', JSON.stringify({ ...JSON.parse(localStorage.getItem('mineData')), miningComplete: true }));
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [miningStarted]);

  const handleStartMining = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('mineData', JSON.stringify({ startTime: currentTime, miningComplete: false }));
    setMiningStarted(true);
    setCanClaim(false);
    setTimeRemaining(MINE_DURATION);
  };

  const handleClaim = () => {
    if (canClaim) {
      addToBalance(CLAIM_AMOUNT);
      localStorage.removeItem('mineData'); // Clear data after claiming
      setTimeRemaining(MINE_DURATION); // Reset timer
      setMiningStarted(false);
      setCanClaim(false);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="mine-container">
      <h1>Mine LXY Tokens</h1>
      <p>Level up with mining!</p>
      <p>Claim LXY and keep the mining site active!</p>
      <button className='button' onClick={handleStartMining} disabled={miningStarted || canClaim}>
        Start Mining
      </button>
      <button className='button' onClick={handleClaim} disabled={!canClaim}>
        Claim
      </button>
      <div className="timer">
        <span className='time'>Time Remaining: {formatTime(timeRemaining)}</span>
      </div>
    </div>
  );
};

export default Mine;
