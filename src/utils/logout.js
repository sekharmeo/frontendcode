export const logout = (navigate) => {
  localStorage.removeItem("token"); // Remove token
  localStorage.clear(); // Clear all stored data
  sessionStorage.clear(); // Clear session data if used

  // Force a re-render and redirect using navigate
  navigate("/", { replace: true });

  // Ensure state is reset properly
  setTimeout(() => {
    window.location.reload();
  }, 300);
};
