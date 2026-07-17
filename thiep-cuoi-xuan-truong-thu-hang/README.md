# Thiệp cưới online — Xuân Trường & Thu Hằng

Đây là website thiệp cưới tĩnh, responsive, có thể đưa lên hosting thông thường,
GitHub Pages, Netlify, Vercel hoặc cPanel.

## Nội dung đã điền theo thiệp giấy

- Chú rể: Đoàn Xuân Trường
- Cô dâu: Phan Thu Hằng
- Ngày cưới: Chủ Nhật, 02/08/2026
- Lễ tân hôn: 09:30 tại tư gia nhà trai
- Tiệc cưới: 10:30 tại Sân Tiệc Cưới Trịnh Trúc
- Địa chỉ tiệc: QL. 28 – Khu Phố Thắng Hiệp, Phường Hàm Thắng, Tỉnh Lâm Đồng

## Chạy thử trên máy

Mở Terminal tại thư mục này rồi chạy:

```bash
python3 -m http.server 8080
```

Sau đó truy cập:

```text
http://localhost:8080
```

## Cá nhân hóa tên khách mời

Website đọc tên khách từ query parameter `guest`.

Ví dụ:

```text
https://tenmiencuaban.vn/?guest=Anh%20Thiện%20%2B
```

Nếu URL không có `guest`, website dùng giá trị `defaultGuest` trong
`assets/config.js`.

## Thay ảnh

Giữ nguyên tên file hoặc sửa đường dẫn trong `index.html`.

- `assets/images/cover.svg`: ảnh bìa
- `assets/images/groom.svg`: ảnh chú rể
- `assets/images/bride.svg`: ảnh cô dâu
- `assets/images/album-1.svg` … `album-5.svg`: ảnh album

Bạn có thể thay bằng JPG/PNG/WebP. Ví dụ đổi `cover.svg` thành `cover.jpg`, rồi
sửa trong `assets/style.css`:

```css
background-image: url("images/cover.jpg");
```

## Thay nhạc

Thay file `assets/music-placeholder.wav` bằng một file nhạc được phép sử dụng,
sau đó sửa nguồn trong `index.html`, ví dụ:

```html
<source src="assets/music.mp3" type="audio/mpeg" />
```

Trình duyệt chỉ cho phép phát nhạc sau khi khách bấm **Mở thiệp**.

## Sửa nội dung, địa chỉ, bản đồ và ngân hàng

Mở `assets/config.js`.

Các mục quan trọng:

- `defaultGuest`
- `ceremony`
- `reception`
- `banks`
- `rsvpPhone`
- `formEndpoint`

## Nhận RSVP

Mặc định, website lưu xác nhận trên thiết bị và tải xuống file TXT.

Có 3 lựa chọn:

1. **WhatsApp**: điền `rsvpPhone` theo định dạng quốc tế, ví dụ `84912345678`.
2. **Formspree / Google Apps Script**: điền URL vào `formEndpoint`.
3. **Backend riêng**: chỉnh phần submit trong `assets/app.js`.

## Đưa website lên mạng

### Netlify

1. Đăng nhập Netlify.
2. Kéo toàn bộ thư mục này vào trang Deploy.
3. Gắn tên miền nếu cần.

### GitHub Pages

1. Tạo repository.
2. Upload toàn bộ file.
3. Bật Pages trong Settings → Pages.

### cPanel

1. Nén nội dung thành ZIP.
2. Upload vào `public_html`.
3. Giải nén, bảo đảm `index.html` nằm trực tiếp trong `public_html`.

## Lưu ý

Website được dựng lại độc lập theo cấu trúc trải nghiệm của thiệp mẫu mà bạn
cung cấp, không sao chép mã nguồn riêng của website mẫu.
