import React, { useState } from "react";
import Input from "../Components/Input";
import { Loader2, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    // setIsLoading(true)
    e.preventDefault();

    try {
      const res = await login(email, password);
      navigate("/");
    } catch (error) {
      console.log("Error logining in");
      console.log(error);
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

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

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
              <>
                <Loader2 className="animate-spin text-center w-full" />
              </>
            ) : (
              <>Login</>
            )}
          </motion.button>
        </form>
        <p className=" text-yellow-50 mt-4 px-8 py-3 flex justify-center">
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            className="ml-1 font-semibold text-green-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
