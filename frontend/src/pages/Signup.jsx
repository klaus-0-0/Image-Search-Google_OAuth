import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import wall from "../assets/wall2.jpg"
import googleIcon from "../assets/google.png" // Add a Google icon

const Signup = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem("user-info");
    if (info) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    try {
      const userData = await axios.post(`${config.apiUrl}/signup`, {
        username,
        email,
        password,
      });
      if (userData) {
        navigate("/home")
      }
    } catch (error) {
      console.error("Signup Failed:", error?.response?.data || error.message);
    }
  };

  // ✅ Google OAuth Handler
  const handleGoogleSignup = () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
    } catch (error) {
      console.log('Not authenticated', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <img
        src={wall}
        alt="Background"
        className="absolute w-full h-full object-cover opacity-100"
      />

      <nav className="w-full bg-transparent p-4 flex justify-end relative z-10 border-b-2">
        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-6">
          <button
            className="text-black font-bold text-sm md:text-base"
            onClick={() => navigate("")}
          >
            About
          </button>
          <button
            className="bg-black hover:bg-cyan-700 text-white py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={handleSignup}
          >
            Sign up
          </button>
          <button
            className="bg-white hover:bg-cyan-700 text-black border border-black py-1 px-2 md:py-2 md:px-4 rounded font-medium text-sm md:text-base transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center lg:justify-start p-4 relative z-10 backdrop-blur-xs">
        <div className="w-full max-w-md h-full lg:ml-80 bg-transparent bg-opacity-90 p-6 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-white mt-2">Welcome</p>
          </div>

          {/* Google OAuth Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="mx-4 text-gray-500 text-sm">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Manual Signup Form */}
          <div className="space-y-4">
            <input
              type="text"
              className="w-full border border-gray-400 rounded p-3"
              placeholder="Username"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              className="w-full border border-gray-400 rounded p-3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full border border-gray-400 rounded p-3"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-center pt-4 gap-4">
              <button
                className="w-50 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded font-medium transition cursor-pointer"
                onClick={handleSignup}
              >
                Sign up
              </button>
              <button
                className="w-50 bg-white hover:bg-gray-100 text-black border border-gray-300 py-2 px-4 rounded font-medium transition cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;