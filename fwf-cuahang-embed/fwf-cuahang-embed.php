<?php
/*
Plugin Name: FWF Cửa Hàng
Description: Hiển thị trang cửa hàng FWF qua shortcode [fwf_cuahang_embed].
Version: 1.1
Author: Lê Hoàng Anh
*/

add_shortcode('fwf_cuahang_embed', function () {
  $admin_offset = is_admin_bar_showing() ? 32 : 0; // đẩy xuống nếu đang login (admin bar 32px)
  ob_start(); ?>
  <style>
    /* CSS Global để thống nhất cuộn */
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    
    /* Iframe có chiều cao đủ để hiển thị toàn bộ nội dung */
    .fwf-embed-page { 
      margin: 0; 
      padding: 0; 
      position: relative;
      width: 100%;
      height: 2500px; /* Chiều cao đủ để hiển thị toàn bộ website */
      z-index: 1;
    }

    .fwf-embed-wrap{
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .fwf-embed-wrap iframe{
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      /* Ẩn thanh cuộn iframe để chỉ dùng thanh cuộn WordPress */
      overflow: hidden;
      /* Ẩn thanh cuộn bằng CSS */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
      /* Đảm bảo iframe hiển thị đúng tỷ lệ */
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    
    /* Ẩn thanh cuộn cho Webkit browsers */
    .fwf-embed-wrap iframe::-webkit-scrollbar {
      display: none;
    }
    
    /* Responsive cho mobile */
    @media (max-width: 768px) {
      .fwf-embed-page {
        height: 2000px; /* Mobile có chiều cao đủ để hiển thị toàn bộ */
      }
      
      /* Cải thiện hiển thị trên mobile */
      .fwf-embed-wrap iframe {
        /* Đảm bảo iframe hiển thị tốt trên mobile */
        -webkit-overflow-scrolling: touch;
        /* Tối ưu cho touch */
        touch-action: manipulation;
      }
    }
    
    /* Responsive cho tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .fwf-embed-page {
        height: 2200px; /* Tablet có chiều cao phù hợp */
      }
    }
    
    /* Responsive cho mobile nhỏ */
    @media (max-width: 480px) {
      .fwf-embed-page {
        height: 1800px; /* Mobile nhỏ có chiều cao tối ưu */
      }
    }
    
    /* Đảm bảo không bị theme WordPress override */
    .fwf-embed-page * {
      box-sizing: border-box;
    }
    
    /* Đảm bảo footer hiển thị đúng */
    .site-footer,
    footer,
    .footer,
    #footer,
    .main-footer {
      position: relative;
      z-index: 2;
    }
  </style>
  <div class="fwf-embed-page">
    <div class="fwf-embed-wrap">
      <iframe
        src="https://fb-cuahang.vercel.app/"
        loading="eager"
        allow="geolocation *; clipboard-write *; fullscreen *"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      >
      </iframe>
    </div>
  </div>
  
  <style>
    /* CSS Global bổ sung để thống nhất cuộn */
    .fwf-embed-page {
      /* Đảm bảo iframe không bị ảnh hưởng bởi theme */
      isolation: isolate;
    }
    
    /* Ẩn thanh cuộn iframe trên mọi trình duyệt */
    .fwf-embed-wrap iframe {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
    }
    
    .fwf-embed-wrap iframe::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    
    /* Đảm bảo cuộn mượt mà */
    html {
      scroll-behavior: smooth;
    }
    
    /* Đảm bảo iframe hoạt động đầy đủ */
    .fwf-embed-wrap iframe {
      /* Cho phép JavaScript hoạt động */
      pointer-events: auto;
      /* Đảm bảo tương tác đầy đủ */
      user-select: auto;
      /* Cho phép focus và keyboard navigation */
      tabindex: 0;
    }
  </style>
  <script>
    (function(){
      const btn = document.getElementById('fwf-get-location');
      const iframe = document.querySelector('.fwf-embed-wrap iframe');
      if (!btn || !iframe) return;
      
      // Auto request location on page load (desktop-friendly)
      function requestLocation() {
        if (!navigator.geolocation) {
          btn.textContent = '❌ Không hỗ trợ định vị';
          return;
        }
        
        btn.disabled = true;
        btn.textContent = '📍 Đang lấy vị trí...';
        
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            const payload = { 
              type: 'fwf:setLocation', 
              lat: pos.coords.latitude, 
              lng: pos.coords.longitude 
            };
            try { 
              iframe.contentWindow.postMessage(payload, '*'); 
              btn.textContent = '✅ Đã lấy vị trí';
              btn.style.background = '#28a745';
            } catch(e) {
              console.warn('Cannot send to iframe:', e);
            }
          },
          function(err) {
            console.warn('Geolocation error:', err);
            btn.disabled = false;
            btn.textContent = '📍 Lấy vị trí của bạn';
            btn.style.background = '#ff6b35';
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 300000 // 5 minutes cache
          }
        );
      }
      
      // Auto request on load
      setTimeout(requestLocation, 1000);
      
      // Manual click
      btn.addEventListener('click', requestLocation);
    })();
  </script>
  
  <?php
  return ob_get_clean();
});

// Cho phép geolocation cho iframe từ fb-cuahang.vercel.app
add_action('send_headers', function () {
  // Permissions-Policy (Spec mới) và Feature-Policy (trình duyệt cũ)
  header("Permissions-Policy: geolocation=(self \"https://fb-cuahang.vercel.app\")");
  header("Feature-Policy: geolocation 'self' https://fb-cuahang.vercel.app");
});
