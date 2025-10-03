import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../apiCalls/authApiCalls";
import { loginUser } from "../apiCalls/authApiCalls";
import { Languages } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [language, setLanguage] = useState("en");
  const [formLanguage, setFormLanguage] = useState("en"); // New state for form language

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Errors state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Translations object
  const translations = {
    en: {
      welcome: "Welcome to MyChat",
      description: "Experience intelligent conversations powered by AI. Sign in or create an account to get started.",
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      language: "Language",
      submitSignIn: "Sign In",
      submitSignUp: "Sign Up",
      haveAccount: "Already have an account? ",
      noAccount: "Don't have an account? ",
      switchToSignIn: "Sign In",
      switchToSignUp: "Sign Up",
      errors: {
        emailRequired: "Email is required",
        emailInvalid: "Email is invalid",
        passwordRequired: "Password is required",
        passwordLength: "Password must be at least 6 characters",
        confirmPasswordRequired: "Confirm your password",
        passwordsMatch: "Passwords do not match"
      }
    },
    ar: {
      welcome: "مرحباً بك في MyChat",
      description: "جرب المحادثات الذكية المدعومة بالذكاء الاصطناعي. سجل الدخول أو أنشئ حساباً للبدء.",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أكد كلمة المرور",
      language: "اللغة",
      submitSignIn: "تسجيل الدخول",
      submitSignUp: "إنشاء حساب",
      haveAccount: "هل لديك حساب بالفعل؟ ",
      noAccount: "ليس لديك حساب؟ ",
      switchToSignIn: "تسجيل الدخول",
      switchToSignUp: "إنشاء حساب",
      errors: {
        emailRequired: "البريد الإلكتروني مطلوب",
        emailInvalid: "البريد الإلكتروني غير صالح",
        passwordRequired: "كلمة المرور مطلوبة",
        passwordLength: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        confirmPasswordRequired: "قم بتأكيد كلمة المرور",
        passwordsMatch: "كلمات المرور غير متطابقة"
      }
    }
  };

  const t = translations[formLanguage];

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email) newErrors.email = t.errors.emailRequired;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t.errors.emailInvalid;

    // Password validation
    if (!password) newErrors.password = t.errors.passwordRequired;
    else if (password.length < 6) newErrors.password = t.errors.passwordLength;

    // Confirm password for signup
    if (isSignUp) {
      if (!confirmPassword) newErrors.confirmPassword = t.errors.confirmPasswordRequired;
      else if (password !== confirmPassword) newErrors.confirmPassword = t.errors.passwordsMatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      console.log("Validation failed");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        console.log("Signing up:", { email, password, language });
        const success = await registerUser({ email, password, language });
        if (success) {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setIsSignUp(false);
          alert(formLanguage === 'ar' ? "تم التسجيل بنجاح! يرجى تسجيل الدخول." : "Registration successful! Please sign in.");
        } else {
          alert(formLanguage === 'ar' ? "فشل التسجيل. يرجى المحاولة مرة أخرى." : "Registration failed. Please try again.");
        }
      } else {
        console.log("Signing in:", { email, password });
        const success = await loginUser({ email, password });
        if (success) {
          window.dispatchEvent(new Event('storage'));
          navigate("/chat");
        } else {
          alert(formLanguage === 'ar' ? "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك." : "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(formLanguage === 'ar' ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormLanguage = () => {
    setFormLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const toggleAuthMode = () => {
    setErrors({});
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="h-screen flex overflow-hidden" dir={formLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Left side - Illustration / Design */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4 animate-pulse text-center">
          {t.welcome}
        </h1>
        <p className="text-lg opacity-90 text-center leading-relaxed">
          {t.description}
        </p>
        <div className="mt-10 w-full flex justify-center">
          <div className="bg-white/20 w-40 h-40 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-6">
          {/* Language Switch */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFormLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              <Languages size={16} />
              <span className="text-sm font-medium">{formLanguage === 'en' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isSignUp ? t.signUp : t.signIn}
          </h2>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setIsSignUp(false);
              }}
              className={`px-4 py-2 rounded-tl-xl rounded-tr-xl transition ${
                !isSignUp
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setIsSignUp(true);
              }}
              className={`px-4 py-2 rounded-tl-xl rounded-tr-xl transition ${
                isSignUp
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.signUp}
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } ${formLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                dir="ltr" // Keep email input LTR for email format
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } ${formLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                dir="ltr" // Keep password input LTR
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password for SignUp */}
            {isSignUp && (
              <div>
                <label className="block text-gray-700 font-medium">{t.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } ${formLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                  dir="ltr" // Keep confirm password input LTR
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Language Preference */}
            {isSignUp && (
              <div>
                <label className="block text-gray-700 font-medium">{t.language}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-3 rounded-lg transition mt-2 shadow-lg font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {loading ? (
                formLanguage === 'ar' ? "جاري المعالجة..." : "Processing..."
              ) : (
                isSignUp ? t.submitSignUp : t.submitSignIn
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            {isSignUp ? t.haveAccount : t.noAccount}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-500 font-semibold hover:underline"
            >
              {isSignUp ? t.switchToSignIn : t.switchToSignUp}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}