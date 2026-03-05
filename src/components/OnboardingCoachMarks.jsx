import React, { useMemo, useState } from "react";
import { FaArrowRight, FaRegLightbulb } from "react-icons/fa";
import { BiCheckCircle } from "react-icons/bi";
import {
  SAMPLE_BALANCE_SNAPSHOT,
  SAMPLE_TRANSACTIONS,
  ONBOARDING_STEPS,
} from "../constants/onboardingSamples";

const OnboardingCoachMarks = ({
  onDismiss,
  persistKey = "walleta-home-onboarding",
  steps = ONBOARDING_STEPS,
  sampleBalance = SAMPLE_BALANCE_SNAPSHOT,
  sampleTransactions = SAMPLE_TRANSACTIONS,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const activeStep = steps[currentStep];

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(persistKey, "dismissed");
    }
    onDismiss?.();
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleComplete();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const stepBadges = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        status:
          index < currentStep ? "done" : index === currentStep ? "active" : "todo",
      })),
    [steps, currentStep]
  );

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="w-full rounded-2xl border border-dashed border-purple-300 bg-white/70 px-4 py-3 text-left shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <FaRegLightbulb className="text-purple-500" />
          <div>
            <p className="font-semibold text-sm text-purple-900">
              Guided walkthrough paused
            </p>
            <p className="text-xs text-purple-600">
              Tap to keep exploring sample balances and categories.
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <aside className="w-full rounded-3xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-lg transition-all duration-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-400">
            Guided onboarding
          </p>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaRegLightbulb className="text-purple-500" aria-hidden="true" />
            {activeStep.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            {activeStep.description}
          </p>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full border border-purple-200 px-3 py-1 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Minimise
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="rounded-full border border-transparent px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {stepBadges.map((step) => (
          <span
            key={step.id}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              step.status === "active"
                ? "bg-purple-100 text-purple-700"
                : step.status === "done"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {step.status === "done" ? (
              <span className="inline-flex items-center gap-1">
                <BiCheckCircle />
                {step.title}
              </span>
            ) : (
              step.title
            )}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-purple-500">
                Sample total balance
              </p>
              <p className="text-3xl font-bold text-purple-900">
                ฿{sampleBalance.totalBalance.toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-500 shadow">
              Coach tip
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">{sampleBalance.goal}</p>
          <div className="mt-4 space-y-2">
            {sampleBalance.categories.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>{category.name}</span>
                  <span>{category.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.percent}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-inner">
          <p className="text-xs font-semibold uppercase text-purple-400 tracking-[0.4em]">
            Sample timeline
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {sampleTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                  <span>{tx.name}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-base ${
                      tx.type === "INCOME" ? "text-green-600" : "text-rose-500"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}฿
                    {tx.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{tx.description}</p>
                <p className="text-[11px] text-gray-400 mt-1">{tx.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            setCurrentStep((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentStep === 0}
          className="flex-1 rounded-2xl border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-600 transition-all disabled:opacity-50"
        >
          Previous tip
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? "Got it" : "Next tip"}
          <FaArrowRight aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};

export default OnboardingCoachMarks;
