// src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getAdminVideos, AdminVideo } from "../../lib/adminVideos";
export default function AdminDashboardPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);

  useEffect(() => {
  const auth = localStorage.getItem("admin-auth");

  if (auth !== "true") {
    window.location.href = "/admin/login";
    return;
  }

  const loadVideos = async () => {
    const data = await getAdminVideos();
    setVideos(data);
  };

  loadVideos();
}, []);

  return (
    <main className="min-h-screen bg-[#05050A] text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">
          <h1 className="text-2xl font-black">
            Admin<span className="text-white/50">.Panel</span>
          </h1>

          <nav className="mt-10 space-y-3">
            <a className="block rounded-2xl bg-white/10 px-4 py-3" href="/admin">
              Dashboard
            </a>

            <a className="block rounded-2xl px-4 py-3 text-white/60 hover:bg-white/10" href="/admin/videos">
              عرض جميع الفيديوهات
            </a>

            <a className="block rounded-2xl px-4 py-3 text-white/60 hover:bg-white/10" href="/admin/videos/add">
              إضافة فيديو
            </a>
            <a
  className="block rounded-2xl px-4 py-3 text-white/60 hover:bg-white/10"
  href="/admin/categories"
>
  إدارة الكاتيجوريز
</a>

            <a className="block rounded-2xl px-4 py-3 text-white/60 hover:bg-white/10" href="/">
              عرض الموقع
            </a>
          </nav>
        </aside>

        <section className="p-5 md:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/35">
            Overview
          </p>

          <h2 className="mt-3 text-4xl font-black">Dashboard</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-white/45">Total Videos</p>
              <h3 className="mt-3 text-5xl font-black">{videos.length}</h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-white/45">Categories</p>
              <h3 className="mt-3 text-5xl font-black">
                {new Set(videos.map((v) => v.category)).size}
              </h3>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-white/45">Status</p>
              <h3 className="mt-3 text-3xl font-black">Active</h3>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">Latest Videos</h3>

              <a
                href="/admin/videos"
                className="rounded-full bg-white px-5 py-2 text-sm font-black text-black"
              >
                عرض جميع الفيديوهات
              </a>
            </div>

            <div className="mt-6 space-y-3">
              {videos.slice(0, 5).map((video) => (
                <div
                  key={video.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <h4 className="font-black">{video.title}</h4>
                  <p className="mt-1 text-sm text-white/45">
                    {video.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}