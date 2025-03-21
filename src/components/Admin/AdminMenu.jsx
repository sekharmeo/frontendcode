import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  BaggageClaim,
  User,
  FileText,
  ShoppingCart,
  Settings,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { logout } from "../../utils/logout";

const menuItems = [
  { icon: Home, label: "Home", path: "/admin" },
  { icon: BaggageClaim, label: "Products", path: "/admin/products" },
  { icon: User, label: "Profile", path: "/admin/user-fetch" },
  { icon: FileText, label: "Reports", path: "/admin/user-requests" },
  { icon: ShoppingCart, label: "Cart", path: "/admin/reports/school" },
  { icon: Settings, label: "Settings", path: "/admin/reports/stock" },
];

const AdminWebMenu = ({ isOpen, setIsOpen, handleLogout, menuRef }) => {
  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-md hidden md:flex flex-col items-center ${
        isOpen ? "w-35" : "w-16"
      } z-50`}
    >
      {/* Toggle Button */}
      <button
        className="w-full flex items-center justify-center md:justify-start px-4 py-3 hover:bg-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Menu Items */}
      <ul className="flex flex-col w-full">
        {menuItems.map(({ icon: Icon, label, path }, index) => (
          <li key={index} className="w-full">
            <Link
              to={path}
              className="flex items-center gap-4 p-4 hover:bg-gray-700"
            >
              <Icon className="h-6 w-6" />
              {isOpen && <span className="hidden md:block">{label}</span>}
            </Link>
          </li>
        ))}

        {/* Logout Button */}
        <li className="w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full hover:bg-red-500 text-white"
          >
            <LogOut className="h-6 w-6" />
            {isOpen && <span className="hidden md:block">Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

const AdminMobileMenu = ({ handleLogout }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-3 flex justify-around items-center text-white shadow-md md:hidden z-50">
      {menuItems.map(({ icon: Icon, path }, index) => (
        <Link key={index} to={path} className="p-2 flex flex-col items-center">
          <Icon className="h-6 w-6" />
        </Link>
      ))}

      {/* Mobile Logout Button */}
      <button onClick={handleLogout} className="p-2 flex flex-col items-center text-red-500">
        <LogOut className="h-6 w-6" />
      </button>
    </div>
  );
};

const AdminMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Clear storage
    navigate("/"); // Redirect to login
  };

  return (
    <>
      {/* Web Sidebar */}
      <AdminWebMenu isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} menuRef={menuRef} />

      {/* Mobile Bottom Navbar */}
      <AdminMobileMenu handleLogout={handleLogout} />

     {/* Main Content Wrapper (Prevents Overlap) */}
    <div>
      {/* Your Page Content Will Go Here */}
    </div>
    </>
  );
};

export default AdminMenu;
