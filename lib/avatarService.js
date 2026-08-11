import { supabase } from './supabase';

export async function getAvatars() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .order('name');

  if (error) throw error;

  return data.map((avatar) => ({
    ...avatar,
    image:
      supabase.storage
        .from('avatars')
        .getPublicUrl(avatar.image_url)
        .data.publicUrl,
  }));
}