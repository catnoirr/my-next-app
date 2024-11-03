import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <button onClick={onClose} className="absolute top-2 right-2">
          &times; {/* Close button */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
