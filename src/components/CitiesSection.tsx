"use client";

import branchesData from "../../data/fwf-branches.json";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  services: string[];
  lat: number;
  lng: number;
  hours: string;
  mapsUrl: string;
  city: string;
}

export default function CitiesSection() {
  const branches: Branch[] = branchesData as Branch[];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Group branches by city
  const branchesByCity = branches.reduce((acc, branch) => {
    if (!acc[branch.city]) {
      acc[branch.city] = [];
    }
    acc[branch.city].push(branch);
    return acc;
  }, {} as Record<string, Branch[]>);

  const cities = Object.keys(branchesByCity);

  return (
    <section
      style={{
        padding: "3rem 0",
        background:
          "radial-gradient(1000px 400px at 50% -10%, rgba(67,56,202,0.12), transparent), radial-gradient(900px 400px at 60% 120%, rgba(236,72,153,0.12), transparent)",
        animation: "fadeInUp 0.8s ease-out 3.4s both",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "1rem",
          color: "#0f172a",
          letterSpacing: "0.2px",
          animation: "fadeInUp 0.8s ease-out 3.6s both",
        }}
      >
        Khám phá theo thành phố
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          margin: "0 auto 2rem",
          maxWidth: "680px",
        }}
      >
        Lướt nhanh qua các thành phố có chi nhánh của Face Wash Fox và tìm điểm
        đến phù hợp nhất với bạn.
      </p>

      {/* Horizontal scroll rail with snap like modern galleries */}
      <div
        className="city-rail"
        style={{
          display: "flex",
          color: "orange",
          gap: "1rem",
          padding: "0 1rem",
          margin: "0 auto",
          maxWidth: "1200px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cities.map((city, index) => {
          const cityBranches = branchesByCity[city];
          const colors = [
            "#ff6b35",
            "#ff8c42",
            "#ffa726",
            "#ffb74d",
            "#ffcc80",
          ];
          const color = colors[index % colors.length];

          return (
            <div
              key={city}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.75))",
                borderRadius: "20px",
                padding: "1rem",
                boxShadow: "0 12px 30px rgba(2,6,23,0.15)",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                animation: `fadeInUp 0.6s ease-out ${4.0 + index * 0.15}s both`,
                minWidth: "260px",
                maxWidth: "280px",
                scrollSnapAlign: "center",
                backgroundImage: 'url("/V4.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 24px 50px rgba(2,6,23,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(2,6,23,0.15)";
              }}
            >
              {/* Accent halo (decorative, non-interactive) */}
              <div
                style={{
                  position: "absolute",
                  inset: "-30%",
                  background: `radial-gradient(60% 60% at 50% 0%, ${color}1A, transparent 60%)`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    marginRight: "0.75rem",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/NhaCao@4x.png"
                    alt="city"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {city}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    {cityBranches.length} chi nhánh
                  </p>
                </div>
              </div>

              {/* Sample branches */}

              <Link
                href={`/chi-nhanh?city=${encodeURIComponent(city)}`}
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1rem",
                  borderRadius: "14px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  width: "100%",
                  textDecoration: "none",
                  display: "block",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Xem tất cả chi nhánh
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
