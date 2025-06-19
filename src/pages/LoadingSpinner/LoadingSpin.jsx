import React, { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 20); // كل 20ms يزود 1%

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div>Loading... {progress}%</div>
      <div style={{ width: `${progress}%`, height: '5px', background: '#f1c40f' }}></div>
    </div>
  );
};
