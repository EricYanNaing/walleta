// validation.js
export const required = (msg = "This field is required") => (v) =>
  v === undefined || v === null || v === "" ? msg : null;

export const minLen = (n, msg = `Must be at least ${n} characters`) => (v) =>
  typeof v === "string" && v.length < n ? msg : null;

export const maxLen = (n, msg = `Must be at most ${n} characters`) => (v) =>
  typeof v === "string" && v.length > n ? msg : null;

export const confirmPassword = (password, msg = "Passwords do not match") => (v) =>
  v !== password ? msg : null;

export const pattern = (re, msg = "Invalid format") => (v) =>
  v && !re.test(String(v)) ? msg : null;

// For ad-hoc rules (sync or async)
export const custom = (fn) => async (v, values) => fn(v, values);

// validate.js
export async function runFieldRules(rules = [], value, values, ctx = { field: "unknown" }) {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (typeof rule !== "function") {
      console.error(
        `Validation rule for field "${ctx.field}" at index ${i} is not a function:`,
        rule
      );
      // Skip bad entries instead of crashing
      continue;
    }

    const maybe = rule(value, values);
    const res = maybe && typeof maybe.then === "function" ? await maybe : maybe;
    if (res) return res;
  }
  return null;
}