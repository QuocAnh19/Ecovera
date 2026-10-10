# Ecovera - Organic eCommerce Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange)](https://zustand-demo.pmnd.rs/)
[![SCSS](https://img.shields.io/badge/Style-SCSS_Modules-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)

**Ecovera** là nền tảng thương mại điện tử chuyên kinh doanh các sản phẩm nông sản và thực phẩm hữu cơ. Dự án được thiết kế theo kiến trúc phân tầng (Layered Architecture) ở phía Backend và cấu trúc Modular Component ở phía Frontend, đảm bảo tính bảo mật giao dịch, toàn vẹn dữ liệu kho hàng và trải nghiệm mua sắm tối ưu.

---

## Mục lục

- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Kiến trúc & Công nghệ](#-kiến-trúc--công-nghệ)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
- [Biến môi trường (Environment Variables)](#-biến-môi-trường)
- [Điểm nhấn kỹ thuật chuyên sâu](#-điểm-nhấn-kỹ-thuật-chuyên-sâu)

---

## Tính năng nổi bật

### Phía Khách hàng (Storefront)

- **Duyệt & Tìm kiếm:** Phân loại sản phẩm theo danh mục (Trái cây, Rau củ, Hạt hữu cơ...), lọc giá và tìm kiếm nhanh.
- **Giỏ hàng Hybrid thông minh:**
  - Khách vãng lai (Guest): Lưu trữ trạng thái giỏ hàng tự động trên `LocalStorage` qua Zustand Persist.
  - Sau khi đăng nhập: Tự động hợp nhất (merge) giỏ hàng cục bộ với cơ sở dữ liệu trên Server.
- **Thanh toán an toàn (ACID Checkout):** Xử lý đơn hàng với Database Transaction, khóa dòng kiểm tra tồn kho nghiêm ngặt, chống gian lận giá từ Client.
- **Xác thực JWT:** Access Token / Refresh Token cơ chế tự động đính kèm qua Axios Interceptors.

### Phía Quản trị (Admin Dashboard)

- Quản lý kho hàng & danh mục sản phẩm (CRUD sản phẩm).
- Quản lý đơn hàng, cập nhật trạng thái thanh toán và vận chuyển.
- Thống kê doanh thu và quản lý người dùng.

---

## Kiến trúc & Công nghệ

### 1. Frontend (`Client/`)

- **Core:** React 18, React Router DOM
- **State Management:** Zustand (với middleware `persist` cho giỏ hàng)
- **HTTP Client:** Axios với Request/Response Interceptors
- **Styling:** SCSS Modules, CSS Variables, Flexbox/Grid responsive

### 2. Backend (`Server/`)

- **Runtime:** Node.js & Express.js
- **Database:** MySQL
- **Pattern:** Layered Architecture (`Routes` $\rightarrow$ `Controllers` $\rightarrow$ `Services` $\rightarrow$ `Models`)
- **Error Handling:** Centralized Error Middleware (`AppError`, `asyncHandler`)
- **Security:** `bcryptjs` băm mật khẩu, `jsonwebtoken` xác thực phiên

---

## Cấu trúc thư mục

```text
Ecovera/
├── Client/                      # Ứng dụng Frontend React
│   ├── public/                  # Favicon & tài nguyên tĩnh HTML
│   └── src/
│       ├── Assets/              # Hình ảnh, SVG icons
│       ├── Components/          # UI Components dùng chung (Button, Tag, Navbar...)
│       ├── features/            # Feature-based components (ProductCard...)
│       ├── Layouts/             # Bố cục layout (Admin, Category, Dashboard)
│       ├── Pages/               # Các trang giao diện (Home, Shop, Cart, Checkout...)
│       ├── services/            # Tầng mạng API (apiClient, cartApi, orderApi...)
│       ├── store/               # State Zustand (useCartStore...)
│       ├── Styles/              # SCSS biến, mixins và typography
│       └── utils/               # Helper chức năng (token, format tiền tệ)
│
├── Server/                      # Ứng dụng Backend Express
│   └── src/
│       ├── Config/              # Kết nối Database (MySQL connection pool)
│       ├── controllers/         # Nhận HTTP request & gửi response chuẩn
│       ├── middlewares/         # Auth, Error Handler, Upload
│       ├── routes/              # Định tuyến API endpoint
│       ├── services/            # Nghiệp vụ xử lý logic chính & truy vấn DB
│       ├── uploads/             # Thư mục lưu trữ hình ảnh upload
│       ├── utils/               # AppError, asyncHandler, ApiResponse
│       ├── app.js               # Cấu hình Express app & middleware
│       └── server.js            # Khởi tạo HTTP server listener
└── README.md
```

---

## Cài đặt & Khởi chạy

### Yêu cầu tiên quyết

- **Node.js** (phiên bản `>= 18.x`)
- **MySQL Server** (phiên bản `>= 8.x`)
- Trình quản lý gói `npm` hoặc `yarn`

### 1. Clone repository

```bash
git clone https://github.com/QuocAnh19/Ecovera.git
cd Ecovera
```

### 2. Khởi chạy Backend (`Server`)

```bash
cd Server
npm install

# Tạo và cấu hình biến môi trường
cp .env.example .env

# Chạy server ở chế độ phát triển
npm run dev
```

> Server sẽ mặc định chạy tại: `http://localhost:5000`

### 3. Khởi chạy Frontend (`Client`)

Mở một cửa sổ Terminal mới:

```bash
cd Client
npm install

# Tạo và cấu hình biến môi trường
cp .env.example .env

# Chạy giao diện React
npm start
# hoặc: npm run dev (tùy theo bundler)
```

> Frontend sẽ mặc định mở tại: `http://localhost:3000`

---

## Biến môi trường

### Phía Backend (`Server/.env`)

```env
PORT=5000
NODE_ENV=development

# Cấu hình Database MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecovera_db
DB_PORT=3306

# Cấu hình JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:3000
```

### Phía Frontend (`Client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Điểm nhấn kỹ thuật chuyên sâu

### 1. Toàn vẹn dữ liệu trong Checkout (ACID Transaction)

Quy trình thanh toán tại `order.service.js` được bọc hoàn toàn bên trong một Transaction cơ sở dữ liệu:

- Truy vấn giá sản phẩm trực tiếp từ DB kèm câu lệnh `SELECT ... FOR UPDATE` để khóa dòng dữ liệu, tránh trường hợp race condition khi nhiều người cùng đặt món hàng cuối cùng.
- Trừ số lượng tồn kho tự động. Nếu bất kỳ sản phẩm nào không đủ tồn kho hoặc có lỗi mạng xảy ra, toàn bộ giao dịch sẽ tự động `ROLLBACK`.

### 2. Cơ chế xử lý lỗi tập trung (Centralized Error Handling)

- Loại bỏ toàn bộ `try/catch` rườm rà ở tầng Controller nhờ wrapper `asyncHandler`.
- Lỗi nghiệp vụ được định danh qua class `AppError` kèm HTTP status code cụ thể.
- `error.middleware.js` tự động giấu stack trace khi môi trường là `production`, đảm bảo an toàn thông tin server.

### 3. Đồng bộ giỏ hàng thông minh (Hybrid Cart Sync)

- Quản lý giỏ hàng phía Client bằng **Zustand**.
- Khách vãng lai có thể thêm sản phẩm mà không cần tạo tài khoản. Khi người dùng đăng nhập thành công, hệ thống tự kích hoạt hàm `syncCartOnLogin`, đồng bộ các sản phẩm đã chọn vào tài khoản người dùng trên Server.

---

## License

Dự án được xây dựng phục vụ mục đích học tập và nghiên cứu (Educational Project). Mọi đóng góp và mã nguồn đều tuân thủ giấy phép mã nguồn mở.
