"use client";

import Hero from "@/src/components/Hero";
import BranchesList from "@/src/components/BranchesList";
import Link from "next/link";
import CitiesSection from "@/src/components/CitiesSection";
import ImageGallery from "@/src/components/ImageGallery";

export default function HomePage() {
  return (
    <>
      <main
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          padding: "0 1rem"
        }}>
          <Hero />
          <BranchesList />

          <CitiesSection />
          <ImageGallery />

          <section
            style={{
              background:
                "linear-gradient(-45deg, #ff6b35, #ff8c42, #ffa726, #ffb74d, #ff6b35)",
              backgroundSize: "400% 400%",
              color: "white",
              padding: "2rem 1rem",
              borderRadius: "16px",
              textAlign: "center",
              margin: "2rem 0",
              animation: "gradientShift 8s ease infinite",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              Tham gia cộng đồng Face Wash Fox
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 3vw, 1.1rem)",
                marginBottom: "2rem",
                opacity: 0.9,
                lineHeight: "1.6"
              }}
            >
              Trải nghiệm dịch vụ chăm sóc da chuyên nghiệp tại chi nhánh gần
              nhất
            </p>
            <Link
              href="https://www.facebook.com/facewashfox"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <button
                style={{
                  background: "white",
                  color: "#ff6b35",
                  border: "none",
                  padding: "clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)",
                  borderRadius: "8px",
                  fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  width: "100%",
                  maxWidth: "300px"
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Tham gia ngay
              </button>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
