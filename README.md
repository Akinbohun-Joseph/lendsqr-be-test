Demo Credit Wallet API

A modular, scalable backend API built for a fintech wallet system. It supports secure user onboarding (with blacklist checks), wallet creation, funding, withdrawal, transfers, and transaction history, with full Postman and Swagger documentation.

🎯 Project Goal

To build a production-ready backend system that can:

Register and verify users (including blacklist compliance)

Create wallet accounts on registration

Perform wallet transactions: fund, withdraw, transfer

Track transaction history and balances

Be modular and scalable enough to add credit scoring, analytics, etc.

⚙️ Tech Stack

Area

Technology

Purpose

Language

Node.js + TypeScript

Type-safe server runtime

Framework

Express.js

Lightweight backend framework

DB

MySQL (Docker + Ngrok)

Persistent relational storage

Query Builder

Knex.js + mysql2

SQL builder with migrations

Auth

JWT

Secure stateless authentication

Container

Docker

Environment isolation, DB management

Tunnel

Ngrok

Expose Dockerized MySQL for remote access

Docs

Swagger + Postman

API documentation and test collections

Dev Tools

Git, GitHub, Postman

Version control and testing

📁 Folder Structure

/src
├── controllers/       # Route logic
├── routes/            # API endpoints
├── services/          # Business rules (wallet, user, blacklist)
├── middleware/        # JWT auth, validation
├── db/                # Knex config, migrations, seeds
├── utils/             # Logger, async handlers, etc
├── types/             # TypeScript interfaces
└── server.ts          # Entry point

🔐 Authentication

All protected routes require JWT:

Authorization: Bearer <your_token_here>

JWT is returned on successful login.

📬 API Endpoints

👤 Auth & User

Method

Endpoint

Description

POST

/api/user/register

Register a new user

POST

/api/user/login

Authenticate user

GET

/api/user/profile

Get user profile

PUT

/api/user/profile

Update user profile

💰 Wallet

Method

Endpoint

Description

GET

/api/wallet/balance

View wallet balance

POST

/api/wallet/fund

Fund wallet

POST

/api/wallet/withdraw

Withdraw from wallet

POST

/api/wallet/transfer

Transfer to another wallet

GET

/api/wallet/transactions

Transaction history

All wallet routes require authentication.

🧪 Postman Testing

All endpoints are grouped in a [Demo Wallet API Postman Collection]

Base URL: http://localhost:3000

Swagger Docs: http://localhost:3000/api-docs

⚙️ Example Test Flow (in Postman):

Register a user → Copy returned token

Login → Receive JWT

Set token as Bearer Authorization in Postman

Test Wallet Endpoints:

/wallet/fund

/wallet/balance

/wallet/transfer

/wallet/withdraw

/wallet/transactions

✅ Each request includes Authorization: Bearer <token> in headers

🐳 Docker + Ngrok Setup

# Start MySQL container
docker-compose up -d

# Open Ngrok tunnel
ngrok tcp 3306

# Update .env with Ngrok values:
DB_HOST=5.tcp.ngrok.io
DB_PORT=<forwarded_port>

🧱 Key Design Decisions

Decision

Reason

Monolithic

Simple MVP, quick testing and development

Knex over Sequelize

Better query control, easier debugging

Docker for DB

No local MySQL conflicts, reproducibility

Ngrok

Enables external access to containerized DB

Blacklist API (mock)

Simulates real-time compliance checks

🚦 Running the Project

# 1. Install dependencies
npm install

# 2. Set up your .env file (see .env.example)

# 3. Start dev server
npx tsx src/server.ts

# 4. Run DB migrations
npx knex migrate:latest --knexfile src/db/knexfile.ts

# 5. Seed DB (optional)
npx knex seed:run --knexfile src/db/knexfile.ts

👤 Author

Akinbohun Opeyemi JosephBackend Developer | GitHub: @Akinbohun-Joseph

📄 License

Licensed under the MIT License.
