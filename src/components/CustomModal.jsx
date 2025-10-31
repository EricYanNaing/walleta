// src/components/CustomModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";

const CustomModal = ({
  open,
  onClose,
  onSave,
  title = "Modal title",
  confirmBtnText,
  cancelBtnText,
  showCancelBtn = true,
  children,
  staticBackdrop = false, // if true: clicking backdrop / Escape won't close
}) => {
  const overlayRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("astroui-modal-open");
      return () => {
        document.body.style.overflow = prevOverflow || "";
        document.body.classList.remove("astroui-modal-open");
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && !staticBackdrop) onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, staticBackdrop]);

  // Backdrop click (only if not static)
  const handleBackdrop = (e) => {
    if (staticBackdrop) return;
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!open) return null;

  const modal = (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-labelledby="modal-title"
      onMouseDown={handleBackdrop}
      className={[
        "modal fixed top-0 left-0 z-50 w-screen h-screen bg-black/30",
        "flex items-center flex-col justify-center p-6",
        "transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0",
      ].join(" ")}
      tabIndex={-1}
    >
      {/* Click-catcher for backdrop (kept for structure parity) */}
      <div
        className="absolute top-0 left-0 z-[0] w-full h-full"
        tabIndex={-1}
      />

      <article
        className="modal-content relative m-0 rounded-md bg-white sm:my-16 flex flex-col shadow-lg text-purple-400"
        aria-describedby="modal-body"
      >
        <header className="flex p-4 items-center justify-between">
          <h2
            id="modal-title"
            className="m-0 text-xl font-medium max-w-[calc(100%_-_3rem)]"
          >
            {title}
          </h2>
          <div
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent transition-colors duration-300 hover:bg-black/10"
            disabled={staticBackdrop}
          >
            <AiFillCloseCircle />
          </div>
        </header>

        <main id="modal-body" className="relative p-4">
          {children}
        </main>

        <footer className="flex flex-shrink-0 flex-wrap items-center justify-center p-4 gap-2">
          {showCancelBtn && (
            <div
              onClick={onClose}
              disabled={staticBackdrop}
              className="flex items-center justify-center px-4 font-medium bg-gray-200 text-black h-9 rounded-md hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
            >
              {cancelBtnText || "Cancel"}
            </div>
          )}

          <div
            onClick={onSave}
            className="flex items-center justify-center px-4 font-medium bg-violet-700 text-white h-9 rounded-md hover:bg-violet-800 transition-all duration-300"
          >
            {confirmBtnText || "Save"}
          </div>
        </footer>
      </article>
    </div>
  );

  // Render to body so it sits above everything
  return createPortal(modal, document.body);
};

export default CustomModal;
