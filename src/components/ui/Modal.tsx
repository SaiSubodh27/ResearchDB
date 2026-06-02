import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-card rounded-card shadow-xl z-50 w-full sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-border-light flex-shrink-0">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-sidebar truncate mr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 touch-target"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
          {children}
        </div>

        {actions && (
          <div className="border-t border-border-light p-4 sm:p-5 md:p-6 flex gap-3 justify-end flex-shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
