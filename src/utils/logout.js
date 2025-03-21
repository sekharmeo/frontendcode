// src/utils/logout.js
export const logout = () => {
  localStorage.removeItem("token"); // Remove token
  localStorage.clear(); // Clear all stored data (optional)
  sessionStorage.clear(); // Clear session data if used
};
