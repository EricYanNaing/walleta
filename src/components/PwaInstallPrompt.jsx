import React, { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { FaDownload, FaSyncAlt } from "react-icons/fa";

const PwaInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstallCard, setShowInstallCard] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.warn("PWA registration failed", error);
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setShowInstallCard(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowInstallCard(true);
    }
  }, [offlineReady, needRefresh]);

  const dismiss = () => {
    setShowInstallCard(false);
    setInstallEvent(null);
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    dismiss();
  };

  const handleRefresh = () => {
    updateServiceWorker(true);
    dismiss();
  };

  const shouldRender = showInstallCard;
  if (!shouldRender) return null;

  const headline = needRefresh
    ? "Update ready"
    : offlineReady
    ? "Offline mode is ready"
    : "Install Walleta for 1-tap access";

  const body = needRefresh
    ? "A new release is available. Reload to pick up the latest UI polish."
    : offlineReady
    ? "The app is cached on this device. You can track spending even without data."
    : "Add Walleta to your home screen for faster access and native gestures.";

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(92%,420px)] rounded-3xl border border-purple-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-500">
        PWA
      </p>
      <h4 className="mt-1 text-lg font-semibold text-gray-900">{headline}</h4>
      <p className="text-sm text-gray-600">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {needRefresh ? (
          <button
            onClick={handleRefresh}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FaSyncAlt aria-hidden="true" /> Reload now
          </button>
        ) : (
          <button
            onClick={handleInstall}
            disabled={!installEvent && !offlineReady}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FaDownload aria-hidden="true" /> Install app
          </button>
        )}
        <button
          onClick={dismiss}
          className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
