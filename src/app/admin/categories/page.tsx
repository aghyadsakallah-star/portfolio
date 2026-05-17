"use client";

import { useEffect, useState } from "react";
import {
  AdminCategory,
  addAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "../../../lib/adminCategories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    const data = await getAdminCategories();
    setCategories(data);
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (auth !== "true") {
      window.location.href = "/admin/login";
      return;
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);

    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      alert("اكتب اسم الكاتيجوري");
      return;
    }

    if (editingId) {
      const success = await updateAdminCategory(editingId, {
        name: form.name,
        description: form.description || "",
      });

      if (!success) return;

      alert("تم تعديل الكاتيجوري");
    } else {
      const result = await addAdminCategory({
        name: form.name,
        description: form.description || "",
      });

      if (!result) return;

      alert("تم إضافة الكاتيجوري");
    }

    resetForm();
    loadCategories();
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || "",
    });
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("متأكد إنك عايز تحذف الكاتيجوري؟");

    if (!confirmDelete) return;

    const success = await deleteAdminCategory(id);

    if (!success) return;

    alert("تم حذف الكاتيجوري");
    setOpenMenu(null);
    loadCategories();
  };

  return (
    <main className="min-h-screen bg-[#05050A] p-4 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:rounded-full">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-black">Categories Manager</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Dashboard
            </a>

            <a
              href="/admin/videos"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Videos
            </a>
          </div>
        </nav>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                {editingId ? "تعديل Category" : "إضافة Category"}
              </h2>
              <p className="mt-1 text-sm text-white/40">
                أضف أو عدّل الأقسام اللي هتظهر في الصفحة الرئيسية.
              </p>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/25"
            placeholder="اسم الكاتيجوري"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="mt-4 h-28 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/25"
            placeholder="وصف الكاتيجوري اختياري"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-white/80"
          >
            {editingId ? "حفظ التعديل" : "+ إضافة Category"}
          </button>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:p-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black">All Categories</h2>
              <p className="mt-2 text-sm text-white/40">
                عدد الكاتيجوريز: {categories.length}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {categories.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/40">
                لا يوجد Categories حاليًا.
              </div>
            )}

            {categories.map((category) => (
              <div
                key={category.id}
                className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-white/20 hover:bg-black/40"
              >
                <div className="border-l-4 border-[#7B61FF] pl-4">
                  <h3 className="text-lg font-black">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/40">
                    {category.description || "لا يوجد وصف"}
                  </p>
                </div>

                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu((prev) =>
                        prev === category.id ? null : category.id
                      );
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl transition hover:bg-white/15"
                  >
                    ⋯
                  </button>

                  {openMenu === category.id && (
                    <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border border-white/10 bg-[#121217] p-2 shadow-2xl shadow-black/50">
                      <button
                        onClick={() => handleEdit(category)}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/10"
                      >
                        تعديل
                      </button>

                      <button
                        onClick={() => handleDelete(category.id)}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}