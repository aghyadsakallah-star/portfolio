import { supabase } from "./supabase";

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
};

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,description")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Categories Error: " + error.message);
    return [];
  }

  return data || [];
}

export async function addAdminCategory(category: Omit<AdminCategory, "id">) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: category.name,
      description: category.description,
    })
    .select();

  if (error) {
    alert("Add Category Error: " + error.message);
    return null;
  }

  return data;
}

export async function updateAdminCategory(
  id: string,
  category: Omit<AdminCategory, "id">
) {
  const { error } = await supabase
    .from("categories")
    .update({
      name: category.name,
      description: category.description,
    })
    .eq("id", id);

  if (error) {
    alert("Update Category Error: " + error.message);
    return false;
  }

  return true;
}

export async function deleteAdminCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    alert("Delete Category Error: " + error.message);
    return false;
  }

  return true;
}