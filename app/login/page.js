'use client';
import { auth, facebookProvider, googleProvider, signInWithPopup } from "../../config/firebaseConfig";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { loginUser, signupUser } from "../../components/api/Authapi";
import Link from 'next/link';
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      // Skip this if already on user route
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?._id || user?.uid) {
        router.push(`/dashboard/user/${user._id || user.uid}`);
      }
    }
  }, [isAuthenticated, router]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await loginUser(loginData.email, loginData.password);
        const userData = { ...res.user, hasCompletedOnboarding: res.user.hasCompletedOnboarding || false };

        login(userData, res.token);
        router.push(`/dashboard/user/${res.user._id || res.user.uid}`);
      } else {
        const res = await signupUser(signupData.name, signupData.email, signupData.password);
        const userData = { ...res.user, hasCompletedOnboarding: false };

        login(userData, res.token);
        router.push(`/dashboard/user/${res.user._id || res.user.uid}`);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        firebaseUid: user.uid,
        photo: user.photoURL,
        provider: "google",
        hasCompletedOnboarding: false
      };

      const res = await axios.post("http://localhost:8000/api/google-login", userData);

      login(res.data.user, res.data.token);
      router.push(`/dashboard/user/${res.data.user._id || res.data.user.uid}`);
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message || "Google login failed");
    }
  };

  const handleFacebookAuth = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      // TODO: Send to backend and handle token
    } catch (err) {
      console.error("Facebook Login Error:", err);
      setError(err.message || "Facebook login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLoginData({ email: "", password: "" });
    setSignupData({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl w-80 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-center mb-2 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {!isLogin && (
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
            />
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={isLogin ? loginData.email : signupData.email}
            onChange={isLogin ? handleLoginChange : handleSignupChange}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={isLogin ? loginData.password : signupData.password}
              onChange={isLogin ? handleLoginChange : handleSignupChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {isLogin && (
            <Link href="/forget">
              <p className="text-right text-sm text-blue-500 hover:underline cursor-pointer">
                Forgot Password?
              </p>
            </Link>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center gap-1 w-full overflow-hidden">
          <Button onClick={handleGoogleAuth} className="text-sm w-[130px]">
            <FcGoogle />
            Continue
          </Button>

          <Button onClick={handleFacebookAuth} className="text-sm w-1/2">
            <FaFacebook className="text-sm" />
            Continue
          </Button>
        </div>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleForm}
            className="text-blue-500 ml-1 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthCard;
