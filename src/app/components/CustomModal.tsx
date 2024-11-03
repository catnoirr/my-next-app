// src/app/components/CustomModal.tsx
import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Add title here, making it optional if needed
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-2xl z-10 transform transition-transform duration-300 ease-out scale-90 opacity-0 animate-modal-open"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {children}
      </div>

      {/* Styles for modal open animation */}
      <style jsx>{`
        @keyframes modal-open {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-open {
          animation: modal-open 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomModal;
