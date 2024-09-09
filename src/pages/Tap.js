import React, { useState, useEffect } from 'react';
import './Tap.css';
import tapImage from '../assets/icons/My_Coin.gif'; 

function Tap() {
  // Initialize state from localStorage
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseFloat(savedBalance) : 0;
  });
  
  const [taps, setTaps] = useState(() => {
    const savedTaps = localStorage.getItem('taps');
    return savedTaps ? parseInt(savedTaps, 10) : 0;
  });

  // Sync localStorage balance with component state on update
  useEffect(() => {
    localStorage.setItem('balance', balance.toFixed(3));
    localStorage.setItem('taps', taps);
  }, [balance, taps]);

  const handleTap = () => {
    setBalance(prevBalance => prevBalance + 0.001); // Increment balance by 0.001
    setTaps(prevTaps => prevTaps + 1); // Increment tap count
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms if supported
    }
  };

  return (
    <div className="tap-container">
      <h1>Luxurybot</h1>
      <div className="tap-image-container">
        <img
          src={tapImage}
          alt="Tap to increase balance"
          className="tap-image"
          onClick={handleTap}
        />
      </div>
      <p className='p'>Tap the Luxury Coin</p>
      <div className="balance-info">
        <p><strong>Current Balance:</strong> {balance.toFixed(3)} LXY</p>
        <p><strong>Tap Count:</strong> {taps}</p>
      </div>
    </div>
  );
}

export default Tap;
