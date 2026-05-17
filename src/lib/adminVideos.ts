import { supabase } from "./supabase";

export type AdminVideo = {
  id: string;
  title: string;
  category: string;
  video: string;
  description: string;
};

function logSupabaseError(action: string, error: unknown) {
  console.log(`${action} error:`, JSON.stringify(error, null, 2));
}

export async function getAdminVideos(): Promise<AdminVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id,title,category,video,description")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("getAdminVideos", error);
    return [];
  }

  return data || [];
}

export async function addAdminVideo(video: Omit<AdminVideo, "id">) {
  const { data, error } = await supabase
    .from("videos")
    .insert({
      title: video.title,
      category: video.category,
      video: video.video,
      description: video.description,
    })
    .select();

  if (error) {
    alert("Supabase Error: " + error.message);
    console.log("addAdminVideo error:", error);
    return null;
  }

  console.log("Video inserted:", data);

  return data;
}

export async function updateAdminVideo(
  id: string,
  video: Omit<AdminVideo, "id">
) {
  const { error } = await supabase
    .from("videos")
    .update({
      title: video.title,
      category: video.category,
      video: video.video,
      description: video.description,
    })
    .eq("id", id);

  if (error) {
    logSupabaseError("updateAdminVideo", error);
  }
}

export async function deleteAdminVideo(id: string) {
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id);

  if (error) {
    logSupabaseError("deleteAdminVideo", error);
  }
}