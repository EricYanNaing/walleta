import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { required, minLen, pattern, custom } from "../../utils/validate";
import { useFormValidation } from "../../hooks/useValidateForm";
import { BiRadioCircle } from "react-icons/bi";
import { BiRadioCircleMarked } from "react-icons/bi";
import { getSubCategoryList, createSubCategory } from "../../api";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const crossFieldRule = async (values) => {
  const errs = {};
  if (values.isPrimary && !values.qrUrl) {
    errs.qrUrl = "QR is required when Primary is enabled";
  }
  return errs;
};

const SubCategoryForm = ({ isActive }) => {
  const [selected, setSelected] = useState("EXPENSE");
  const { user } = useAuthStore();

  const {
    values, errors, touched,
    handleChange, handleBlur,
    handleSubmit, isSubmitting
  } = useFormValidation({
    initialValues: { category: "", subCategory: "", },
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
      userId: user.id,
      type: selected,
      name: vals.subCategory,
    };
    try {
      const { data, status } = await createSubCategory(payload);
      if (status === 201) {
        console.log("Created Sub-Category :", data);
        toast.success("Sub-Category created successfully");
        values.subCategory = "";
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Failed to create Sub-Category");
    }
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
        {/* EXPENSE */}
        <div
          onClick={() => setSelected("EXPENSE")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <BiRadioCircle
            className={
              selected === "EXPENSE" ? "hidden" : "block text-gray-400"
            }
          />
          <BiRadioCircleMarked
            className={
              selected === "EXPENSE" ? "block text-purple-700" : "hidden"
            }
          />
          <span
            className={`flex items-center gap-2 ${selected === "EXPENSE" ? "text-purple-700" : "text-black"
              }`}
          >
            Expense
          </span>
        </div>

        {/* INCOME */}
        <div
          onClick={() => setSelected("INCOME")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <BiRadioCircle
            className={selected === "INCOME" ? "hidden" : "block text-gray-400"}
          />
          <BiRadioCircleMarked
            className={
              selected === "INCOME" ? "block text-purple-700" : "hidden"
            }
          />
          <span
            className={`flex items-center gap-2 ${selected === "INCOME" ? "text-purple-700" : "text-black"
              }`}
          >
            INCOME
          </span>
        </div>
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
