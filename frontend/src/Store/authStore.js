import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isLoading: false,
  isAuthenticated: false,
  isCheckingAuth: true, // When ever we reload the page we will look if the user is authenticated
  message: "",

  signup: async (email, password, username) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        username,
      });

      console.log("Signup Response ", response);

      set({
        user: response.data.data,
        isAuthenticated: true,
      });
    } catch (err) {
      set({
        error: err.response.data.message || "Error signing up",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      console.log("Login Response ", response);

      set({
        user: response.data.data,
        isAuthenticated: true,
        error: null,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error signing up",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify`, { code });
      console.log("response ", response);
    } catch (err) {
      const errorMessage = err.response.data.message || "Error verifying User";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      console.log("check auth response ", response.data);
      set({
        user: response.data.data,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        error: null,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/logout`);
      console.log("logout res", res.data);
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      set({ error });
      console.log("Error loging out");
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: false, error: null });
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      console.log("forgotPassword response ", res);
    } catch (err) {
      // set({ error: err.response.data.message });
      set({ error: err });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });

      console.log("reset password response ", response.data);
      set({ message: response.data.message });
    } catch (error) {
      console.log("error reseting password");
      set({ error: err.response.data.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
