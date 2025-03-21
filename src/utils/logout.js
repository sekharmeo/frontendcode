import { useNavigate } from "react-router-dom";

export const logout = () => {
  const navigate = useNavigate(); // Initialize navigate function

  localStorage.removeItem("token"); // Remove token
  localStorage.clear(); // Clear all stored data (optional)
  sessionStorage.clear(); // Clear session data if used

  // Navigate to login page
  navigate("/login"); // Use React Router navigation
};
