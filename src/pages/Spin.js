import React, { useState, useEffect } from 'react';
import './Spin.css';
import { useBalance } from '../contexts/BalanceContext'; // Correct import for context

const SpinWheel = () => {
    let rotation = 0;
    const segments = [10, 1, -10, -25, 5, 2, -2, -4, 25, 15]; // Values on the wheel
    const segmentAngle = 360 / segments.length; // Angle of each segment

    const { balance, addToBalance } = useBalance(); // Correctly use the context

    const getSpinsLeft = () => parseInt(localStorage.getItem('spinsLeft'), 10);
    const getIsSpinning = () => document.querySelector('.spinBtn').getAttribute('data-spinning') === 'true';

    const setSpinsLeft = (spinsLeft) => {
        localStorage.setItem('spinsLeft', spinsLeft);
        document.querySelector('.spinsLeft').textContent = `Spins Left: ${spinsLeft}`;
    };

    const setIsSpinning = (spinning) => {
        document.querySelector('.spinBtn').setAttribute('data-spinning', spinning);
    };

    const initializeSpins = () => {
        const storedSpins = localStorage.getItem('spinsLeft');
        const storedDate = localStorage.getItem('lastSpinDate');
        const today = new Date().toDateString();

        if (storedDate === today && storedSpins !== null) {
            setSpinsLeft(parseInt(storedSpins, 10));
        } else {
            setSpinsLeft(3);
            localStorage.setItem('lastSpinDate', today);
        }

        setIsSpinning(false);
    };

    const handleSpin = () => {
        const spinsLeft = getSpinsLeft();
        const isSpinning = getIsSpinning();

        if (isSpinning || spinsLeft === 0) return;

        setIsSpinning(true);
        const randomRotation = Math.ceil(Math.random() * 3600) + 3600;
        const newRotation = rotation + randomRotation;
        rotation = newRotation;

        setTimeout(() => {
            const actualRotation = newRotation % 360;
            const segmentIndex = Math.floor((360 - actualRotation + segmentAngle / 2) % 360 / segmentAngle);
            const result = segments[segmentIndex];

            console.log('Landed on: ', result); // For debugging

            // Add the result to the current balance
            addToBalance(result); // Correct function usage

            setIsSpinning(false);
            setSpinsLeft(spinsLeft - 1);
        }, 4000);

        document.querySelector('.wheel').style.transform = `rotate(${newRotation}deg)`;
    };

    useEffect(() => {
        initializeSpins();
    }, []);

    return (
        <div className='body3'>
            <div className="container">
                <div className="spinText">Spin the wheel</div>
                <span className='spinsLeft'>Spins Left: 3</span>
                <div className="spinBtn" data-spinning="false" onClick={handleSpin}>
                    Spin
                </div>
                <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                    {segments.map((value, index) => (
                        <div key={index} className="number" style={{ '--i': index + 1 }}>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default SpinWheel;
