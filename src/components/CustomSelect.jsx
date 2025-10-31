import React, { useEffect, useState } from "react";

export default function Dropdown({
  subCategoryList,
  handleSelectChange,
  selectedSubCategory = "",
  searchFunc = true,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("subCategoryList :", subCategoryList);
  }, [subCategoryList]);

  return (
    <div className={`${className} relative text-left text-purple-700 border border-[#b892ff] rounded-[10px] `}>
      {/* Toggle Button */}
      <div
        id="dropdown-button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2 cursor-pointer text-center"
      >
        {selectedSubCategory ? selectedSubCategory.name : "Select"}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="dropdown-menu"
          className="absolute mt-2 bg-white shadow-lg rounded-md p-2 w-full z-20"
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
                className="block w-full text-left px-2 py-1 rounded hover:bg-purple-100 text-sm cursor-pointer"
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
