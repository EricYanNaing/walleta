import React, { useEffect, useState } from "react";
import CustomSelect from "../../components/CustomSelect";
import CustomButton from "../../components/CustomButton";
import { DatePicker } from "../../components/CustomCalendar";
import { useFormValidation } from "../../hooks/useValidateForm";
import { required, minLen, pattern, custom } from "../../utils/validate";
import { date } from "yup";
import { formatPrettyDate, formatDateForApi } from "../../utils/common";
import { BiRadioCircle } from "react-icons/bi";
import { BiRadioCircleMarked } from "react-icons/bi";
import { getSubCategoryList, createTransaction } from "../../api";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const onlyDigits = pattern(/^\d+$/, "Digits only");

const crossFieldRule = async (values) => {
  const errs = {};
  if (values.isPrimary && !values.qrUrl) {
    errs.qrUrl = "QR is required when Primary is enabled";
  }
  return errs;
};

const TransactionForm = ({ isActive }) => {
  const [selected, setSelected] = useState("EXPENSE");
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const { user } = useAuthStore();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormValidation({
    initialValues: {
      type: "",
      subCategoryId: "",
      amount: "",
      description: "",
      date: "",
    },
    rules: {
      description: [required(), minLen(3)],
      amount: [required(), onlyDigits],
      date: [required(), date().typeError("Invalid date")],
    },
    formRule: crossFieldRule,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const toggleSubCategoryList = (v) => {
    if (v === "EXPENSE") {
      console.log("Selected Category :", v);
    } else {
      console.log("Selected Category :", v);
    }
  };

  const submitForm = handleSubmit(async (vals) => {
    console.log("Validated Values :", vals);
    const payload = {
      ...vals,
      amount: parseInt(vals.amount),
      userId: user.id,
      date: formatDateForApi(vals.date),
      type: selected,
      subCategoryId: selectedSubCategory.id,
    };
    try {
      const { data, status } = await createTransaction(payload);
      if (status === 201) {
        toast.success("Transaction created successfully");
        values.amount = "";
        values.description = "";
        values.date = "";
        setSelectedSubCategory(expenseList[0]);
      }

    } catch (error) {
      console.log("Error creating transaction:", error);
    }
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState();

  const handleSelectChange = (subCategory) => {
    console.log("Selected option:", subCategory);
    setSelectedSubCategory(subCategory);
  };

  const getSubCategories = async () => {
    try {
      const payload = {
        type: selected,
      };
      const { data, status } = await getSubCategoryList(payload);
      if (status === 200) {
        console.log("Fetched Sub-Categories:", data?.data);
        if (selected === "EXPENSE") {
          setExpenseList(data?.data);
        } else {
          setIncomeList(data?.data);
        }
      }
    } catch (error) {
      console.log("Error fetching sub-categories:", error);
    }
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
    getSubCategories();
  }, [selected, setSelected]);

  return (
    <div
      onSubmit={submitForm}
      id="transactionForm"
      className="mt-5 space-y-3.5"
    >
      <div className="flex items-center gap-5">
        {/* Expense */}
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

        {/* Income */}
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
            Income
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <div className="text-purple-700 pt-3">
          <label htmlFor="subCategory">Sub Category</label>
          <CustomSelect
            className="mt-2"
            subCategoryList={selected === "EXPENSE" ? expenseList : incomeList}
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
