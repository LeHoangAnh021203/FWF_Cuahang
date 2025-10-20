"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
}

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Danh sách ảnh từ các folder
  const images: ImageData[] = [
    // Vincom BTL
    {
      src: "/Vincom BTL/Enscape_2025-09-26-04-30-20.jpg",
      alt: "Vincom BTL Interior",
    },
    {
      src: "/Vincom BTL/Enscape_2025-09-26-04-29-58.jpg",
      alt: "Vincom BTL Interior",
    },
    {
      src: "/Vincom BTL/Enscape_2025-09-26-04-27-15_S1-D90.jpg",
      alt: "Vincom BTL Store Design",
    },
    {
      src: "/Vincom BTL/Enscape_2025-09-26-04-27-15_MT1-D90.jpg",
      alt: "Vincom BTL Main Area",
    },

    // Lotte HN 1
    {
      src: "/Lotte HN 1/V9.jpg",
      alt: "Lotte HN 1 Interior",
    },
    {
      src: "/Lotte HN 1/V6.jpg",
      alt: "Lotte HN 1 Design",
    },
    {
      src: "/Lotte HN 1/V4.jpg",
      alt: "Lotte HN 1 Layout",
    },
    {
      src: "/Lotte HN 1/F1.jpg",
      alt: "Lotte HN 1 Floor Plan",
    },

    // HN Centre
    {
      src: "/HN Centre/S4-C.jpg",
      alt: "HN Centre Store Design",
    },
    {
      src: "/HN Centre/S3-C.jpg",
      alt: "HN Centre Interior",
    },
    {
      src: "/HN Centre/V8.jpg",
      alt: "HN Centre Layout",
    },
    {
      src: "/HN Centre/MT2-C.jpg",
      alt: "HN Centre Main Area",
    },

    // HN Tower
    {
      src: "/HN Tower/V1.jpg",
      alt: "HN Tower Interior",
    },
    {
      src: "/HN Tower/V3.jpg",
      alt: "HN Tower Design",
    },
    {
      src: "/HN Tower/MT1.jpg",
      alt: "HN Tower Main Area",
    },
    {
      src: "/HN Tower/PV.jpg",
      alt: "HN Tower Plan View",
    },
  ];

  const openModal = (src: string) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section
      style={{
        padding: "4rem 0",
        background: "linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%)",
        animation: "fadeInUp 0.8s ease-out 4.2s both",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <h2
          style={{
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "1rem",
            color: "#333",
            fontWeight: "bold",
            animation: "fadeInUp 0.8s ease-out 4.4s both",
          }}
        >
          Không gian chi nhánh
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
            marginBottom: "3rem",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
            animation: "fadeInUp 0.8s ease-out 4.6s both",
          }}
        >
          Khám phá không gian thiết kế hiện đại và chuyên nghiệp tại các chi
          nhánh Face Wash Fox
        </p>

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            animation: "fadeInUp 0.8s ease-out 4.8s both"
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              animation: "scrollHorizontal 30s linear infinite",
              width: "200%"
            }}
          >
          {/* First set of images */}
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "280px",
                flexShrink: 0
              }}
              onClick={() => openModal(image.src)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={200}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "white",
                  padding: "1rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              ></div>
            </div>
          ))}

          {/* Duplicate set of images for seamless loop */}
          {images.map((image, index) => (
            <div
              key={`duplicate-${index}`}
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "280px",
                flexShrink: 0,
              }}
              onClick={() => openModal(image.src)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={200}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "white",
                  padding: "1rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              ></div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={closeModal}
        >
          <Image
            src={selectedImage}
            alt="Full size"
            width={1200}
            height={800}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              fontSize: "1.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
