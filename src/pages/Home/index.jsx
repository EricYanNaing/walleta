import React from "react";
import { FaBahtSign } from "react-icons/fa6";
import { splitNumberComma, emotionEmoji } from "../../utils/common";
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import List from "./List";
import useAuthStore from "../../store/useAuthStore";

const Home = () => {
  const {user} = useAuthStore();

  console.log("User in Home:", user);
  return (
    <div className="flex flex-col gap-4 main">
      <div className="bg-purple-200 p-5 rounded-[35px] flex justify-between items-center">
        <div>
          <p className="font-bold mb-5 text-purple-800">Your total balance is</p>
          <div className="text-4xl font-extrabold flex items-center gap-0 text-purple-900">
            <FaBahtSign /> <span>{splitNumberComma(user.currentbalance)}</span>
          </div>
        </div>
        <div>
          <img src={emotionEmoji(user.currentbalance)} alt="emotion" width={30} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#b892ff] p-5 rounded-[25px] min-w-[50px] ">
          <div>
            <div className="flex items-center gap-1  mb-2">
              <div className="rounded-full bg-white p-1">
                <BiSolidDownArrow className="text-[#b892ff]" />
              </div>
              <p className="font-bold text-white">Income</p>
            </div>
            <div className="text-2xl font-extrabold flex items-center gap-0 text-white">
              <FaBahtSign /> <span>{splitNumberComma(user.totalIncome)}</span>
            </div>
          </div>
        </div>
        <div className="bg-[#ef7a85] p-5 rounded-[25px] min-w-[50px] ">
          <div>
            <div className="flex items-center gap-1  mb-2">
               <div className="rounded-full bg-white p-1">
              <BiSolidUpArrow className="text-[#ef7a85]" />
              </div>
              <p className="font-bold text-white">Expense</p>
            </div>
            <div className="text-2xl font-extrabold flex items-center gap-0 text-white">
              <FaBahtSign /> <span>{splitNumberComma(user.totalExpense)}</span>
            </div>
          </div>
        </div>
      </div>
      <hr className='my-2 text-purple-200' />
      <div>
        <List />
      </div>
    </div>
  );
};

export default Home;
