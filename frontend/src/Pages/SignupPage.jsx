import React, { useState } from "react";
import Input from "../Components/Input";
import { Lock, Mail, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../Components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/verify");
    } catch (err) {
      const errorMessage = error.response.data.message || "Failed to sign up";
      console.log(err.response.data.message);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-400">
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <p className="text-red-500 mt-2 font-semibold">{error}</p>
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600
            hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
             focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-center w-full" />
            ) : (
              <>Sign Up</>
            )}
          </motion.button>
        </form>
        <p className=" text-yellow-50 mt-4 px-8 py-3 flex justify-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="ml-1 font-semibold text-green-400 hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
