// useFormValidation.js
import { useCallback, useMemo, useState } from "react";
import { runFieldRules } from "../utils/validate";

export function useFormValidation({
  initialValues,
  rules = {},
  formRule,              // optional: (values) => Errors | Promise<Errors>
  validateOnBlur = true,
  validateOnChange = false,
}) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  const setFieldValue = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  const validateField = useCallback(
    async (name) => {
      const err = await runFieldRules(rules[name] ?? [], values[name], values, { field: name });
      setErrors((e) => ({ ...e, [name]: err }));
      return err;
    },
    [rules, values]
  );

  const validateForm = useCallback(async () => {
    const nextErrors = {};
    const allKeys = Object.keys({ ...values, ...rules });

    for (const key of allKeys) {
      nextErrors[key] = await runFieldRules(rules[key] || [], values[key], values, { field: key });
    }

    if (formRule) {
      const formErrs = await formRule(values);
      Object.assign(nextErrors, formErrs);
    }

    setErrors(nextErrors);
    return nextErrors;
  }, [rules, values, formRule]);

  const handleChange = useCallback(
  (extra) => async (eOrValue) => {
    // Handle both custom and normal events
    console.log("handleChange Event :", eOrValue, "Extra:", extra);

    let name, value;

    // If your custom component sends a normal event:
    if (eOrValue?.target) {
      const { type, checked } = eOrValue.target;
      name = eOrValue.target.name;
      value = type === "checkbox" ? checked : eOrValue.target.value;
    }
    // If it sends { name, value } or raw value:
    else if (typeof eOrValue === "object" && "name" in eOrValue) {
      name = eOrValue.name;
      value = eOrValue.value;
    } else {
      // fallback for direct value (when you manually define name via `extra`)
      name = extra?.name || "date";
      value = eOrValue;
    }

    setFieldValue(name, value);
    if (validateOnChange) await validateField(name);
  },
  [setFieldValue, validateOnChange, validateField]
);

  const handleBlur = useCallback(
    async (e) => {
      const { name } = e.target;
      setTouched((t) => ({ ...t, [name]: true }));
      if (validateOnBlur) await validateField(name);
    },
    [validateOnBlur, validateField]
  );

  const handleSubmit = useCallback(
    (onValid) =>
      async (e) => {
        e && e.preventDefault();
        setSubmitting(true);
        try {
          const errs = await validateForm();
          console.log("Validation Errors:", errs);
          const hasError = Object.values(errs).some(Boolean);
          if (!hasError) {
            await onValid(values);
          } else {
            const allTouched = Object.keys({ ...values, ...rules }).reduce(
              (acc, k) => ((acc[k] = true), acc),
              {}
            );
            setTouched(allTouched);
          }
        } finally {
          setSubmitting(false);
        }
      },
    [validateForm, values, rules]
  );

  return useMemo(
    () => ({
      values,
      errors,
      touched,
      isSubmitting,
      setValues,
      setErrors,
      setTouched,
      setFieldValue,
      validateField,
      validateForm,
      handleChange,
      handleBlur,
      handleSubmit,
    }),
    [values, errors, touched, isSubmitting, setFieldValue, validateField, validateForm, handleChange, handleBlur, handleSubmit]
  );
}