"use client";

import branchesData from "../../data/fwf-branches.json";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

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

export default function BranchesList() {
  const branches: Branch[] = branchesData as Branch[];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  // Auto request location on mount (will still respect browser permissions)
  useEffect(() => {
    (async () => {
      try {
        const anyNav: any = navigator as any;
        if (anyNav?.permissions?.query) {
          const status = await anyNav.permissions.query({ name: 'geolocation' as PermissionName });
          if (status.state === 'denied') return; // respect explicit deny
        }
      } catch {}
      requestLocation();
    })();
  }, []);

  // Receive location from parent (WordPress) via postMessage
  // This lets the top window request geolocation and pass it down to the iframe
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      console.log('📍 BranchesList received message:', event.data);
      const data: any = event.data;
      if (!data || typeof data !== 'object') {
        console.log('📍 Invalid message format:', data);
        return;
      }
      if (data.type !== 'fwf:setLocation') {
        console.log('📍 Wrong message type:', data.type);
        return;
      }
      if (typeof data.lat !== 'number' || typeof data.lng !== 'number') {
        console.log('📍 Invalid coordinates:', data.lat, data.lng);
        return;
      }
      console.log('📍 Setting user coordinates:', data.lat, data.lng);
      setUserCoords({ lat: data.lat, lng: data.lng });
      setGeoError(null);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Get user location (optional)
  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Thiết bị không hỗ trợ định vị.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoError(null);
      },
      (err) => {
        setGeoError(err.message || 'Không thể lấy vị trí.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Haversine distance (km)
  const toRad = (v: number) => (v * Math.PI) / 180;
  const getDistanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  };

  const branchesSorted = (() => {
    if (!userCoords) return branches;
    return [...branches].sort((b1, b2) => {
      const d1 = getDistanceKm(userCoords, { lat: b1.lat, lng: b1.lng });
      const d2 = getDistanceKm(userCoords, { lat: b2.lat, lng: b2.lng });
      return d1 - d2;
    });
  })();

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleDirections = (mapsUrl: string) => {
    window.open(mapsUrl, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "2rem 0",
        animation: "fadeInUp 0.8s ease-out 1s both",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
          color: "#333",
          animation: "fadeInUp 0.8s ease-out 1.2s both",
        }}
      >
        {userCoords ? 'Chi nhánh gần bạn' : 'Chi nhánh phổ biến'}
      </h2>

      {/* If geolocation fails, we silently fallback to popular branches */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          padding: "0 1rem",
          animation: "fadeInUp 0.8s ease-out 1.4s both",
        }}
      >
        {branchesSorted.slice(0, 6).map((branch, index) => {
          // Map branch names to corresponding images
          const getBranchImage = (branchName: string) => {
            const name = branchName.toLowerCase();
            if (name.includes("vincom") || name.includes("btl")) {
              return "/Vincom BTL/Enscape_2025-09-26-04-27-15_S1-D90.jpg";
            } else if (name.includes("lotte")) {
              return "/Lotte HN 1/V9.jpg";
            } else if (name.includes("centre") || name.includes("center")) {
              return "/HN Centre/S4-C.jpg";
            } else if (name.includes("tower")) {
              return "/HN Tower/V1.jpg";
            }
            // Default image
            return "/Vincom BTL/Enscape_2025-09-26-04-29-58.jpg";
          };

          return (
            <div
              key={branch.id}
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                animation: `fadeInUp 0.6s ease-out ${1.6 + index * 0.1}s both`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              {/* Branch Image */}
              <div
                style={{
                  height: "150px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src={getBranchImage(branch.name)}
                  alt={`${branch.name} interior`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    ((e.currentTarget as HTMLImageElement).style.transform =
                      "scale(1)")
                  }
                  priority={false}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    background: "rgba(255, 107, 53, 0.9)",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  📍 {branch.city}
                </div>
              </div>

              <div style={{ padding: "1.5rem", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    color: "#333",
                  }}
                >
                  {branch.name}
                </h3>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {branch.address}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    🕒 {branch.hours}
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    📞 {branch.phone}
                  </span>
                </div>
                {userCoords && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      📍 Cách bạn khoảng {
                        getDistanceKm(userCoords, { lat: branch.lat, lng: branch.lng }).toFixed(1)
                      } km
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>{branch.city}</span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {branch.services.map((service, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#fff5f0",
                        color: "#ff6b35",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "end",
                    marginTop: 'auto'
                  }}
                >
                  <button
                    onClick={() => handleCall(branch.phone)}
                    style={{
                      flex: 1,
                      background: "#ff6b35",
                      color: "white",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#e55a2b")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#ff6b35")
                    }
                  >
                    📞 Gọi ngay
                  </button>
                  <button
                    onClick={() => handleDirections(branch.mapsUrl)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      color: "#ff6b35",
                      border: "2px solid #ff6b35",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#ff6b35";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#ff6b35";
                    }}
                  >
                    🗺️ Chỉ đường
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",

          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease-out 0.8s",
        }}
      >
        <Link
          href="/chi-nhanh"
          style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textDecoration: "none",
            display: "inline-block",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          }}
        >
          Xem tất cả chi nhánh
        </Link>
      </div>
    </section>
  );
}
