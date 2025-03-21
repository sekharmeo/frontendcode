import React from "react";

const UserDetails = ({ user }) => {
  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="text-center mb-4 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold">Hi, {user.schoolName || "School Name Not Available"}, {user.udiseCode}</h2>
         
    </div>
  );
};

export default UserDetails;
