import { supabase } from "./client";


export const uploadFileToSupabase = async (file: File, folder: string) => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('avatar_url')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { publicUrl  } = supabase.storage.from('avatar_url').getPublicUrl(fileName);
  return publicUrl;
};
