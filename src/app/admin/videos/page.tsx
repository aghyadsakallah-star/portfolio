"use client";

import { useEffect, useState } from "react";
import {
  AdminVideo,
  deleteAdminVideo,
  getAdminVideos,
} from "../../../lib/adminVideos";

function getVimeoId(url: string) {
  return url.split("/").pop();
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (auth !== "true") {
      window.location.href = "/admin/login";
      return;
    }

    getAdminVideos().then(setVideos);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setOpenMenu(null);
    };

    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("متأكد إنك عايز تحذف الفيديو؟");

    if (!confirmDelete) return;

    await deleteAdminVideo(id);

const updated = await getAdminVideos();

setVideos(updated);
    setOpenMenu(null);
  };

  return (
    <main className="min-h-screen bg-[#05050A] p-4 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:rounded-full">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">
              Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-black">Videos Manager</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Dashboard
            </a>

            <a
              href="/admin/videos/add"
              className="rounded-full bg-white px-5 py-2 text-sm font-black text-black transition hover:bg-white/80"
            >
              + إضافة فيديو
            </a>
          </div>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl md:p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black">All Videos</h2>
              <p className="mt-2 text-sm text-white/40">
                عدد الفيديوهات: {videos.length}
              </p>
            </div>

            <a
              href="/admin/videos/add"
              className="w-fit rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-bold transition hover:bg-white/20"
            >
              إضافة فيديو جديد
            </a>
          </div>

          <div className="mt-6 grid gap-4">
            {videos.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/40">
                لا يوجد فيديوهات حاليًا.
              </div>
            )}

            {videos.map((video) => (
              <div
                key={video.id}
                className="relative flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-white/20 hover:bg-black/40 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                    <iframe
                      src={`https://player.vimeo.com/video/${getVimeoId(
                        video.video
                      )}?autoplay=1&muted=1&loop=1&background=1`}
                      className="h-full w-full scale-[1.7]"
                      allow="autoplay; fullscreen"
                    />
                  </div>

                  <div>
                    <h3 className="font-black">{video.title}</h3>

                    <p className="mt-1 text-sm text-white/45">
                      {video.category}
                    </p>

                    <p className="mt-2 max-w-xl text-xs text-white/30">
                      {video.description || "لا يوجد وصف"}
                    </p>

                    <p className="mt-2 max-w-xl truncate text-xs text-white/20">
                      {video.video}
                    </p>
                  </div>
                </div>

                <div
                  className="relative self-end md:self-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setOpenMenu((prev) =>
                        prev === video.id ? null : video.id
                      );
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl transition hover:bg-white/15"
                  >
                    ⋯
                  </button>

                  {openMenu === video.id && (
                    <div className="absolute right-0 top-12 z-20 w-48 rounded-2xl border border-white/10 bg-[#121217] p-2 shadow-2xl shadow-black/50">
                      <a
                        href={`/admin/videos/edit?id=${video.id}`}
                        className="block rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
                      >
                        تعديل الفيديو
                      </a>

                      <button
                        onClick={() => handleDelete(video.id)}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                      >
                        حذف الفيديو
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