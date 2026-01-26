import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("user_id is required");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Delete from profiles table first (if not using CASCADE)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", user_id);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      // Continue to delete auth user anyway
    }

    // Delete from auth.users
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to delete user",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
