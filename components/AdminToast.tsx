import React, { useEffect } from 'react';

interface AdminToastProps {
  message: string | null;
  onClose?: () => void;
}

const AdminToast: React.FC<AdminToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-brand-navy text-white px-4 py-2 rounded shadow-lg font-bold">{message}</div>
    </div>
  );
};

export default AdminToast;
