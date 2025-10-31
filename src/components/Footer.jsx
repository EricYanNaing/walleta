import FooterBg from "../assets/img/footer-bg.svg";
import Dollar from "../assets/img/money.png";
import Category from '../assets/img/category.png'
import Warning from '../assets/img/warning-sign.png'
import { HiMiniHome, HiClipboardDocumentList } from "react-icons/hi2";
import { FaChartPie, FaUser, FaDollarSign } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // anchor the modal to the FAB
  const fabRef = useRef(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function updateAnchor() {
      if (!fabRef.current) return;
      const r = fabRef.current.getBoundingClientRect();
      setAnchor({ x: r.left + r.width / 15, y: r.top + r.height / 2 });
    }
    if (isModalOpen) {
      updateAnchor();
      window.addEventListener("resize", updateAnchor);
      window.addEventListener("scroll", updateAnchor, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor);
    };
  }, [isModalOpen]);

  const menuList = [
    { name: "home", icon: <HiMiniHome />, route: "/" },
    { name: "list", icon: <HiClipboardDocumentList />, route: "/list" },
    { name: "chart", icon: <FaChartPie />, route: "/chart" },
    { name: "profile", icon: <FaUser />, route: "/profile" },
  ];

 const modalMenuList = [
  { name: "Expense", icon: Dollar, route: "/transactionform" },
  { name: "Category", icon: Category, route: "/add-category" },
  { name: "Insights", icon: Warning, route: "/insights" },
];

  const triggerModal = () => {
    navigate('/transactionform');
  };
  const closeModal = () => setIsModalOpen(false);

  const triggerMenu = (route) => {
    
    closeModal();
    navigate(route)
  }

  // simple arc positions for 3 actions (relative to the FAB center)
  const positions = [
    { x: 0, y: -100 },   // straight up
    { x: -80, y: -55 },  // up-left
    { x: 80, y: -55 },   // up-right
  ];

  return (
    <section className="footer">
      <img src={FooterBg} alt="" className="footer-bg" />

      <div className="footer-menu">
        {menuList.map((menu) => {
          const isActive = location.pathname === menu.route;
          return (
            <div
              key={menu.name}
              className="menu-icon"
              onClick={() => navigate(menu.route)}
            >
              <span className={isActive ? "text-indigo-500" : "text-black"}>
                {menu.icon}
              </span>
              <div
                className={`h-1 rounded-2xl bg-indigo-500 mt-1 transition-all duration-200 ease-in-out ${
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Keep your FAB exactly as-is; just add the ref */}
      <button className="fab !focus:outline-none" onClick={triggerModal} ref={fabRef}>
        <FaDollarSign className="dollar-icon m-auto text-2xl text-indigo-500" />
      </button>

      {/* Backdrop + anchored modal */}
      {isModalOpen && (
        <div className="">
          {/* Backdrop that closes on click */}
          <div
            className="fixed inset-0  backdrop-blur-[5px] z-[40]"
            onClick={closeModal}
          />

          {/* Icon modal anchored to FAB center */}
          <div
            className="fixed z-[50] wow  animate__bounceIn"
            style={{ left: anchor.x, top: anchor.y }}
            // stop click bubbling so backdrop doesn't close it when clicking icons
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {modalMenuList.map((menu,i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12  grid place-items-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    transform: `translate(${positions[i].x}px, ${positions[i].y}px)`,
                  }}
                  onClick={() => triggerMenu(menu.route)}
                  aria-label={`action-${i + 1}`}
                >
                  {/* use your icons/images */}
                  <img src={menu.icon} alt="" className="w-8 h-8 rounded-full bg-gray-100 shadow-lg border" />
                  <span className="text-black text-xs">{menu.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Footer;