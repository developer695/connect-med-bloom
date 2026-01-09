// src/pages/AcceptInvitation.tsx
// SIMPLE VERSION - Works with Supabase's default invite email

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AcceptInvitation() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("team_member");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Checking for authenticated user...");
    console.log("🔗 Current URL:", window.location.href);
    console.log("🔗 URL Hash:", window.location.hash);
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check if there's a token in the URL (from invite link)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      console.log("🎫 URL token type:", type);
      console.log("🎫 Has access token:", !!accessToken);

      // Get current session (Supabase sets this from the invite link)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log("📋 Session exists:", !!session);
      console.log("👤 Session user:", session?.user?.email);

      if (sessionError) {
        console.error("❌ Session error:", sessionError);
        setError("Failed to verify invitation.");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        console.log("❌ No session found");
        setError("Invalid invitation link. Please click the link from your email.");
        setLoading(false);
        return;
      }

      const user = session.user;
      console.log("✅ User found:", user.email);

      // First try Users table (for admin - uses user_id column)
      const { data: adminData, error: adminError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminData && adminData.role === "admin") {
        console.log("✅ Admin found in Users table:", adminData);
        setUserEmail(adminData.email || user.email || "");
        setUserName(adminData.name || user.user_metadata?.name || "");
        setUserRole("admin");
        setUserId(user.id);

        if (adminData.status === "active") {
          toast.info("Account already set up. Redirecting to login...");
          navigate("/auth");
          return;
        }
        setLoading(false);
        return;
      }

      // Otherwise check profiles table (for team member - uses id column)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("❌ Error fetching profile:", profileError);
      }

      if (profileData) {
        console.log("✅ Profile data found:", profileData);
        setUserEmail(profileData.email || user.email || "");
        setUserName(profileData.name || user.user_metadata?.name || "");
        setUserRole(profileData.role || "team_member");
        setUserId(user.id);

        // Check if already active
        if (profileData.status === "active") {
          toast.info("Account already set up. Redirecting to login...");
          navigate("/auth");
          return;
        }
      } else {
        // No record found in either table - use auth user data
        console.log("⚠️ No record found, using auth data");
        setUserEmail(user.email || "");
        setUserName(user.user_metadata?.name || "");
        setUserRole(user.user_metadata?.role || "team_member");
        setUserId(user.id);
      }

      setLoading(false);

    } catch (err: any) {
      console.error("❌ Error:", err);
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!userId) {
      toast.error("User not found. Please try clicking the invite link again.");
      return;
    }

    setAccepting(true);

    try {
      // Update password directly using Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      console.log("✅ Password updated");

      // Update the correct table based on role
      if (userRole === "admin") {
        // Update Users table for admin (uses user_id column)
        const { error: userError } = await supabase
          .from("Users")
          .update({ status: "active" })
          .eq("user_id", userId);

        if (userError) {
          console.error("⚠️ Users table update error:", userError);
        }
        console.log("✅ Admin status updated in Users table");
      } else {
        // Update profiles table for team member (uses id column)
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("id", userId);

        if (profileError) {
          console.error("⚠️ Profile update error:", profileError);
        }
        console.log("✅ Team member status updated in profiles table");
      }

      // Sign out so they can login with new password
      await supabase.auth.signOut();

      toast.success("🎉 Account setup complete! Please login with your new password.");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);

    } catch (err: any) {
      console.error("❌ Error:", err);
      toast.error(err.message || "Failed to set password");
    } finally {
      setAccepting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-300">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Invalid Invitation</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-slate-900">Welcome!</h1>
          <p className="text-slate-600">
            Hi <span className="font-semibold">{userName || userEmail}</span>
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {userRole === "admin" ? "👑 Admin" : "👤 Team Member"}
          </div>
        </div>

        <form onSubmit={handleSetPassword} className="space-y-5">
         
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={accepting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {accepting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          After setup, you can login with your email and password.
        </p>
      </div>
    </div>
  );
}