import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear(); // Clear session data if used

    navigate("/login"); // Redirect to login page
    setTimeout(() => {
      window.location.reload(); // Optional: Force reload to clear state
    }, 300);
  };
};
