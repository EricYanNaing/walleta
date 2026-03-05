import React from "react";
import {
  AUTH_TIPS,
  SAMPLE_BALANCE_SNAPSHOT,
  SAMPLE_TRANSACTIONS,
} from "../constants/onboardingSamples";

const AuthQuickTips = () => {
  const renderBody = () => (
    <div className="rounded-3xl border border-white/40 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
        First-time walkthrough
      </p>
      <h3 className="mt-1 text-2xl font-semibold text-gray-800">
        See how Paisa guides you
      </h3>
      <p className="text-sm text-gray-600">
        We preload smart categories, highlight balances, and nudge you when a field
        needs attention. Here is a quick preview.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {AUTH_TIPS.map((tip) => (
          <div
            key={tip.title}
            className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-3 shadow-inner"
          >
            <p className="text-xs font-semibold text-purple-500">{tip.title}</p>
            <p className="text-lg font-bold text-gray-900">{tip.metric}</p>
            <p className="text-xs text-gray-500">{tip.caption}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-gray-900/90 p-4 text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-purple-200">
          Sample split
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {SAMPLE_BALANCE_SNAPSHOT.categories.map((category) => (
            <div key={category.name} className="flex flex-col">
              <span className="text-sm font-semibold">{category.name}</span>
              <span className="text-xs text-white/70">
                ฿{category.value.toLocaleString()} · {category.percent}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/60">{SAMPLE_BALANCE_SNAPSHOT.goal}</p>
      </div>

      <div className="mt-4 space-y-2">
        {SAMPLE_TRANSACTIONS.slice(0, 2).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white/70 px-3 py-2 text-sm text-gray-700"
          >
            <div>
              <p className="font-semibold">{tx.name}</p>
              <p className="text-xs text-gray-500">{tx.description}</p>
            </div>
            <span
              className={`text-base font-semibold ${
                tx.type === "INCOME" ? "text-green-600" : "text-rose-500"
              }`}
            >
              {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="hidden lg:block">{renderBody()}</div>
      <details className="lg:hidden rounded-3xl border border-white/40 bg-white/40 p-4 backdrop-blur text-sm text-gray-700 shadow-lg">
        <summary className="cursor-pointer text-base font-semibold text-purple-700 focus:outline-none">
          Preview the in-app tips
        </summary>
        <div className="mt-3">{renderBody()}</div>
      </details>
    </div>
  );
};

export default AuthQuickTips;
