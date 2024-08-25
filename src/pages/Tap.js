import React, { useState, useEffect } from 'react';
import './Tap.css';
import tapImage from '../assets/icons/My_Coin.gif'; 
import supabase from '../supabaseClient'; // Adjust path as necessary

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

  // Fetch balance and taps from Supabase on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from('user_balance')
        .select('balance, taps')
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
      } else {
        const balanceFromDB = data.balance || 0;
        const tapsFromDB = data.taps || 0;
        setBalance(balanceFromDB);
        setTaps(tapsFromDB);
        localStorage.setItem('balance', balanceFromDB.toFixed(3));
        localStorage.setItem('taps', tapsFromDB);
      }
    };

    fetchBalance();
  }, []);

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
      <h1>Tap to Earn LXY</h1>
      <p>Tap the image below to increase your balance!</p>
      <div className="tap-image-container">
        <img
          src={tapImage}
          alt="Tap to increase balance"
          className="tap-image"
          onClick={handleTap}
        />
      </div>
      <div className="balance-info">
        <p><strong>Current Balance:</strong> {balance.toFixed(3)} LXY</p>
        <p><strong>Tap Count:</strong> {taps}</p>
      </div>
    </div>
  );
}

export default Tap;
