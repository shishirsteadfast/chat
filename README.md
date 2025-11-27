# ChatVault

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.18+-orange.svg)](https://expressjs.com)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.35+-purple.svg)](https://sequelize.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7+-red.svg)](https://socket.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A secure, multi-tenant **real-time chat service** with a sleek admin panel. Built with **Express.js + TypeScript + Sequelize (MySQL) + Socket.io WebSockets**. Manage isolated chat projects via API keys, handle user conversations, and emit messages in real-time—all from a dark-themed dashboard.

Perfect for SaaS chat integrations, team collaboration backends, or custom messaging apps. Admins create projects, clients integrate via API, and chats flow seamlessly.

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MySQL 8.0+ (with a database ready)
- Git

### Installation
1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd chat-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see `.env.example`):
   Copy `.env.example` to `.env` and fill in your values:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=chat_vault
   DB_USER=root
   DB_PASS=your_mysql_password

   SESSION_SECRET=your_super_secret_key
   APP_URL=http://localhost:3000

   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   MAIL_FROM=admin@chatvault.com
   ```

4. Database Setup:
   - Create your MySQL database: `CREATE DATABASE chat_vault;`
   - Run migrations (if using; models are sync-free for production):
     ```bash
     npx sequelize-cli db:migrate  # Optional: Add migrations if needed
     ```
   - Seed initial admin:
     ```bash
     npm run seed:admin  # Runs src/seeder/create-admin.ts
     ```
     Default: Email `admin@example.com`, Password `password`.

5. Start the server:
   ```bash
   npm run dev  # For development (nodemon)
   # or
   npm start    # For production
   ```

   Server runs on `http://localhost:3000`. Access admin at `/admin/login`.

## ✨ Features

- **Admin Panel**:
  - Secure login/logout with session auth.
  - Password reset via email (Nodemailer).
  - CRUD for **Projects**: Create/manage isolated chat instances with auto-generated API keys.
  - Dark, responsive UI (EJS + Custom CSS).

- **Multi-Tenant Chat API**:
  - **API Key Auth**: Per-project isolation—clients use unique keys.
  - **Users**: Upsert users per project (`POST /api/users`).
  - **Conversations**: Create/list group chats (`POST/GET /api/conversations`).
  - **Messages**: Send/list with real-time WebSocket emission (`POST/GET /api/conversations/:id/messages`).

- **Real-Time WebSockets (Socket.io)**:
  - Join conversations dynamically.
  - Broadcast new messages to participants instantly.

- **Security & Utils**:
  - Bcrypt password hashing.
  - Crypto-generated tokens (API keys, reset tokens).
  - CORS enabled; health check at `/health`.

- **Production-Ready**:
  - TypeScript for type safety.
  - Sequelize ORM (no auto-sync for prod).
  - Modular routes/controllers.

## 🏗️ Architecture Overview

```
src/
├── app.ts              # Express setup, middleware, routes
├── server.ts           # HTTP + Socket.io server
├── config/             # DB (Sequelize), Env
├── controllers/        # Business logic (AdminAuth, Projects, Chat ops)
├── middlewares/        # Auth (admin sessions, API keys)
├── models/             # Sequelize: Admin, Project, User, Conversation, Message, etc.
├── routes/             # Admin (auth/projects), API (users/conversations/messages)
├── sockets/            # chatSocket.ts: WebSocket handlers
├── utils/              # Mailer, Password hash, Tokens
├── views/              # EJS: Layouts, Auth pages, Project forms/list
└── public/assets/      # CSS (dark theme)
```

- **Data Flow**: Admin → Project API Key → Client API Calls → WebSocket Broadcast.
- **DB Schema**: Relational MySQL—Projects own Users/Conversations; Tokens for resets.

## 📖 Usage

### Admin Panel
1. Login at `/admin/login`.
2. Navigate to `/admin/projects` to create/edit/delete projects.
3. Each project gets a unique API key—share with clients for their chat integrations.

### Chat API (Authenticated via `X-API-Key` header)
- Base: `/api`
- **Users**: `POST /api/users` (upsert per project; auto-generates `external_id` if omitted).
  ```json
  {
    "external_id": 3213212,
    "display_name": "Done de"
  }
  ```
  Response: `{ "id": 1, "external_id": "generated-uuid-or-provided", "display_name": "Done de" }`.

- **Conversations**:
  - `POST /api/conversations` (create with participants).
    ```json
    {
      "participant_project_user_ids": [1, 2],
      "title": "test conversation"
    }
    ```
    Response: `{ "id": 1, "title": "test conversation", "participantIds": [1, 2] }`.
  - `GET /api/conversations` (list user's conversations; returns array of convos tied to the authenticated project user).
    - No body required.
    - Response: `[{ "id": 1, "title": "test conversation", "participant_project_user_ids": [1, 2], "created_at": "..." }, ...]`.
    - Example cURL:
      ```bash
      curl -H "X-API-Key: your_project_key" \
           http://localhost:3000/api/conversations
      ```

- **Messages**:
  - `POST /api/conversations/:id/messages` (send with sender ID).
    ```json
    {
      "project_user_id": 1,
      "content": "Hello"
    }
    ```
    Response: `{ "id": 1, "project_user_id": 1, "content": "Hello", "created_at": "..." }`.
  - `GET /api/conversations/:id/messages` (list messages for a conversation; paginated if query params added).
    - No body required.
    - Response: `[{ "id": 1, "project_user_id": 1, "content": "Hello", "created_at": "..." }, ...]`.
    - Example cURL:
      ```bash
      curl -H "X-API-Key: your_project_key" \
           http://localhost:3000/api/conversations/1/messages
      ```

- **WebSocket**: Connect to `/socket.io`, emit `conversation:join { conversationId: 1 }`, receive `message:new`.

Example cURL (with API key):
```bash
curl -H "X-API-Key: your_project_key" \
     -H "Content-Type: application/json" \
     -d '{"project_user_id":1,"content":"Hi team!"}' \
     http://localhost:3000/api/conversations/1/messages
```

## 🔧 Environment Variables

| Var | Description | Default |
|-----|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_*` | MySQL connection (HOST, PORT, NAME, USER, PASS) | - |
| `SESSION_SECRET` | Session encryption | - |
| `APP_URL` | Base URL for reset links | http://localhost:3000 |
| `MAIL_*` | Nodemailer (HOST, PORT, USER, PASS, FROM) | - |

## 🚀 Deployment

- **Docker**: Add a `Dockerfile` for easy containerization.
- **PM2/ systemd**: For process management.
- **Heroku/Vercel**: Works with buildpack for Node/TS.
- **DB**: Use managed MySQL (RDS, PlanetScale).
- **Emails**: Configure SMTP (Gmail, SendGrid).
- **WebSockets**: Ensure proxy (Nginx) forwards WS upgrades.

Run `npm run build` (add to package.json for TS transpile if needed).

## 🐛 Troubleshooting

- **DB Connection**: Check `DB_*` vars; run `sequelize.authenticate()`.
- **Sessions**: Ensure Redis if scaling (default in-memory).
- **Sockets**: CORS allows `*`; test with Socket.io client.
- **Emails**: Verify SMTP creds; test with `nodemailer` CLI.

## 🤝 Contributing

1. Fork & PR.
2. Run `npm run lint` (add ESLint if desired).
3. Tests: Add Jest suite for controllers (future).

## 📄 License

MIT © 2025 [Your Name]. See [LICENSE](LICENSE).

---

⭐ **Star on GitHub** if this powers your next chat app! Questions? Open an issue.