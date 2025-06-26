# 🤖 HiPT Chatbot

Mot nen tang chatbot manh me voi API rieng va giao dien nguoi dung hien dai. Ho tro tro chuyen thong minh, de dang mo rong, phu hop cho website ho tro khach hang, tu van, hoac tich hop AI nang cao.

## 📂 Cau truc du an

```
chatbot-project/
🔗 vl_api/       # API backend (Node.js)
🔗 e-chatbot/       # UI frontend (Vite)
🔗 README.md
🔗 LICENSE
```

---

## 🚀 Tính năng chính

- 🛹️ Chatbot hỗ trợ giải đáp thắc mắc về học vụ cho sinh viên khoa Công nghệ Thông tin
- 🔐 Đăng nhập/Đăng ký, xác thực người dùng
- 🌐 Cho phép chat mà không đăng nhập
- 📡 Tạo nhiều đoạn hội thoại
- 📁 Chỉnh sửa và xoá đoạn hội thoại

---

## ⚙️ Công nghệ sử dụng

### 📌 **Backend (API)**

- **Ngôn ngữ:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT
- **Cơ sở dữ liệu:** MongoDB
- **Real-time:** WebSocket / Server-Sent Events (SSE)
- **Triển khai:** Local + Ngrok

### 📌 **Frontend (UI)**

- **Framework:** Vite + React
- **Giao tiếp API:** Fetch
- **Giao diện:** Tailwind CSS
- **Realtime:** WebSocket client / EventSource (SSE)

---

## 💻 Hướng dẫn cài đặt

### 1️⃣ Cài đặt Backend (API)

```bash
cd vl_api
npm install
npm run dev
```

- **URL mặc định của API:** `http://localhost:8000`

---

### 2️⃣ Cài đặt Frontend (UI)

```bash
cd e-chatbot
npm install
npm run dev
```

- **URL mặc định của API:** `http://localhost:5173`

---

### 3️⃣ Biến môi trường `.env`

#### Backend (`vl_api/.env`)

```
DATABASE_URL=
SECRET_KEY=
```

#### Frontend (`e-chatbot/.env`)

```
VITE_API_BASE_URL=
```

---

### 🗨️ Conversation APIs

| Method  | Endpoint                            | Description                                      |
|---------|-------------------------------------|-------------------------------------------------|
| `POST`  | `/v1/conversations/`                | Create a new conversation                        |
| `GET`   | `/v1/conversations/`                | Retrieve a list of conversations                 |
| `GET`   | `/v1/conversations/:id/listen`      | Listen for events (when the bot replies)         |
| `PUT`   | `/v1/conversations/:id/rename`      | Rename a conversation                            |
| `DELETE`| `/v1/conversations/:id`             | Delete a conversation                            |

---

### ✉️ Message APIs

| Method  | Endpoint                  | Description                           |
|---------|---------------------------|---------------------------------------|
| `POST`  | `/v1/messages/`           | Create a new message                  |
| `GET`   | `/v1/messages/:id`        | Retrieve messages in a conversation   |
| `DELETE`| `/v1/messages/`           | Delete a message                      |

---

### 👤 User APIs

| Method  | Endpoint                | Description                          |
|---------|-------------------------|--------------------------------------|
| `POST`  | `/v1/users/register`    | Register a new user                  |
| `POST`  | `/v1/users/login`       | Login with an existing account       |
| `POST`  | `/v1/users/guest`       | Login as guest (without an account)  |


---

## 🛡️ Bao mat

- JWT cho xac thuc API
- CORS bao ve frontend-backend

---

## 📬 Lien he

- Email:(mailto\:huybang729@gmail.com)
- Github:(https://github.com/huybang729/HPiT-MentorBot.git)

---
