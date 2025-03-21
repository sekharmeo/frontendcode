// src/utils/logout.js
// src/utils/logout.js
export const logout = () => {
    localStorage.clear(); // Remove all stored user data
    sessionStorage.clear(); // Remove session data if used
  };
  
  
