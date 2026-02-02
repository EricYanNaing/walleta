import React, { useEffect, useState } from "react";

export default function Dropdown({
  subCategoryList,
  handleSelectChange,
  selectedSubCategory = "",
  searchFunc = true,
  className,
  icon = "",
  dropDownDirection = "center",
  isOpen = false,
  setIsOpen = () => { },
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("subCategoryList :", subCategoryList);
  }, [subCategoryList]);

  useEffect(() => {
    console.log("selectedSubCategory :", selectedSubCategory);
  }, [selectedSubCategory]);

  return (
    <div className={`${className} relative text-left text-purple-700 border border-[#b892ff] rounded-[10px] ${icon ? "w-fit border-none" : "w-full"}`}>
      {/* Toggle Button */}
      {icon ? <div
        id="dropdown-button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 cursor-pointer flex justify-center items-center"
      >
        {icon}
      </div> :
        <div
          id="dropdown-button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-2 cursor-pointer text-center"
        >

          {selectedSubCategory ? selectedSubCategory.name : "Select"}
        </div>}


      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="dropdown-menu"
          className={`absolute mt-2 bg-white shadow-xl rounded-md p-2 ${icon ? "min-w-[80px] !mt-0" : "w-full"} z-20 ${dropDownDirection === "left" ? "left-0" : dropDownDirection === "right" ? "right-0" : "left-1/2 -translate-x-1/2"}`}
        >
          {/* Search Input */}
          {searchFunc && (
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border p-1 rounded mb-2"
            />
          )}

          {/* Filtered Items */}
          {subCategoryList.length > 0 ? (
            subCategoryList.map((item, i) => (
              <span
                key={i}
                type="button"
                onClick={() => {
                  handleSelectChange(item);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-purple-100 text-sm cursor-pointer ${selectedSubCategory?.value === item.value ? "bg-purple-100" : ""}`}
              >
                {item.name}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
