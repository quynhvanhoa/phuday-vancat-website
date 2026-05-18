# Phủ Dầy Vân Cát — Website

Trang thông tin chính thức của **Phủ Dầy Vân Cát** — nơi Mẫu Liễu Hạnh giáng sinh lần thứ hai. Xã Kim Thái, huyện Vụ Bản, tỉnh Ninh Bình (Nam Định cũ).

> Di tích quốc gia về kiến trúc nghệ thuật · Trung tâm thực hành Tín ngưỡng thờ Mẫu Tam phủ — Di sản văn hóa phi vật thể đại diện của nhân loại (UNESCO 2016).

## 🌐 Truy cập website

- **Bản triển khai (GitHub Pages):** _đang cập nhật_
- **Tên miền chính thức:** _đang cập nhật_

## 📂 Cấu trúc

```
.
├── index.html              # Trang chủ tiếng Việt
├── gioi-thieu.html
├── tin-nguong-tho-mau.html
├── tour-360.html
├── le-hoi.html
├── thu-vien.html
├── tin-tuc.html
├── bai-viet.html          # Trang chi tiết 1 bài viết (đọc ?id=X)
├── lien-he.html
├── content.json           # ⭐ Toàn bộ nội dung động (bài viết, sự kiện, ảnh, cài đặt)
├── en/                    # 8 trang tiếng Anh
├── admin/                 # Trang quản trị (sửa nội dung)
└── assets/
    ├── css/style.css
    └── js/
        ├── main.js
        └── public-content.js
```

## 🔧 Quản trị nội dung

1. Chạy local: `python3 -m http.server 8765` trong thư mục này
2. Mở `http://localhost:8765/admin/` — đăng nhập (mật khẩu trong file admin)
3. Sửa nội dung → click **🚀 Xuất bản** để tải file `content.json`
4. Commit file `content.json` mới lên repo này → website tự cập nhật sau 1–2 phút

## 🛠 Công nghệ

- HTML5 / CSS3 / Vanilla JavaScript (không framework)
- Hosting: GitHub Pages (miễn phí)
- Dữ liệu: 1 file JSON tĩnh

## 📝 Bản quyền

© 2026 Phủ Dầy Vân Cát. Mọi quyền được bảo lưu.
