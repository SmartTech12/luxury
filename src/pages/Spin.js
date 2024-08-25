import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext'; 
import './Spin.css';

const SpinWheel = () => {
    const { addToBalance } = useBalance();
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinsLeft, setSpinsLeft] = useState(3);

    const segments = [10, 1, -10, -25, 5, 2, -2, -4, 25, 15];
    const segmentAngle = 360 / segments.length;

    useEffect(() => {
        const storedSpins = localStorage.getItem('spinsLeft');
        const storedDate = localStorage.getItem('lastSpinDate');
        const today = new Date().toDateString();

        if (storedDate === today && storedSpins !== null) {
            setSpinsLeft(parseInt(storedSpins, 10));
        } else {
            setSpinsLeft(3);
            localStorage.setItem('spinsLeft', '3');
            localStorage.setItem('lastSpinDate', today);
        }
    }, []);

    const handleSpin = () => {
        if (isSpinning || spinsLeft === 0) return;

        setIsSpinning(true);
        const randomRotation = Math.ceil(Math.random() * 3600) + 3600;
        const newRotation = rotation + randomRotation;
        setRotation(newRotation);

        setTimeout(() => {
            const actualRotation = newRotation % 360;
            const segmentIndex = Math.floor((360 - actualRotation + segmentAngle / 2) % 360 / segmentAngle);
            const result = segments[segmentIndex];

            addToBalance(result); // Update the balance
            setIsSpinning(false);

            const newSpinsLeft = spinsLeft - 1;
            setSpinsLeft(newSpinsLeft);
            localStorage.setItem('spinsLeft', newSpinsLeft.toString());
        }, 4000);
    };

    return (
        <div className='body1'>
          <div className="spin-container">
              <div className="spin-spinsLeft">Spins Left: {spinsLeft}</div>
              <div className="spin-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                  {segments.map((value, index) => (
                      <div
                          key={index}
                          className="spin-number"
                          style={{ '--i': index + 1, '--clr': getColor(index) }}
                      >
                          <span>{value}</span>
                      </div>
                  ))}
              </div>
              <div className="spin-spinBtn" onClick={handleSpin} disabled={isSpinning || spinsLeft <= 0}>
                  Spin
              </div>
          </div>
        </div>
    );
};

const getColor = (index) => {
    const colors = ['#db7093', '#202baa', '#d63e92', '#daa520', '#ff340f', '#3cb371', '#ff7f50', '#4161e1', '#ffb6c1', '#32cd32'];
    return colors[index % colors.length];
};

export default SpinWheel;
