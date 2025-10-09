import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const baseStyle =
    "fixed top-40 right-5 text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-500 transform";
  const visibleStyle = "translate-x-0 opacity-100";
  const hiddenStyle = "translate-x-full opacity-0";
  const successStyle = "bg-green-500";
  const errorStyle = "bg-red-500";

  const typeStyle = type === "success" ? successStyle : errorStyle;
  const visibilityStyle = isVisible ? visibleStyle : hiddenStyle;

  return (
    <div className={`${baseStyle} ${typeStyle} ${visibilityStyle}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
