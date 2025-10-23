# Hướng dẫn khắc phục lỗi Geolocation Permissions Policy với Cloudflare

## Vấn đề
- `Permissions policy violation: Geolocation access has been blocked because of a permissions policy applied to the current document`
- `Potential permissions policy violation: camera is not allowed in this document`
- `Potential permissions policy violation: microphone is not allowed in this document`
- `Failed to load resource: the server responded with a status of 404`

## Giải pháp đã triển khai

### 1. Cấu hình Next.js (next.config.mjs)
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(self "https://fb-cuahang.vercel.app" "https://cua-hang-vua-dev.vercel.app"), camera=(), microphone=()'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        }
      ]
    }
  ];
}
```

### 2. Cấu hình Vercel (vercel.json)
File `vercel.json` đã được tạo với headers phù hợp.

### 3. Cấu hình Cloudflare

#### Cách 1: Sử dụng Page Rules
1. Đăng nhập vào Cloudflare Dashboard
2. Chọn domain của bạn
3. Vào **Rules** > **Page Rules**
4. Tạo rule mới với:
   - URL pattern: `*yourdomain.com/*`
   - Settings:
     - **Security Level**: Medium
     - **Browser Integrity Check**: Off
     - **Disable Security**: On (tạm thời để test)

#### Cách 2: Sử dụng Transform Rules (Khuyến nghị)
1. Vào **Rules** > **Transform Rules**
2. Chọn **HTTP Request Header Modification**
3. Tạo rule:
   - **When incoming requests match**:
     - Field: `Host`
     - Operator: `equals`
     - Value: `yourdomain.com`
   - **Then**:
     - **Set static**:
       - Header name: `Permissions-Policy`
       - Value: `geolocation=(self "https://fb-cuahang.vercel.app" "https://cua-hang-vua-dev.vercel.app")`

#### Cách 3: Sử dụng Workers (Nâng cao)
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response)
  
  // Add headers
  newResponse.headers.set('Permissions-Policy', 'geolocation=(self "https://fb-cuahang.vercel.app" "https://cua-hang-vua-dev.vercel.app")')
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN')
  
  return newResponse
}
```

### 4. Cấu hình WordPress (nếu sử dụng embed)
File `fwf-cuahang-embed.php` đã được cập nhật với:
- Headers phù hợp
- Error handling tốt hơn
- Timeout tăng lên 15 giây

## Kiểm tra sau khi cấu hình

### 1. Kiểm tra headers
```bash
curl -I https://yourdomain.com
```

Kết quả mong đợi:
```
Permissions-Policy: geolocation=(self "https://fb-cuahang.vercel.app" "https://cua-hang-vua-dev.vercel.app"), camera=(), microphone=()
X-Frame-Options: SAMEORIGIN
```

### 2. Test trong browser
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Reload trang
4. Kiểm tra không còn lỗi Permissions Policy

### 3. Test geolocation
1. Click vào nút "📍 Lấy vị trí của bạn"
2. Cho phép browser truy cập vị trí
3. Kiểm tra chi nhánh được sắp xếp theo khoảng cách

## Troubleshooting

### Nếu vẫn còn lỗi:
1. **Clear Cloudflare cache**: Purge Everything
2. **Kiểm tra SSL**: Đảm bảo HTTPS được bật
3. **Kiểm tra CSP**: Content Security Policy có thể chặn geolocation
4. **Test trên incognito**: Đảm bảo không có extension nào can thiệp
5. **Kiểm tra lỗi 404**: 
   - Xem Network tab trong DevTools để tìm resource nào bị 404
   - Kiểm tra đường dẫn images và assets
   - Đảm bảo tất cả resources được deploy đúng
6. **Kiểm tra iframe src**: Đảm bảo URL iframe chính xác và accessible

### Debug trong Console:
```javascript
// Kiểm tra permissions
navigator.permissions.query({name: 'geolocation'}).then(result => {
  console.log('Geolocation permission:', result.state);
});

// Test geolocation
navigator.geolocation.getCurrentPosition(
  pos => console.log('Success:', pos.coords),
  err => console.log('Error:', err.code, err.message)
);
```

## Lưu ý quan trọng
- Luôn test trên HTTPS
- Một số browser có thể cần user interaction trước khi cho phép geolocation
- Cloudflare có thể cache headers, cần purge cache sau khi thay đổi
