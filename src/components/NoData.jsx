import React from "react";
import NoDataPhoto from "../assets/img/folder.png";

const NoData = () => {
    return (
        <div className="flex flex-col items-center justify-center text-purple-800 font-bold mt-10">
            <img src={NoDataPhoto} alt="No Data" className="w-24 h-24" />
            <p className="text-lg">No Data Found</p>
        </div>
    );
};

export default NoData;