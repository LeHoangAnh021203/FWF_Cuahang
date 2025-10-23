<?php
/**
 * Plugin Name: FWF Cửa Hàng Embed
 * Description: Nhúng ứng dụng cửa hàng Face Wash Fox vào WordPress bằng shortcode [fwf_cuahang]
 * Version: 1.0.2
 * Author: Face Wash Fox
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Register shortcode: [fwf_cuahang]
add_shortcode('fwf_cuahang', 'fwf_cuahang_shortcode');

function fwf_cuahang_shortcode($atts) {
    ob_start();
    ?>
    <style>
      .fwf-embed-page { position: relative; width:100%; height:1200px; overflow:hidden; background:#f8fafc; }
      .fwf-embed-wrap { position: relative; width:100%; height:100%; }
      .fwf-embed-wrap iframe { width:100%; height:100%; border:0; overflow:hidden; scrollbar-width:none; -ms-overflow-style:none; }
      .fwf-embed-wrap iframe::-webkit-scrollbar { display:none; }
      @media (max-width: 768px) { .fwf-embed-page { height:1000px; } }
      @media (max-width: 480px) { .fwf-embed-page { height:900px; } }
      
      /* Auto height khi nhận message từ iframe */
      .fwf-embed-page.auto-height { height: auto !important; min-height: 600px; }
      .fwf-embed-wrap.auto-height { height: auto !important; }
      .fwf-embed-wrap.auto-height iframe { height: auto !important; min-height: 600px; }
    </style>

    <div class="fwf-embed-page">
      <div class="fwf-embed-wrap">
        <iframe
          src="https://fb-cuahang.vercel.app/"
          loading="eager"
          allow="geolocation 'self'; clipboard-write; fullscreen"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>

    <!-- Nút lấy vị trí đã được ẩn vì tự động lấy vị trí -->
    <div id="fwf-location-status" style="position:fixed;bottom:16px;right:16px;z-index:99999;background:#28a745;color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:600;display:none;">
      ✅ Đã lấy vị trí
    </div>

    <script>
    (function(){
      var statusDiv = document.getElementById('fwf-location-status');
      var iframe = document.querySelector('.fwf-embed-wrap iframe');
      var embedPage = document.querySelector('.fwf-embed-page');
      var embedWrap = document.querySelector('.fwf-embed-wrap');
      if(!iframe) return;
      
      function requestLocation(){
        if(!navigator.geolocation){ 
          console.log('❌ Không hỗ trợ định vị');
          return; 
        }
        
        console.log('📍 Đang tự động lấy vị trí...');
        
        navigator.geolocation.getCurrentPosition(
          function(pos){
            var payload = { 
              type:'fwf:setLocation', 
              lat: pos.coords.latitude, 
              lng: pos.coords.longitude 
            };
            try { 
              iframe.contentWindow.postMessage(payload, '*'); 
              console.log('✅ Đã lấy vị trí:', pos.coords.latitude, pos.coords.longitude);
              
              // Hiển thị status ngắn gọn
              if(statusDiv) {
                statusDiv.style.display = 'block';
                setTimeout(function(){
                  statusDiv.style.display = 'none';
                }, 3000);
              }
            }
            catch(e){ 
              console.log('❌ Lỗi gửi dữ liệu:', e);
            }
          }, 
          function(error){
            console.log('❌ Lỗi geolocation:', error.code, error.message);
            // Không hiển thị lỗi cho user, chỉ log để debug
          }, 
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 300000 
          }
        );
      }
      
      // Lắng nghe message từ iframe để điều chỉnh chiều cao
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'setHeight') {
          var newHeight = event.data.height;
          console.log('📏 Nhận chiều cao từ iframe:', newHeight);
          
          // Điều chỉnh chiều cao iframe
          if (newHeight && newHeight > 0) {
            iframe.style.height = newHeight + 'px';
            if (embedPage) embedPage.style.height = newHeight + 'px';
            if (embedWrap) embedWrap.style.height = newHeight + 'px';
            
            // Thêm class auto-height
            if (embedPage) embedPage.classList.add('auto-height');
            if (embedWrap) embedWrap.classList.add('auto-height');
          }
        }
      });
      
      // Tự động lấy vị trí ngay khi iframe load xong
      iframe.addEventListener('load', function(){
        setTimeout(requestLocation, 500);
      });
      
      // Fallback: nếu iframe đã load sẵn
      if(iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        setTimeout(requestLocation, 500);
      }
    })();
    </script>
    <?php
    return ob_get_clean();
}

// Set Permissions-Policy and other security headers to allow geolocation for the iframe origin
add_action('send_headers', function(){
    header('Permissions-Policy: geolocation=(self "https://fb-cuahang.vercel.app" "https://cua-hang-vua-dev.vercel.app"), camera=(), microphone=()');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}, 1000);