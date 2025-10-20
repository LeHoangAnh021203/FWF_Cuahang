"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const videos = [
  "/video/Vista.mp4",
  "/video/Vincom 3_2.mp4",
  "/video/The Sun.mp4",
  "/video/Sương Nguyệt Ánh.mp4",
  "/video/Skylake.mp4",
  "/video/Parc Mall.mp4",
  "/video/NOWZONE.mp4",
  "/video/Nha Trang.mp4",
  "/video/Lumiere.mp4",
  "/video/Landmark.mp4",
  "/video/Kosmo.mp4",
  "/video/Aeon Mall Tân Phú.mp4",
  "/video/Aeon Mall Bình Tân.mp4",
];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-advance video index
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Ensure current video plays when visible
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Swap source and play when page is visible
    const playIfPossible = () => {
      if (document.visibilityState !== "visible") return;
      try {
        el.currentTime = 0;
        el.play().catch(() => {});
      } catch {}
    };
    playIfPossible();
    const onVisibility = () => playIfPossible();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [currentVideoIndex]);

  return (
    <section
      style={{
        position: "relative",
        color: "white",
        padding: "4rem 2rem",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "2rem",
        overflow: "hidden",
        animation: "fadeInUp 0.8s ease-out",
        width: "100%",
        maxHeight: "70vh",
        marginTop: "0",
      }}
    >
      {/* Video Background (single element) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          maxWidth: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(-45deg, #ff6b35, #ff8c42, #ffa726, #ffb74d, #ff6b35)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 6s ease infinite",
          marginTop: "20px",
        }}
      >
        <video
          ref={videoRef}
          key={currentVideoIndex}
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onError={(e) => console.warn("Video error", e)}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "cover",
            opacity: 0.7,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>

      {/* Gradient Overlay with Enhanced Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(-45deg, rgba(255, 107, 53, 0.8), rgba(255, 140, 66, 0.8), rgba(255, 167, 38, 0.8), rgba(255, 183, 77, 0.8), rgba(255, 107, 53, 0.8))",
          backgroundSize: "400% 400%",
          animation: "gradientShift 6s ease infinite",
          zIndex: -1,
          opacity: isTransitioning ? 0.9 : 0.8,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      {/* Transition Overlay */}
      {isTransitioning && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 70%)",
            zIndex: -0.5,
            animation: "fadeInUp 0.3s ease-out",
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "min(900px, 92%)",
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            backdropFilter: "blur(5px)",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
              animation: "fadeInUp 0.8s ease-out 0.2s both",
              textShadow: "0 4px 16px rgba(0,0,0,0.6)",
              color:"rgba(249,112,61,1)"
            }}
          >
            Khám phá Face Wash Fox
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              opacity: 0.9,
              animation: "fadeInUp 0.8s ease-out 0.4s both",
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
            }}
          >
            Hệ thống cửa hàng mỹ phẩm hàng đầu với dịch vụ tư vấn chuyên nghiệp
            và sản phẩm chất lượng cao
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fadeInUp 0.8s ease-out 0.6s both",
            }}
          >
            <button
              style={{
                background: "white",
                color: "#ff6b35",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              Xem chi nhánh
            </button>
            <Link
              href="/chi-nhanh"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#ff6b35",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#ff6b35";
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.2)";
                }}
              >
                Đặt lịch
              </button>
            </Link>
          </div>

          {/* Statistics */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginTop: "3rem",
              flexWrap: "wrap",
              animation: "fadeInUp 0.8s ease-out 0.8s both",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                backdropFilter: "blur(15px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>47+</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Chi nhánh</div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                backdropFilter: "blur(15px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3+</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Thành phố</div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 2rem",
                borderRadius: "12px",
                backdropFilter: "blur(15px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>10k+</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Khách hàng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
