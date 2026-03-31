import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  display: boolean;
  toggleModal: (val: boolean) => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ display, toggleModal, title, subTitle, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!display) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleModal(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [display, toggleModal]);

  const modalContent = (
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pb-28 pt-28 sm:pb-32 sm:pt-32">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/65 transition-opacity"
        onClick={() => toggleModal(false)}
      />
      {/* Content */}
      <div className="relative z-10 isolate flex max-h-[calc(100svh-14rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-modal animate-slide-up sm:max-h-[calc(100svh-15rem)] sm:p-7 dark:bg-card">
        {/* Close button */}
        <button
          className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => toggleModal(false)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {title && (
          <h2 className="mb-1 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        )}
        {subTitle && (
          <p className="mb-5 text-sm text-muted-foreground">{subTitle}</p>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );

  if (!display || !mounted) return null;

  return createPortal(modalContent, document.body);
};

export default Modal;
