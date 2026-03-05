import React, { useEffect, useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { FaBahtSign } from "react-icons/fa6";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { getSubCategoryList, updateTransaction } from "../../api";
import { formatDateForApi } from "../../utils/common";
import toast from "react-hot-toast";
import { FaTimesCircle } from "react-icons/fa";
import { DatePicker } from "../../components/CustomCalendar";

const EditTransactionModal = ({ transaction, onClose, onSaved }) => {
    const [type, setType] = useState(transaction?.type || "EXPENSE");
    const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
    const [description, setDescription] = useState(transaction?.description || "");
    // DatePicker needs a Date object; parse the ISO string from the transaction
    const parseDate = (d) => {
        if (!d) return null;
        if (d instanceof Date) return d;
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
        return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
    };
    const [date, setDate] = useState(() => parseDate(transaction?.date));
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(
        transaction?.subCategory || null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    // Trigger entrance animation
    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    // Fetch sub-categories whenever type changes
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const { data, status } = await getSubCategoryList({ type });
                if (status === 200) {
                    const list = data?.data || [];
                    setSubCategoryList(list);
                    // Keep the current subCategory only if it actually exists in this type's list.
                    // Otherwise (type switched, or server data inconsistency) reset to first item.
                    setSelectedSubCategory((prev) => {
                        const currentId = prev?.id ?? transaction?.subCategory?.id;
                        const foundInList = list.find((sc) => sc.id === currentId);
                        return foundInList ?? list[0] ?? null;
                    });
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSubCategories();
    }, [type]);

    const validate = () => {
        const errs = {};
        if (!description.trim() || description.trim().length < 3)
            errs.description = "Description must be at least 3 characters";
        if (!amount || isNaN(amount) || Number(amount) <= 0)
            errs.amount = "Enter a valid positive amount";
        if (!date || !(date instanceof Date)) errs.date = "Date is required";
        if (!selectedSubCategory) errs.subCategory = "Select a sub-category";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 250);
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setIsSaving(true);
            const payload = {
                id: transaction.id,
                type: selectedSubCategory.type ?? type, // ground truth: from the subcategory itself
                amount: parseInt(amount),
                description: description.trim(),
                date: formatDateForApi(date), // date is a Date object here
                subCategoryId: selectedSubCategory.id,
            };
            console.log("Payload:", payload);
            const response = await updateTransaction(payload);
            if (response.status === 200 || response.status === 204) {
                toast.success("Transaction updated!");
                const updated = {
                    ...transaction,
                    ...payload,
                    date: formatDateForApi(date),
                    subCategory: selectedSubCategory,
                };
                onSaved(updated);
                handleClose();
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update transaction");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="edit-modal-backdrop"
                style={{ opacity: isVisible ? 1 : 0 }}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="edit-modal"
                style={{
                    transform: isVisible ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(40px) scale(0.95)",
                    opacity: isVisible ? 1 : 0,
                }}
            >
                {/* Header */}
                <div className="edit-modal-header">
                    <div className="edit-modal-title-group">
                        <span className="edit-modal-emoji">✏️</span>
                        <h2 className="edit-modal-title">Edit Transaction</h2>
                    </div>
                    <FaTimesCircle className="edit-modal-close" onClick={handleClose} />
                </div>

                {/* Body */}
                <div className="edit-modal-body">

                    {/* Type Toggle */}
                    <div className="edit-modal-type-row">
                        <button
                            type="button"
                            className={`edit-type-btn ${type === "EXPENSE" ? "active expense" : ""}`}
                            onClick={() => setType("EXPENSE")}
                        >
                            {type === "EXPENSE" ? <BiRadioCircleMarked /> : <BiRadioCircle />}
                            <span>💸 Expense</span>
                        </button>
                        <button
                            type="button"
                            className={`edit-type-btn ${type === "INCOME" ? "active income" : ""}`}
                            onClick={() => setType("INCOME")}
                        >
                            {type === "INCOME" ? <BiRadioCircleMarked /> : <BiRadioCircle />}
                            <span>💰 Income</span>
                        </button>
                    </div>

                    {/* Sub-category */}
                    <div className="edit-modal-field">
                        <label className="edit-modal-label">Sub Category</label>
                        <div className="edit-subcategory-grid">
                            {subCategoryList.map((sc) => (
                                <button
                                    key={sc.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSubCategory(sc);
                                        if (sc.type) setType(sc.type); // keep toggle in sync
                                    }}
                                    className={`edit-subcategory-chip ${selectedSubCategory?.id === sc.id ? "selected" : ""}`}
                                >
                                    {sc.categoryImg && (
                                        <img src={sc.categoryImg} alt={sc.name} className="edit-subcategory-img" />
                                    )}
                                    <span>{sc.name}</span>
                                    {selectedSubCategory?.id === sc.id && (
                                        <FaCheck className="edit-subcategory-check" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {errors.subCategory && <p className="edit-modal-error">{errors.subCategory}</p>}
                    </div>

                    {/* Description */}
                    <div className="edit-modal-field">
                        <label className="edit-modal-label" htmlFor="edit-desc">Description</label>
                        <input
                            id="edit-desc"
                            type="text"
                            className={`edit-modal-input ${errors.description ? "error" : ""}`}
                            placeholder="Enter description…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="edit-modal-error">{errors.description}</p>}
                    </div>

                    {/* Amount */}
                    <div className="edit-modal-field">
                        <label className="edit-modal-label" htmlFor="edit-amount">Amount</label>
                        <div className="edit-amount-wrapper">
                            <FaBahtSign className="edit-amount-icon" />
                            <input
                                id="edit-amount"
                                type="number"
                                className={`edit-modal-input edit-modal-input--amount ${errors.amount ? "error" : ""}`}
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        {errors.amount && <p className="edit-modal-error">{errors.amount}</p>}
                    </div>

                    {/* Date */}
                    <div className="edit-modal-field">
                        <label className="edit-modal-label" htmlFor="edit-date">Date</label>
                        <div className="datepicker-dropup">
                            <DatePicker
                                mode="single"
                                className="mt-2"
                                value={date}
                                onChange={(d) => setDate(d)}
                            />
                        </div>
                        {errors.date && <p className="edit-modal-error">{errors.date}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="edit-modal-footer">
                    <button className="edit-modal-btn cancel" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="edit-modal-btn save"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span className="edit-modal-spinner" />
                        ) : (
                            <FaCheck />
                        )}
                        {isSaving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditTransactionModal;
