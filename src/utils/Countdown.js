import { useState, useEffect } from 'react';

const Countdown = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      completed: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.completed) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.completed) {
    return (
      <div className="text-center">
        <div className="text-3xl font-bold text-red-500">EXPIRED</div>
        <p className="text-sm opacity-90 mt-2">Departure time has passed</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(timeLeft).map(([unit, value]) => {
        if (unit === 'completed') return null;

        return (
          <div key={unit} className="text-center">
            <div className="bg-white bg-opacity-20 rounded-lg py-3">
              <div className="text-3xl md:text-4xl font-bold">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider mt-1">
                {unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Countdown;
