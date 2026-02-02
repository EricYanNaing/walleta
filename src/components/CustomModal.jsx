// src/components/CustomModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";

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
        "modal fixed top-0 left-0 z-50 w-screen h-screen",
        "backdrop-blur-sm bg-black/40",
        "flex items-center flex-col justify-center p-6",
        "transition-all duration-300",
        open ? "opacity-100" : "opacity-0",
      ].join(" ")}
      tabIndex={-1}
    >
      {/* Click-catcher for backdrop */}
      <div
        className="absolute top-0 left-0 z-[0] w-full h-full"
        tabIndex={-1}
      />

      <article
        className={[
          "modal-content relative m-0 rounded-2xl",
          "bg-white/95 backdrop-blur-md",
          "sm:my-16 flex flex-col shadow-2xl",
          "border border-white/20",
          "max-w-md w-full",
          "transform transition-all duration-300",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
        ].join(" ")}
        aria-describedby="modal-body"
      >
        {/* Icon Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center mb-4 shadow-lg">
            <IoWarningOutline className="text-white text-3xl" />
          </div>
          <h2
            id="modal-title"
            className="text-2xl font-bold text-gray-800 text-center"
          >
            {title}
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-red-600 hover:text-red-800"
          disabled={staticBackdrop}
        >
          <AiFillCloseCircle className="text-xl" />
        </button>

        <main id="modal-body" className="relative px-6 pb-6 text-center">
          <div className="text-gray-600 text-base">
            {children}
          </div>
        </main>

        <footer className="flex flex-shrink-0 items-center justify-center px-6 pb-6 gap-3">
          {showCancelBtn && (
            <button
              onClick={onClose}
              disabled={staticBackdrop}
              className="flex-1 px-6 py-3 font-semibold bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelBtnText || "Cancel"}
            </button>
          )}

          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 font-semibold bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            {confirmBtnText || "Confirm"}
          </button>
        </footer>
      </article>
    </div>
  );

  // Render to body so it sits above everything
  return createPortal(modal, document.body);
};

export default CustomModal;
