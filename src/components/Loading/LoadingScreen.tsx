'use client';

import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 1000); // Delay giả lập cho CSS tải

    return () => clearTimeout(timeout);
  }, []);

  if (isLoaded) return null; // Không hiển thị loading sau khi hoàn tất

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="loader">
        <div className="ant-spin-dot ant-spin-dot-spin">
          <span className="ant-spin-dot-item"></span>
          <span className="ant-spin-dot-item"></span>
          <span className="ant-spin-dot-item"></span>
          <span className="ant-spin-dot-item"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
