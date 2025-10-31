import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { required, minLen, pattern, custom } from "../../utils/validate";
import { useFormValidation } from "../../hooks/useValidateForm";

const crossFieldRule = async (values) => {
  const errs = {};
  if (values.isPrimary && !values.qrUrl) {
    errs.qrUrl = "QR is required when Primary is enabled";
  }
  return errs;
};

const SubCategoryForm = ({ isActive }) => {
  const [selected, setSelected] = useState("expense");

  const {
      values, errors, touched,
      handleChange, handleBlur,
      handleSubmit, isSubmitting
    } = useFormValidation({
      initialValues: {category: "", subCategory: "", },
      rules: {
        subCategory: [required(), minLen(3)],
      },
      formRule: crossFieldRule,
      validateOnBlur: true,
      validateOnChange: true,
    });

  const submitForm = handleSubmit(async (vals) => {
    console.log("Form Values :", vals);
    const payload = {
      category: selected,
      subCategory: vals.subCategory,
    };
    console.log("Payload :", payload);
  });

  useEffect(() => {
    const formElement = document.getElementById("subCategoryForm");

    if (isActive === 2) {
      formElement.classList.add("animate__fadeIn");
    } else {
      formElement.classList.remove("animate__fadeIn");
    }
  }, [isActive]);

  return (
    <form
      onSubmit={submitForm}
      id="subCategoryForm"
      className="mt-5 space-y-3.5 wow"
    >
      <div className="flex items-center gap-5">
        <label
          className={`flex items-center gap-2 ${
            selected === "expense" ? "text-purple-700" : "text-black"
          }`}
        >
          <input
            type="radio"
            name="browser"
            value={selected}
            checked={selected === "expense"}
            onChange={() => setSelected("expense")}
            className={`accent-purple-600 ${
              selected === "expense" ? "text-purple-700" : "text-black"
            }`}
          />
          Expense
        </label>

        <label
          className={`flex items-center gap-2 ${
            selected === "income" ? "text-purple-700" : "text-black"
          }`}
        >
          <input
            type="radio"
            name="browser"
            value={selected}
            checked={selected === "income"}
            onChange={() => setSelected("income")}
            className={`accent-purple-600 ${
              selected === "income" ? "text-purple-700" : "text-black"
            }`}
          />
          Income
        </label>
      </div>

      <div className="text-purple-700 pt-3">
        <label htmlFor="subCategory">Category Name</label>
        <input
          type="text"
          placeholder="Enter Category Name"
          id="subCategory"
          value={values.subCategory}
          name="subCategory"
          className="mt-2"
          onChange={handleChange({ name: "subCategory" })}
          onBlur={handleBlur}
        />
        {touched.subCategory && errors.subCategory && (
          <span className="text-red-600 text-sm">{errors.subCategory}</span>
        )}
      </div>

      <CustomButton text={"Submit"} outline={false} onSubmit={submitForm} />
    </form>
  );
};

export default SubCategoryForm;
