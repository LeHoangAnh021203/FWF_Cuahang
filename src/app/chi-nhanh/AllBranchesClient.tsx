"use client";

import branchesData from '../../../data/fwf-branches.json';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function AllBranchesClient() {
  const branches: Branch[] = branchesData as Branch[];
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const filteredBranches = selectedCity 
    ? branches.filter(branch => branch.city === selectedCity)
    : branches;

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (mapsUrl: string) => {
    window.open(mapsUrl, '_blank');
  };

  // Receive location from parent (WordPress) via postMessage
  // This lets the top window request geolocation and pass it down to the iframe
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      console.log('📍 AllBranchesClient received message:', event.data);
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

  const branchesSorted = (() => {
    if (!userCoords) return branches;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const getDistanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
      return R * c;
    };
    return [...branches].sort((b1, b2) => {
      const d1 = getDistanceKm(userCoords, { lat: b1.lat, lng: b1.lng });
      const d2 = getDistanceKm(userCoords, { lat: b2.lat, lng: b2.lng });
      return d1 - d2;
    });
  })();

  return (
    <div style={{ 
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '0 0.5rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            {selectedCity ? `Chi nhánh tại ${selectedCity}` : 'Tất cả chi nhánh Face Wash Fox'}
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            {selectedCity 
              ? `Tìm chi nhánh gần nhất tại ${selectedCity} và đặt lịch ngay hôm nay`
              : 'Tìm chi nhánh gần nhất và đặt lịch ngay hôm nay'
            }
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <Link href="/" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
              color: 'white',
              padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'transform 0.2s',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              ← Về trang chủ
            </Link>
            {selectedCity && (
              <Link href="/chi-nhanh" style={{
                display: 'inline-block',
                background: 'transparent',
                color: '#ff6b35',
                border: '2px solid #ff6b35',
                padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                Xem tất cả chi nhánh
              </Link>
            )}
          </div>
        </div>

        {/* Branches Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {filteredBranches.map((branch) => {
            const getBranchImage = (branchName: string) => {
              const name = branchName.toLowerCase();
              if (name.includes('vincom') || name.includes('btl')) {
                return '/Vincom BTL/Enscape_2025-09-26-04-27-15_S1-D90.jpg';
              } else if (name.includes('lotte')) {
                return '/Lotte HN 1/V9.jpg';
              } else if (name.includes('centre') || name.includes('center')) {
                return '/HN Centre/S4-C.jpg';
              } else if (name.includes('tower')) {
                return '/HN Tower/V1.jpg';
              }
              return '/Vincom BTL/Enscape_2025-09-26-04-29-58.jpg';
            };

            return (
              <div key={branch.id} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{
                  height: 'clamp(150px, 25vw, 200px)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Image
                    src={getBranchImage(branch.name)}
                    alt={`${branch.name} interior`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    priority={false}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(255, 107, 53, 0.9)',
                    color: 'white',
                    padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 2vw, 1rem)',
                    borderRadius: '20px',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    fontWeight: '600'
                  }}>
                    📍 {branch.city}
                  </div>
                </div>

                <div style={{ 
                  padding: 'clamp(1rem, 3vw, 1.5rem)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1 
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      fontWeight: 'bold',
                      color: '#333',
                      margin: 0,
                      flex: 1,
                      lineHeight: '1.3'
                    }}>
                      {branch.name}
                    </h3>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                    color: '#666',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ marginRight: '0.5rem', marginTop: '0.1rem' }}>📍</span>
                    <span>{branch.address}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    color: '#666',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>🕒</span>
                    <span>{branch.hours}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    color: '#666',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>📞</span>
                    <span>{branch.phone}</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginTop: 'auto'
                  }}>
                    <button
                      onClick={() => handleCall(branch.phone)}
                      style={{
                        background: '#ff6b35',
                        color: 'white',
                        border: 'none',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem)',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        minHeight: '44px'
                      }}
                    >
                      📞 Gọi
                    </button>
                    <button
                      onClick={() => handleDirections(branch.mapsUrl)}
                      style={{
                        background: '#43e97b',
                        color: 'white',
                        border: 'none',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem)',
                        borderRadius: '8px',
                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        minHeight: '44px'
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
      </div>
    </div>
  );
}



