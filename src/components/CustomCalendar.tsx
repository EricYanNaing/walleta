import React, { useEffect, useMemo, useRef, useState } from "react";

// -----------------------------
// Utilities
// -----------------------------
type Mode = "single" | "range";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function firstDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay(); // 0 (Sun) - 6 (Sat)
}

function clamp(d: Date, min?: Date, max?: Date) {
  let x = d;
  if (min && x < min) x = min;
  if (max && x > max) x = max;
  return x;
}

function fmt(d?: Date | null) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYYYYMMDD(s: string) {
  const m = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d as unknown as number) ? null : d;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// -----------------------------
// DatePicker Component
// -----------------------------
export type DatePickerProps = {
  mode?: Mode; // default 'single'
  value?: Date | [Date | null, Date | null];
  onChange?: (v: Date | [Date | null, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (d: Date) => boolean;
  placeholder?: string;
  className?: string;
  startWeekOn?: 0 | 1; // 0=Sunday, 1=Monday
  closeOnSelect?: boolean; // default true
  label?: string;
  readOnlyInput?: boolean; // default true (display-only)
};

function useOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

export function DatePicker({
  mode = "single",
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  placeholder = "Select date",
  className = "",
  startWeekOn = 0,
  closeOnSelect = true,
  label,
  readOnlyInput = true,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);

  const initialDate = useMemo(() => {
    if (mode === "single") {
      return startOfDay((value as Date) || today);
    } else {
      const [a, b] = (value as [Date | null, Date | null]) || [];
      return startOfDay(a || b || today);
    }
  }, [mode, value, today]);

  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date(initialDate));
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useOutsideClick(rootRef, () => setOpen(false));

  // Derived display text
  const displayText = useMemo(() => {
    if (mode === "single") return fmt(value as Date);
    const [a, b] = (value as [Date | null, Date | null]) || [];
    return [fmt(a || undefined), fmt(b || undefined)].filter(Boolean).join(" → ");
  }, [value, mode]);

  // Build calendar grid
  const { year, month } = useMemo(() => ({ year: visibleMonth.getFullYear(), month: visibleMonth.getMonth() }), [visibleMonth]);

  const monthMatrix = useMemo(() => {
    const totalDays = daysInMonth(year, month);
    let first = firstDayOfMonth(year, month); // 0-6
    if (startWeekOn === 1) first = (first + 6) % 7; // shift if Monday start

    const cells: (Date | null)[] = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
    // pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month, startWeekOn]);

  // Selection helpers
  const inRange = (d: Date) => {
    if (mode !== "range") return false;
    const [a, b] = (value as [Date | null, Date | null]) || [];
    if (!a || !b) return false;
    const s = startOfDay(a).getTime();
    const e = startOfDay(b).getTime();
    const t = startOfDay(d).getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  };

  const isDisabled = (d: Date) => {
    if (minDate && d < startOfDay(minDate)) return true;
    if (maxDate && d > startOfDay(maxDate)) return true;
    if (disabledDates && disabledDates(d)) return true;
    return false;
  };

  const selectDate = (d: Date) => {
    if (isDisabled(d)) return;
    if (mode === "single") {
      onChange?.(d);
      if (closeOnSelect) setOpen(false);
    } else {
      const [a, b] = (value as [Date | null, Date | null]) || [null, null];
      if (a && !b) {
        // second click
        const first = startOfDay(a);
        const second = startOfDay(d);
        onChange?.([first, second]);
        if (closeOnSelect) setOpen(false);
      } else {
        // first click or reset
        onChange?.([startOfDay(d), null]);
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!gridRef.current) return;
    const focusEl = document.activeElement as HTMLElement | null;

    const moveFocus = (days: number) => {
      const current = parseYYYYMMDD(focusEl?.dataset.date || "");
      const base = current ?? new Date(year, month, 1);
      const target = new Date(base);
      target.setDate(base.getDate() + days);
      setVisibleMonth(new Date(target.getFullYear(), target.getMonth(), 1));
      requestAnimationFrame(() => {
        const sel = gridRef.current?.querySelector<HTMLElement>(`[data-date="${fmt(target)}"]`);
        sel?.focus();
      });
    };

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(7);
        break;
      case "PageUp":
        e.preventDefault();
        setVisibleMonth(addMonths(visibleMonth, -1));
        break;
      case "PageDown":
        e.preventDefault();
        setVisibleMonth(addMonths(visibleMonth, 1));
        break;
      case "Home":
        e.preventDefault();
        moveFocus(-(new Date(year, month, 1).getDay()));
        break;
      case "End":
        e.preventDefault();
        moveFocus(daysInMonth(year, month));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusEl?.dataset.date) {
          const d = parseYYYYMMDD(focusEl.dataset.date);
          if (d) selectDate(d);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const headerLabel = useMemo(() => visibleMonth.toLocaleString(undefined, { month: "long", year: "numeric" }), [visibleMonth]);

  return (
    <div className={`w-full cursor-pointer ${className}`} ref={rootRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <div
          onClick={() => setOpen((o) => !o)}
          className="w-full rounded-xl text-sm text-purple-400 border border-purple-400 px-3 py-2 text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <span className={`text-[12px] ${displayText ? "" : "text-purple-3400 text-sm"}`}>{displayText || placeholder}</span>
        </div>

        {open && (
          <div
            className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl p-3 md:right-0"
            role="dialog"
            aria-label="Date picker"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-1 py-1">
              <div
                onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
                className="inline-flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg bg-purple-700 hover:bg-purple-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Previous month"
              >
                ‹
              </div>

              <div className="font-medium text-gray-900 select-none">{headerLabel}</div>

              <div
                onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
                className="inline-flex h-8 w-8 items-center justify-center cursor-pointer rounded-lg bg-purple-700 hover:bg-purple-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Next month"
              >
                ›
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 px-1 pb-1 text-xs font-semibold text-gray-500">
              {Array.from({ length: 7 }).map((_, i) => {
                const idx = startWeekOn === 1 ? ((i + 1) % 7) : i;
                return (
                  <div key={i} className="text-center">
                    {WEEKDAY_LABELS[idx]}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div ref={gridRef} className="grid grid-cols-7 gap-1 p-1 text-black" aria-label="Calendar dates">
              {monthMatrix.map((cell, i) => {
                if (!cell) return <div key={i} className="h-9" />;

                const disabled = isDisabled(cell);
                const selectedSingle = mode === "single" && isSameDay(value as Date, cell);
                const [a, b] = (mode === "range" ? (value as [Date | null, Date | null]) : [null, null]) as [Date | null, Date | null];
                const isStart = mode === "range" && a && isSameDay(a, cell);
                const isEnd = mode === "range" && b && isSameDay(b, cell);
                const between = inRange(cell) && !isStart && !isEnd;
                const isToday = isSameDay(cell, today);

                return (
                  <div
                    key={fmt(cell)}
                    data-date={fmt(cell)}
                    onClick={() => selectDate(cell)}
                    className={[
                      "h-9 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-center leading-9 cursor-pointer",
                      "transition-colors",
                      disabled ? "text-black cursor-not-allowed" : "hover:bg-purple-400 hover:text-white",
                      selectedSingle || isStart || isEnd ? "bg-purple-400 text-white hover:bg-purple-600" : "",
                      between ? "bg-purple-100 text-purple-900" : "",
                      isToday && !selectedSingle && !isStart && !isEnd && !between ? "ring-1 ring-purple-400" : "",
                    ].join(" ")}
                  >
                    {cell.getDate()}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="text-xs text-gray-500 select-none">Today: {fmt(today)}</div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => {
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    selectDate(today);
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg border border-purple-400 hover:bg-gray-50 text-black"
                >
                  Today
                </div>
                <div
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-400 hover:text-white"
                >
                  Done
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

