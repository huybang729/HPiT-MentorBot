# 🤖 HiPT Chatbot

A powerful chatbot platform with a dedicated API and modern user interface. It supports intelligent conversations, is easy to expand, and is suitable for customer support, consultation, or integration with advanced AI on websites.

## 📂 The project structure.

```
chatbot-project/
🔗 vl_api/       # API backend (Node.js)
🔗 e-chatbot/       # UI frontend (Vite)
🔗 README.md
🔗 LICENSE
```

---

## 🚀 Main features.

- 🛹️ The chatbot supports answering academic-related questions for students in the Faculty of Information Technology.
- 🔐 Login/Registration, User Authentication.
- 🌐 Allow chatting without login.
- 📡 Create multiple conversation threads.
- 📁 Edit and delete conversation threads.

---

## ⚙️ Technologies used.

### 📌 **Backend (API)**

- **Language.:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT
- **Database.:** MongoDB
- **Real-time:** WebSocket / Server-Sent Events (SSE)
- **Deployment.:** Local + Ngrok

### 📌 **Frontend (UI)**

- **Framework:** Vite + React
- **API Communication.:** Fetch
- **User Interface.:** Tailwind CSS
- **Realtime:** WebSocket client / EventSource (SSE)

---

## 💻 Installation Guide.

### 1️⃣ Backend Installation. (API)

```bash
cd vl_api
npm install
npm run dev
```

- **Default API URL:** `http://localhost:8000`

---

### 2️⃣ Frontend Installation. (UI)

```bash
cd e-chatbot
npm install
npm run dev
```

- **Default API URL:** `http://localhost:5173`

---

### 3️⃣ Environment Variables. `.env`

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

## 🛡️ Security.

- JWT cho xac thuc API
- CORS bao ve frontend-backend

---

## 📬 Contact.

- Email:(mailto\:huybang729@gmail.com)
- Github:(https://github.com/huybang729/HPiT-MentorBot.git)

---
