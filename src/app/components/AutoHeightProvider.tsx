'use client';

import { useEffect } from 'react';

export default function AutoHeightProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const updateHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height }, "*");
    };
    
    // Cập nhật chiều cao ngay lập tức
    updateHeight();
    
    // Lắng nghe sự kiện resize
    window.addEventListener("resize", updateHeight);
    
    // Cập nhật chiều cao khi content thay đổi
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
