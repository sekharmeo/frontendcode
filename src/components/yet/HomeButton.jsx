import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
      onClick={() => navigate("/admin")}
    >
      <Home className="w-6 h-6" />
    </button>
  );z
};

export default HomeButton;
