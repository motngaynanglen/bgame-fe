'use client';

import { useEffect } from 'react';

const PreloadAntdCSS = () => {
  useEffect(() => {
    // Tạo thẻ <link> để preload CSS
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.4.1/antd.min.css';
    link.as = 'style';
    link.onload = () => {
      link.rel = 'stylesheet'; // Chuyển thành stylesheet sau khi tải xong
    };

    // Thêm thẻ <link> vào <head>
    document.head.appendChild(link);

    // Dọn dẹp khi component bị unmount
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null; // Không cần render gì
};

export default PreloadAntdCSS;
