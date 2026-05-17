"use client";
 
import { useEffect, useState, useRef, useCallback } from "react";
import { Video } from "../types/video";
import { getAdminVideos } from "../lib/adminVideos";
 
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaBehance,
  FaVimeoV,
} from "react-icons/fa";
 
const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/agyad_sakallah",
    icon: <FaInstagram />,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/18j73MW8dc/?mibextid=wwXIfr",
    icon: <FaFacebookF />,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@agyadsakallah1",
    icon: <FaTiktok />,
  },
  {
    name: "Behance",
    href: "https://www.behance.net/aghyadsakallah",
    icon: <FaBehance />,
  },
  {
    name: "Vimeo",
    href: "https://vimeo.com/user218515321",
    icon: <FaVimeoV />,
  },
];
 
function getVimeoId(url: string) {
  return url.split("/").pop();
}
 
export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [sliderIndex, setSliderIndex] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(5);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroVisible, setHeroVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mainRef = useRef<HTMLDivElement>(null);
 
  const categories = [...new Set(videos.map((v) => v.category))];
 
  // Mouse spotlight
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);
 
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);
 
  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);
 
  // Section intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = (entry.target as HTMLElement).dataset.sectionKey;
            if (key) setSectionsVisible((prev) => ({ ...prev, [key]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
 
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
 
    return () => observer.disconnect();
  }, [categories]);
 
  useEffect(() => {
    getAdminVideos().then((data) => {
      setVideos(data);
    });
  }, []);
 
  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth < 1024 ? 2 : 5);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);
 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
 
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex((prev) => {
        const next = { ...prev };
        categories.forEach((category) => {
          const count = videos.filter((v) => v.category === category).length;
          if (count > visibleCount) {
            next[category] = ((prev[category] ?? 0) + 1) % count;
          }
        });
        return next;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [visibleCount, videos.length]);
 
  const moveSlider = (category: string, count: number, direction: "next" | "prev") => {
    if (count <= visibleCount) return;
    setSliderIndex((prev) => {
      const current = prev[category] ?? 0;
      const next =
        direction === "next"
          ? (current + 1) % count
          : (current - 1 + count) % count;
      return { ...prev, [category]: next };
    });
  };
 
  return (
    <main
      ref={mainRef}
      className="min-h-screen overflow-hidden bg-[#050816] text-white"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* === BACKGROUND LAYERS === */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Mouse spotlight covers entire screen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 800px 800px at ${mousePos.x}px ${mousePos.y}px, rgba(123,97,255,0.15) 0%, rgba(123,97,255,0.04) 50%, transparent 70%)`,
          }}
        />
        {/* Static nebula gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(123,97,255,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_10%_60%,rgba(123,97,255,0.07),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_40%_at_90%_80%,rgba(123,97,255,0.06),transparent)]" />
 
        {/* Noise grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
 
 
 
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050816] to-transparent" />
      </div>
 
      {/* === NAVBAR === */}
      <header
        className="sticky top-0 z-40 px-4 pt-5 pb-2 md:px-12"
        style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          {/* Logo */}
          <div className="flex w-1/2 items-center">
            <img
              src="/logo.png"
              alt="logo"
              className="h-5 w-auto object-contain md:h-6"
            />
          </div>
 
          {/* Available pill */}
          <div className="flex w-1/2 justify-end">
            <div className="group relative overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 backdrop-blur-2xl transition duration-500 hover:border-emerald-400/20 hover:bg-emerald-400/[0.04]">
              <div className="flex items-center gap-2">
                <div className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                </div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/80 md:text-[9px]">
                  Available For Projects
                </p>
              </div>
            </div>
          </div>
        </nav>
      </header>
 
      {/* === HERO === */}
      <section className="relative px-4 pb-12 pt-8 md:px-12 md:pb-24 md:pt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          {/* Eyebrow */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[9px] uppercase tracking-[0.5em] text-[#9CA3AF] backdrop-blur-xl md:text-[10px]">
              Creative Video Ads & Cinematic Content
            </p>
          </div>
 
          {/* Headline with animated glow */}
          <div
            className="relative mt-7"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s",
            }}
          >
            {/* Glow blob behind title */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 600,
                height: 200,
                background:
                  "radial-gradient(ellipse, rgba(123,97,255,0.22) 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "glow-pulse 4s ease-in-out infinite alternate",
              }}
            />
            <h1 className="mx-auto max-w-5xl text-[2rem] font-black leading-[1.08] tracking-tight md:text-[4.5rem] lg:text-[5.5rem]">
              Scroll-Stopping{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #7B61FF 40%, rgba(255,255,255,0.5) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Visuals For Modern Brands.
              </span>
            </h1>
          </div>
 
          {/* Benefits */}
          <div
            className="mx-auto mt-10 flex flex-wrap justify-center gap-3 md:gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
            }}
          >
            {[
              "Scroll-Stopping Visuals",
              "High-Converting Video Ads",
              "Built For Modern Brands",
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white/70 backdrop-blur-xl transition duration-300 hover:border-[#7B61FF]/30 hover:bg-[#7B61FF]/[0.07] hover:text-white/90 md:text-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-[#7B61FF] opacity-80">✦</span>
                {item}
              </div>
            ))}
          </div>
 
          {/* Subtext */}
          <p
            className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#9CA3AF] md:text-base"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.8s",
            }}
          >
            Cinematic visuals engineered for engagement & conversions.
          </p>
        </div>
      </section>
 
      {/* === VIDEO SECTIONS === */}
      <section id="videos" className="px-4 pb-28 md:px-12 md:pb-40">
        <div className="mx-auto max-w-7xl space-y-20 md:space-y-32">
          {videos.length === 0 && (
            <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-12 text-center text-white/30">
              No videos yet. Add videos from the dashboard.
            </div>
          )}
 
          {categories.map((category, catIndex) => {
            const filteredVideos = videos.filter((v) => v.category === category);
            const currentIndex = sliderIndex[category] ?? 0;
            const needsSlider = filteredVideos.length > visibleCount;
            const displayVideos = needsSlider
              ? [...filteredVideos, ...filteredVideos]
              : filteredVideos;
 
            const isVisible = sectionsVisible[category];
 
            return (
              <div
                key={category}
                ref={(el) => {
                  sectionRefs.current[category] = el;
                }}
                data-section-key={category}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `opacity 0.8s ease ${catIndex * 0.1}s, transform 0.8s ease ${catIndex * 0.1}s`,
                }}
              >
                {/* Category Header */}
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div className="relative pl-5">
                    {/* Accent line */}
                    <div className="absolute left-0 top-0 h-full w-[3px] overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full w-full rounded-full bg-gradient-to-b from-[#7B61FF] to-[#7B61FF]/30"
                        style={{
                          transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                          transformOrigin: "top",
                          transition: `transform 0.6s ease ${catIndex * 0.1 + 0.3}s`,
                        }}
                      />
                    </div>
 
                    <h2 className="text-2xl font-black tracking-tight md:text-4xl">
                      {category}
                    </h2>
                    <p className="mt-2.5 max-w-md text-sm leading-6 text-[#9CA3AF] md:text-base">
                      High-converting direct response ads built for modern brands & social media campaigns.
                    </p>
                  </div>
 
                  {needsSlider && (
                    <div className="flex items-center gap-2">
                      {(["prev", "next"] as const).map((dir) => (
                        <button
                          key={dir}
                          onClick={() => moveSlider(category, filteredVideos.length, dir)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-xl text-white/60 backdrop-blur-2xl transition duration-300 hover:border-[#7B61FF]/40 hover:bg-[#7B61FF]/10 hover:text-white active:scale-95"
                        >
                          {dir === "prev" ? "‹" : "›"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
 
                {/* Slider */}
                <div className="-my-5 overflow-hidden py-5">
                  <div
                    className={`flex gap-4 ${
                      needsSlider
                        ? "transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]"
                        : ""
                    }`}
                    style={{
                      transform: needsSlider
                        ? `translateX(calc(-${currentIndex} * ((100% - ${
                            (visibleCount - 1) * 16
                          }px) / ${visibleCount} + 16px)))`
                        : "translateX(0)",
                    }}
                  >
                    {displayVideos.map((video, index) => (
                      <VideoCard
                        key={`${video.id}-${index}`}
                        video={video}
                        visibleCount={visibleCount}
                        index={index}
                        isVisible={isVisible}
                        onClick={() => setSelectedVideo(video)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
 
      {/* === MODAL === */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl"
          style={{ animation: "fade-in 0.25s ease" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-white/[0.1] bg-black shadow-[0_0_80px_rgba(123,97,255,0.2)]"
            style={{ animation: "scale-in 0.3s ease" }}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-xl text-white/80 backdrop-blur-2xl transition duration-300 hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
 
            <iframe
              src={`https://player.vimeo.com/video/${getVimeoId(
                selectedVideo.video
              )}?autoplay=1&muted=0&loop=1`}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
 
      {/* === FOOTER === */}
      <footer className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-12 md:px-12 md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight">
              Aghyad
              <span className="text-[#7B61FF]"> Sakallah</span>
            </h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Creative Video Ads & Cinematic Content
            </p>
          </div>
 
          <div className="flex flex-wrap justify-center gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[16px] text-white/60 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#7B61FF]/40 hover:bg-[#7B61FF]/10 hover:text-white hover:shadow-[0_0_24px_rgba(123,97,255,0.2)]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
 
      {/* === GLOBAL KEYFRAMES === */}
      <style jsx global>{`
        @keyframes glow-pulse {
          from { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95); }
          to   { opacity: 1;   transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
 
/* ============================================================
   VIDEO CARD — extracted to avoid inline complexity
   ============================================================ */
function VideoCard({
  video,
  visibleCount,
  index,
  isVisible,
  onClick,
}: {
  video: Video;
  visibleCount: number;
  index: number;
  isVisible: boolean;
  onClick: () => void;
}) {
  function getVimeoId(url: string) {
    return url.split("/").pop();
  }
 
  return (
    <button
      onClick={onClick}
      className="group relative min-w-[calc(50%-8px)] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] text-left backdrop-blur-2xl lg:min-w-[calc(20%-13px)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `
          opacity 0.6s ease ${index * 0.07}s,
          transform 0.6s ease ${index * 0.07}s,
          box-shadow 0.4s ease,
          border-color 0.4s ease
        `,
        boxShadow: "0 0 0 rgba(123,97,255,0)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 20px 60px rgba(123,97,255,0.15), 0 0 0 1px rgba(123,97,255,0.15)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(123,97,255,0.3)";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-8px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 0 0 rgba(123,97,255,0)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
      }}
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        {/* Vimeo iframe */}
        <iframe
          src={`https://player.vimeo.com/video/${getVimeoId(video.video)}?autoplay=1&muted=1&loop=1&background=1`}
          className="h-full w-full transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.08] group-hover:blur-[1.5px]"
          style={{ transform: "scale(1.35)" }}
          allow="autoplay; fullscreen"
        />
 
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition duration-500 group-hover:from-black/70" />
 
        {/* Category badge */}
        <div className="absolute left-3 top-3 rounded-full border border-white/[0.1] bg-black/30 px-3 py-1 text-[10px] tracking-wide text-white/70 backdrop-blur-xl">
          {video.category}
        </div>
 
        {/* Play button — revealed on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-400 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white shadow-[0_0_30px_rgba(123,97,255,0.4)] backdrop-blur-2xl transition duration-300 group-hover:scale-110">
            ▶
          </div>
        </div>
 
        {/* Title / description */}
        <div className="absolute bottom-4 left-4 right-4 transition duration-500 group-hover:translate-y-[-2px]">
          <h3 className="text-sm font-black leading-tight md:text-base">
            {video.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-white/40">
            {video.description}
          </p>
        </div>
      </div>
    </button>
  );
}