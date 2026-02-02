// src/pages/Auth.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Get role and redirect
        const { data: userData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        // Both admin and team_member can access the app
        if (userData?.role === "admin" || userData?.role === "team_member") {
          navigate("/");
          return;
        }
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  // ============================================
  // LOGIN - For both Admin and Team Members
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password: password,
        });

      if (authError) throw authError;

      console.log("✅ Logged in:", authData.user?.email);

      // 2. Get role from profiles table
      const { data: userData } = await supabase
        .from("profiles")
        .select("role, name, status")
        .eq("id", authData.user!.id)
        .single();

      // 3. Update status to active (if first login after accepting invite)
      if (userData?.status === "accepted") {
        await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("id", authData.user!.id);
      }

      const role = userData?.role || "team_member";
      const name = userData?.name || authData.user?.email;

      toast.success(`Welcome back, ${name}!`);

      // 4. Redirect based on role
      if (role === "admin" || role === "team_member") {
        navigate("/");
      } else {
        navigate("/authoring");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);

      if (err.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else if (err.message?.includes("Email not confirmed")) {
        toast.error("Please confirm your email first");
      } else {
        toast.error(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SIGNUP - Only for Admin (first user)
  // ============================================
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // 1. Check if admin already exists
      const { data: existingAdmin } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .maybeSingle();

      if (existingAdmin) {
        toast.error("Admin account already exists. Please login.");
        setIsLogin(true);
        setLoading(false);
        return;
      }

      // 2. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Signup failed - no user returned");
      }

      console.log("✅ Auth user created:", authData.user.id);

      // 3. Insert admin into profiles table
      const { error: insertError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email.toLowerCase().trim(),
        name: email.split("@")[0], // Default name from email
        role: "admin",
        status: "active",
      });

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        throw new Error("Failed to create admin record");
      }

      console.log("✅ Admin record created in profiles table");

      toast.success("🎉 Admin account created! Redirecting...");

      // 4. Redirect to home
      navigate("/");
    } catch (err: any) {
      console.error("❌ Signup error:", err);

      if (err.message?.includes("User already registered")) {
        toast.error("This email is already registered. Please login.");
        setIsLogin(true);
      } else {
        toast.error(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Admin Account"}
          </h1>
          <p className="text-slate-600">
            {isLogin
              ? "Sign in to your account"
              : "Set up the first admin account"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter password" : "Min 8 characters"}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
                minLength={isLogin ? 1 : 8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password (login only) */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/send-password")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Admin Account
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            {isLogin
              ? "First time? Create Admin Account"
              : "Already have an account? Sign In"}
          </button>
        </div>

        {/* Info for team members */}
        {isLogin && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Team members: Use the email and password from your invitation.
          </p>
        )}
      </div>
    </div>
  );
}
