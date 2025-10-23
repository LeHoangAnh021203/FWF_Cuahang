# Hướng dẫn loại bỏ thanh cuộn kép trong iframe

## Vấn đề
Khi nhúng iframe vào WordPress, xuất hiện 2 thanh cuộn:
- Thanh cuộn của iframe bên trong
- Thanh cuộn của trang WordPress bên ngoài

## Giải pháp

### Bước 1: Thêm JavaScript vào trang Next.js (https://fb-cuahang.vercel.app/)

Thêm vào file `src/app/layout.tsx` hoặc tạo component riêng:

```javascript
"use client";

import { useEffect } from 'react';

export default function AutoHeightProvider({ children }) {
  useEffect(() => {
    const updateHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height }, "*");
    };
    
    // Cập nhật chiều cao ngay lập tức
    updateHeight();
    
    // Lắng nghe sự kiện resize
    window.addEventListener("resize", updateHeight);
    
    // Cập nhật chiều cao khi content thay đổi
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
```

### Bước 2: Wrap toàn bộ app với AutoHeightProvider

Trong `src/app/layout.tsx`:

```javascript
import AutoHeightProvider from './components/AutoHeightProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AutoHeightProvider>
          {children}
        </AutoHeightProvider>
      </body>
    </html>
  );
}
```

### Bước 3: Hoặc thêm trực tiếp vào layout.tsx

```javascript
"use client";

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const updateHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height }, "*");
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

## Cách hoạt động

1. **Next.js app** đo chiều cao thực tế của content
2. **Gửi message** với chiều cao về parent window (WordPress)
3. **WordPress nhận message** và điều chỉnh chiều cao iframe
4. **Loại bỏ thanh cuộn kép** - chỉ còn 1 thanh cuộn duy nhất

## Kết quả

- ✅ **Không còn thanh cuộn kép**
- ✅ **Iframe tự động điều chỉnh chiều cao**
- ✅ **Responsive** trên mọi thiết bị
- ✅ **Mượt mà** khi content thay đổi

## Debug

Mở Console để xem logs:
- `📏 Nhận chiều cao từ iframe: [số]`
- `✅ Đã lấy vị trí: [lat, lng]`

## Lưu ý

- JavaScript chỉ hoạt động khi iframe và parent cùng domain hoặc có cấu hình CORS đúng
- Cần deploy Next.js app trước khi test
- Nếu không hoạt động, kiểm tra Console để debug
