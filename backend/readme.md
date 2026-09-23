# 🚀 Node.js Production Ready Starter Template

A scalable, production-ready backend starter template built using Node.js and Express.js.

This template is designed for:

* Hackathons
* Startup MVPs
* Real-world production projects
* Scalable backend systems
* Recruiter portfolio projects

---

# ✨ Features

## Core Features

* Clean MVC Architecture
* REST API Structure
* Environment Configuration
* Authentication & Authorization
* JWT Security
* Role-Based Access Control (RBAC)
* Validation Layer
* Global Error Handling
* Logging System
* API Versioning
* File Upload Support
* Email Service Integration
* Swagger API Documentation
* Docker Support
* Production Security Middleware
* Scalable Folder Structure

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB / PostgreSQL
* Mongoose / Prisma
* JWT Authentication
* Zod Validation
* Cloudinary
* Resend / Nodemailer
* Swagger
* Docker

---

# 📁 Folder Structure

```bash
project-root/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── constants/
│   ├── docs/
│   ├── app.js
│   └── server.js
│
├── uploads/
├── logs/
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# 📦 Install Required Packages

## Core Packages

```bash
npm install express dotenv cors helmet compression morgan
```

---

## Database Packages

### MongoDB

```bash
npm install mongoose
```

### PostgreSQL + Prisma

```bash
npm install prisma @prisma/client
```

---

## Authentication Packages

```bash
npm install jsonwebtoken bcryptjs cookie-parser
```

---

## Validation

```bash
npm install zod
```

---

## File Upload

```bash
npm install multer cloudinary sharp
```

---

## Email Service

### Resend

```bash
npm install resend react react-dom
```

### Nodemailer

```bash
npm install nodemailer
```

---

## Logging

```bash
npm install winston
```

---

## Queue System

```bash
npm install bullmq ioredis
```

---

## Swagger Documentation

```bash
npm install swagger-ui-express swagger-jsdoc
```

---

## Development Dependencies

```bash
npm install --save-dev nodemon jest supertest eslint prettier
```

---

## TypeScript Support

```bash
npm install --save-dev typescript ts-node @types/node @types/express
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

## Example

```env
PORT = 5000

# Environment variables for JWT configuration for authentication and authorization purposes 
JWT_SECRET_KEY=JWT_SECRET_KEY
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
REFRESH_TOKEN_EXPIRE_DAYS=7

# mail configuration 
MAIL_USERNAME=MAIL_USERNAME
MAIL_PASSWORD=MAIL_PASSWORD
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_TLS=True
MAIL_SSL=False

# razorpay configuration 
RAZORPAY_API_KEY = RAZORPAY_API_KEY
RAZORPAY_SECRET_KEY = RAZORPAY_SECRET_KEY

# clodinary confirguration for uploading file 
CLOUDINARY_API_KEY = CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET
CLOUDINARY_CLOUD_NAME = CLOUDINARY_API_SECRET

# sendgrid api key
SENDGRID_API_KEY=SENDGRID_API_KEY
RESEND_API_KEY = RESEND_API_KEY 

# for mongodb atlas url connecting
MONGO_URI = MONGO_URI
```

---

# ▶️ Running the Project

## Development Mode

```bash
npm run dev
```

---

## Production Mode

```bash
npm start
```

---

# 📜 Scripts

Add the following scripts in `package.json`.

```json
"scripts": {
  "dev": "nodemon app/app.js",
  "start": "node app/app.js",
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

---

# 🌍 Loading Environment Variables

## Install dotenv

```bash
npm install dotenv
```

---

## server.js

```javascript
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 🛣️ Route Registration

## routes/index.js

```javascript
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");

const registerRoutes = (app) => {

    app.use("/api/v1/users", userRoutes);

    app.use("/api/v1/auth", authRoutes);
};

module.exports = registerRoutes;
```

---

## app.js

```javascript
const express = require("express");
const registerRoutes = require("./routes");

const app = express();

app.use(express.json());

registerRoutes(app);

module.exports = app;
```

---

# 🛡️ Security Middleware

## Recommended Middleware

```javascript
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
```

---

# 🔑 JWT Authentication Example

```javascript
const jwt = require("jsonwebtoken");

const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
```

---

# 📤 File Upload Example

## Install Multer

```bash
npm install multer
```

---

## upload.middleware.js

```javascript
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
```

---

# 📧 Email Integration

## Resend Example

```javascript
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
```

---

# 📘 Swagger Documentation

## Swagger Setup

```javascript
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
```

---

# 🐳 Docker Setup

## Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

---

## docker-compose.yml

```yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
```

---

# 🚫 .gitignore

Create a `.gitignore` file.

```gitignore
node_modules/
.env
```

---

# 📈 Recommended Architecture

```text
Routes → Controllers → Services → Database
```
---

# 📚 API Structure Example

## Authentication APIs

* POST /api/v1/auth/register
* POST /api/v1/auth/login
* POST /api/v1/auth/logout
* POST /api/v1/auth/forgot-password
* POST /api/v1/auth/reset-password

---

## User APIs

* GET /api/v1/users/profile
* PUT /api/v1/users/profile
* DELETE /api/v1/users/profile

---

# 🧪 Testing

## Run Tests

```bash
npm test
```

---

# 🚀 Deployment

## Recommended Platforms

### Beginner Friendly

* Render
* Railway
* Vercel

### Production Deployment

* AWS EC2
* AWS ECS
* DigitalOcean
* Google Cloud

---

# ✅ Production Checklist

Before deployment, ensure:

* Environment variables configured
* JWT secret added
* Database connected
* Logging enabled
* Error handling configured
* Validation added
* Security middleware enabled
* Docker tested
* Swagger docs working
* API rate limiting enabled

---

# 📄 License

This project is open-source and free to use.

---
