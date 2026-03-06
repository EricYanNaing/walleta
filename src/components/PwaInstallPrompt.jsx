import React, { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { FaDownload, FaSyncAlt } from "react-icons/fa";

const PwaInstallPrompt = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstallCard, setShowInstallCard] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
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
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isIos && !isStandalone) {
      setShowIosGuide(true);
      setShowInstallCard(true);
    }
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
    setShowIosGuide(false);
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

  const shouldRender = showInstallCard || showIosGuide;
  if (!shouldRender) return null;

  const baseHeadline = needRefresh
    ? "Update ready"
    : offlineReady
    ? "Offline mode is ready"
    : "Install Walleta for 1-tap access";
  const headline = showIosGuide && !needRefresh && !offlineReady
    ? "Install via Safari’s Share menu"
    : baseHeadline;

  const baseBody = needRefresh
    ? "A new release is available. Reload to pick up the latest UI polish."
    : offlineReady
    ? "The app is cached on this device. You can track spending even without data."
    : "Add Walleta to your home screen for faster access and native gestures.";
  const body = showIosGuide && !needRefresh && !offlineReady
    ? "iOS hides install banners. In Safari tap the Share icon → “Add to Home Screen”, then launch Walleta from the new icon to get the full PWA."
    : baseBody;

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
      {showIosGuide && !needRefresh && !offlineReady && (
        <ol className="mt-3 list-decimal pl-5 text-sm text-gray-600 space-y-1">
          <li>Open this site in Safari on your iPhone.</li>
          <li>Tap the Share icon, then choose “Add to Home Screen”.</li>
          <li>Open the new Walleta icon for the fullscreen app.</li>
        </ol>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {needRefresh ? (
          <button
            onClick={handleRefresh}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FaSyncAlt aria-hidden="true" /> Reload now
          </button>
        ) : showIosGuide ? (
          <button
            onClick={dismiss}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl"
          >
            I’ll add it manually
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
