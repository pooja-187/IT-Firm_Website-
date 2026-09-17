import React, { useEffect } from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`toast toast-${toast.type}`}
      style={{
        display: 'block',
        opacity: 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      {toast.message}
    </div>
  );
};
export default Toast;
