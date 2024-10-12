import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/SignupPage";
import Login from "./Pages/LoginPage";
import Home from "./Pages/HomePage";
import PageNotFound from "./Pages/PageNotFound";
import EmailVerificationPage from "./Pages/EmailVerifyPage";
import { Toaster } from "react-hot-toast";
// import { useAuthStore } from "./Store/authStore";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Loader from "./Components/Loader";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

// protect routes that require authentication
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  console.log({ isAuthenticated, user });
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verify" replace />;
  }

  return children;
};

// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route path="/verify" element={<EmailVerificationPage />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
