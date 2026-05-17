"use client";

import { useEffect, useState } from "react";
import { addAdminVideo } from "../../../../lib/adminVideos";
import {
  AdminCategory,
  getAdminCategories,
} from "../../../../lib/adminCategories";

export default function AddVideoPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    video: "",
    description: "",
  });

  useEffect(() => {
    getAdminCategories().then((data) => {
      setCategories(data);

      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          category: data[0].name,
        }));
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.video) {
      alert("اكتب رابط Vimeo");
      return;
    }

    if (!form.category) {
      alert("اختار Category");
      return;
    }

    const result = await addAdminVideo({
      title: form.title || "Untitled Video",
      category: form.category,
      video: form.video,
      description: form.description || "",
    });

    if (!result) return;

    alert("تم إضافة الفيديو");
    window.location.href = "/admin/videos";
  };

  return (
    <main className="min-h-screen bg-[#05050A] p-4 text-white md:p-10">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl md:rounded-full">
          <h1 className="text-xl font-black">إضافة فيديو</h1>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/videos"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              رجوع للفيديوهات
            </a>

            <a
              href="/admin/categories"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              إدارة الكاتيجوريز
            </a>

            <a
              href="/admin"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              Dashboard
            </a>
          </div>
        </nav>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl md:p-6">
          <label className="text-xs uppercase tracking-[0.25em] text-white/35">
            Video Title
          </label>

          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/25"
            placeholder="عنوان الفيديو (اختياري)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Category
          </label>

          {categories.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/45">
              لا يوجد Categories. أضف Category أولًا من صفحة إدارة الكاتيجوريز.
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm({ ...form, category: item.name })}
                  className={`rounded-2xl border px-5 py-4 text-sm font-bold transition ${
                    form.category === item.name
                      ? "border-[#7B61FF] bg-[#7B61FF]/20 text-white shadow-[0_0_20px_rgba(123,97,255,.2)]"
                      : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Vimeo Link
          </label>

          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/25"
            placeholder="https://vimeo.com/..."
            value={form.video}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
          />

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Description
          </label>

          <textarea
            className="mt-2 h-32 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/25"
            placeholder="تفاصيل الفيديو (اختياري)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <button
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-white/80"
            >
              حفظ الفيديو
            </button>

            <a
              href="/admin/videos"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black transition hover:bg-white/10"
            >
              إلغاء
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}