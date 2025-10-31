import React, { useEffect, useState } from "react";
import CustomSelect from "../../components/CustomSelect";
import CustomButton from "../../components/CustomButton";
import { DatePicker } from "../../components/CustomCalendar";
import { useFormValidation } from "../../hooks/useValidateForm";
import { required, minLen, pattern, custom } from "../../utils/validate";
import { date } from "yup";
import { formatPrettyDate } from "../../utils/common";

const onlyDigits = pattern(/^\d+$/, "Digits only");

const crossFieldRule = async (values) => {
  const errs = {};
  if (values.isPrimary && !values.qrUrl) {
    errs.qrUrl = "QR is required when Primary is enabled";
  }
  return errs;
};

const TransactionForm = ({ isActive }) => {
  const [selected, setSelected] = useState("expense");

  const {
    values, errors, touched,
    handleChange, handleBlur,
    handleSubmit, isSubmitting
  } = useFormValidation({
    initialValues: {category: "", subCategory: "", amount: "" , description: "", date: "" },
    rules: {
      description: [required(), minLen(3)],
      amount: [
        required(),
        onlyDigits,
      ],
      date: [required(), date().typeError("Invalid date")],
    },
    formRule: crossFieldRule,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const incomeList = [
    {
      name: "salary",
      value: "salary",
    },
    {
      name: "bonus",
      value: "bonus",
    },
  ];

  const expenseList = [
    {
      name: "Food",
      value: "Food",
    },
    {
      name: "Transportation",
      value: "Transportation",
    },
    {
      name: "Glocery",
      value: "Glocery",
    },
    {
      name: "Games",
      value: "Games",
    },
  ];

  const toggleSubCategoryList = (v) => {
    if (v === "expense") {
      console.log("Selected Category :", v);
    } else {
      console.log("Selected Category :", v);
    }
  };

  const submitForm = handleSubmit(async (vals) => {
    console.log("Validated Values :", vals);
    const payload = {
      ...vals,
      date: formatPrettyDate(vals.date),
      category: selected,
      subCategory: selectedSubCategory.value,
    };
    console.log("Payload :", payload);
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState(
    expenseList[0]
  );

  const handleSelectChange = (subCategory) => {
    console.log("Selected option:", subCategory);
    setSelectedSubCategory(subCategory);
  };

  useEffect(() => {
    const formElement = document.getElementById("transactionForm");

    if (isActive === 1) {
      formElement.classList.add("animate__fadeIn");
    } else {
      formElement.classList.remove("animate__fadeIn");
    }
  }, [isActive]);

  useEffect(() => {
    toggleSubCategoryList(selected);
  }, [selected, setSelected]);

  return (
    <div
      onSubmit={submitForm}
      id="transactionForm"
      className="mt-5 space-y-3.5"
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

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <div className="text-purple-700 pt-3">
          <label htmlFor="subCategory">Sub Category</label>
          <CustomSelect
            className="mt-2"
            subCategoryList={selected === "expense" ? expenseList : incomeList}
            handleSelectChange={handleSelectChange}
            selectedSubCategory={selectedSubCategory}
          />
        </div>

        <div className="text-purple-700 pt-3">
          <label htmlFor="description">Description</label>
          <input
          
            type="text"
            placeholder="Enter the description"
            id="description"
            name="description"
            value={values.description}
            className="mt-2"
            onChange={handleChange({ name: "description" })}
            onBlur={handleBlur}
          />
          {touched.description && errors.description && (
          <span className="text-red-600 text-sm">{errors.description}</span>
        )}
        </div>

        <div className="text-purple-700 pt-3">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            onChange={handleChange({ name: "amount" })}
            onBlur={handleBlur}
            placeholder="Enter the amount"
            id="amount"
            value={values.amount}
            name="amount"
            className="mt-2"
          />
          {touched.amount && errors.amount && (
          <span className="text-red-600 text-sm">{errors.amount}</span>
        )}
        </div>

        <div className="pt-3">
          <label className="text-purple-700 " htmlFor="date">
            Date
          </label>
          <DatePicker
            name="date"
            mode="single"
            className="mt-2"
            value={values.date}
            onChange={handleChange({ name: "date", type: "isDate" })}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <CustomButton text={"Submit"} outline={false} onSubmit={submitForm} />
    </div>
  );
};

export default TransactionForm;
