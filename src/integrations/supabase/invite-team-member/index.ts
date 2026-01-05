// src/lib/supabase/inviteTeamMember.ts

import { supabase } from "@/integrations/supabase/client";

type InvitePayload = {
  email: string;
  role: "admin" | "team_member";
  name: string;
  bio?: string;      // Optional bio
  image?: string;    // Optional image URL
};

export const inviteTeamMember = async ({ email, role, name, bio, image }: InvitePayload) => {
  try {
    console.log("📤 Sending invite:", { email, role, name, bio: bio ? "provided" : "none", image: image ? "provided" : "none" });

    // Get auth session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to invite team members");
    }

    // Call edge function with all fields
    const { data, error } = await supabase.functions.invoke("invite-user", {
      body: {
        email: email.trim().toLowerCase(),
        role: role,
        name: name.trim(),
        bio: bio?.trim() || null,      // Send bio
        image: image || null,           // Send image URL
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    console.log("📥 Response:", { data, error });

    if (error) {
      console.error("❌ Function error:", error);
      throw new Error(error.message || "Failed to send invitation");
    }

    if (data?.error) {
      console.error("❌ API error:", data.error);
      throw new Error(data.error);
    }

    console.log("✅ Invitation sent, user saved to Users table");
    return data;

  } catch (err: any) {
    console.error("💥 Invite failed:", err);
    throw err;
  }
};