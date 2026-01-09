import { supabase } from "./client";

// IMPORTANT: Create this bucket in Supabase Dashboard:
// 1. Go to Storage > New Bucket
// 2. Name: "avatars" (public bucket)
// 3. Enable "Public bucket" option
// Or run this SQL in Supabase SQL Editor:
// INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

export const uploadFileToSupabase = async (file: File, folder: string) => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};
