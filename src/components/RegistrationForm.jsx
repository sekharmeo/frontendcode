import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const RegistrationForm = () => {
  const [schoolName, setSchoolName] = useState("");
  const [udiseCode, setUdiseCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUdiseCode = (code) => /^\d{11}$/.test(code);

  const validatePassword = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!schoolName.trim()) {
      setError("School Name is required.");
      setSuccess("");
      setLoading(false);
      return;
    }

    if (!validateUdiseCode(udiseCode)) {
      setError("UDISE Code must be exactly 11 digits.");
      setSuccess("");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      setSuccess("");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        schoolName,
        udiseCode,
        password,
        role,
      });

      setSuccess("Registration successful! Your account is inactive until approved.");
      setTimeout(() => {
        setSuccess("");
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("Registration failed. UDISE Code might already be registered.");
      setSuccess("");
    }
    setLoading(false);
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bgs.gif')" }}
    >
      <form onSubmit={handleRegister} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-xl mb-4">Register</h2>

        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="School Name"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Udise Code (11 digits)"
            value={udiseCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) setUdiseCode(value);
              if (validateUdiseCode(value)) setError("");
            }}
            maxLength="11"
          />
        </div>

        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input input-bordered w-full pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validatePassword(e.target.value)) setError("");
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="mb-4 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="input input-bordered w-full pr-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (e.target.value === password) setError("");
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {loading && <span className="loading loading-spinner text-primary block mx-auto mb-4"></span>}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
