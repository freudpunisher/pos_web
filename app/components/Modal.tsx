import React from "react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          X
        </button>
        {children}
      </div>
    </div>
  );
}
