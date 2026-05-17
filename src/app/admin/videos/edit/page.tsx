"use client";

import { useEffect, useState } from "react";
import {
  getAdminVideos,
  updateAdminVideo,
} from "../../../../lib/adminVideos";
import { getAdminCategories } from "../../../../lib/adminCategories";

type Category = {
  id: string;
  name: string;
  description?: string;
};

export default function EditVideoPage() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    video: "",
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get("id") || "";

      setId(videoId);

      const videosData = await getAdminVideos();
      const categoriesData = await getAdminCategories();

      setCategories(categoriesData);

      const video = videosData.find((item) => item.id === videoId);

      if (video) {
        setForm({
          title: video.title || "",
          category: video.category || "",
          video: video.video || "",
          description: video.description || "",
        });
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!form.video) {
      alert("اكتب رابط Vimeo");
      return;
    }

    if (!form.category) {
      alert("اختار الفئة");
      return;
    }

    await updateAdminVideo(id, {
      title: form.title || "Untitled Video",
      category: form.category,
      video: form.video,
      description: form.description || "",
    });

    window.location.href = "/admin/videos";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05050A] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-[#05050A] p-4 text-white md:p-10">
      <div className="w-full max-w-3xl">
        <nav className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:rounded-full">
          <h1 className="text-xl font-black">تعديل الفيديو</h1>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/videos"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              رجوع للفيديوهات
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
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-[#7B61FF]/60"
            placeholder="عنوان الفيديو (اختياري)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Category
          </label>

          {categories.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              لا توجد فئات في الداتا بيز. أضف فئات أولًا من صفحة Categories.
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((item) => {
                const isActive =
                  form.category?.trim().toLowerCase() ===
                  item.name.trim().toLowerCase();

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        category: item.name,
                      })
                    }
                    className={`rounded-2xl border px-5 py-4 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "border-[#7B61FF] bg-[#7B61FF]/20 text-white shadow-[0_0_25px_rgba(123,97,255,.25)]"
                        : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Vimeo Link
          </label>

          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-[#7B61FF]/60"
            placeholder="https://vimeo.com/..."
            value={form.video}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
          />

          <label className="mt-5 block text-xs uppercase tracking-[0.25em] text-white/35">
            Description
          </label>

          <textarea
            className="mt-2 h-32 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-[#7B61FF]/60"
            placeholder="تفاصيل الفيديو (اختياري)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <button
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-[#7B61FF] px-5 py-4 font-black text-white transition hover:opacity-90"
            >
              حفظ التعديل
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