# 💰 Demo Wallet Backend API

A scalable backend system for a demo fintech wallet app, built with Node.js, TypeScript, MySQL, and Docker. It handles user onboarding with blacklist verification, KYC-like flows, and wallet transactions.

---

## 📦 Tech Stack

| Area         | Stack                       |
|--------------|-----------------------------|
| Language     | Node.js + TypeScript        |
| Framework    | Express.js                  |
| DB           | MySQL (Dockerized)          |
| ORM          | Knex.js                     |
| Auth         | JWT                         |
| Container    | Docker                      |
| Dev Tools    | Postman, Git, GitHub        |

---

## 🚀 Features

- ✅ **User Registration** with blacklist verification
- ✅ **Authentication** via JWT
- ✅ **Wallet Creation** on registration
- ✅ **Fund Wallet** (via virtual endpoint)
- ✅ **Transfer Funds** to other users
- ✅ **Transaction History** tracking
- ✅ **Dockerized MySQL Database**
- ✅ **Environment Variables** for config

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/Akinbohun-Joseph/lendsqr-be-test.git
cd lendsqr-be-test
2. Install Dependencies
bash
Copy
Edit
npm install
3. Environment Setup
Create a .env file using the .env.example provided:

env
Copy
Edit
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=projectuser
DB_PASSWORD=projectpass
DB_NAME=project_db
JWT_SECRET=your_jwt_secret
4. Start MySQL via Docker
bash
Copy
Edit
docker run --name project-mysql -e MYSQL_ROOT_PASSWORD=myStrongRootPass -e MYSQL_USER=projectuser -e MYSQL_PASSWORD=projectpass -e MYSQL_DATABASE=project_db -p 3306:3306 -v mysql_data:/var/lib/mysql -d mysql:8
5. Run Migrations
bash
Copy
Edit
npx knex migrate:latest --knexfile knexfile.ts --esm
6. Start the App
bash
Copy
Edit
npm run dev
🗂 Project Structure
bash
Copy
Edit
src/
│
├── controllers/       # Route handlers
├── services/          # Business logic
├── models/            # Knex queries and schema
├── routes/            # Express route declarations
├── middleware/        # Auth, validation, error handling
├── config/            # DB connection, env config
├── utils/             # Helpers
└── server.ts          # Entry point
📬 API Endpoints
Method	Endpoint	Description	Auth
POST	/api/register	Register new user	❌
POST	/api/login	Login user	❌
GET	/api/wallet	Get user wallet	✅
POST	/api/wallet/fund	Add funds to wallet	✅
POST	/api/wallet/transfer	Transfer funds to user	✅
GET	/api/transactions	View transaction history	✅

✅ = Requires JWT token in Authorization header.

📌 Key Decisions & Notes
Monolithic Design: Simpler for MVP, easy to maintain and refactor later.

Dockerized MySQL: Ensures dev consistency across machines.

Knex over ORM: Gives control over SQL and schema.

Custom Blacklist API: Used due to inability to access the Karma Blacklist API, ensuring realistic KYC simulation.

🧪 Testing
{
  "info": {
    "_postman_id": "1a234567-b89c-40d0-aaa0-postmandemo",
    "name": "Demo Wallet API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"pass1234\",\n  \"name\": \"Demo User\"\n}"
        },
        "url": {
          "raw": "http://localhost:4000/api/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"pass1234\"\n}"
        },
        "url": {
          "raw": "http://localhost:4000/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "login"]
        }
      }
    },
    {
      "name": "Get Wallet (Protected)",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": {
          "raw": "http://localhost:4000/api/wallet",
          "protocol": "http",
          "host": ["localhost"],
          "port": "4000",
          "path": ["api", "wallet"]
        }
      }
    },

📄 License
This project is licensed under the MIT License.

🤝 Author
Akinbohun Opeyemi Joseph

GitHub: @Akinbohun-Joseph

LinkedIn: @akinbohun-opeyemi
