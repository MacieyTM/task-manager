# Task Manager API

A production-oriented Task Manager REST API built with Node.js and PostgreSQL.

This project was created as a backend learning project focused on understanding how Node.js applications work under the hood, without relying on Express.js or other backend frameworks.

The application gradually evolves from a simple HTTP server into a structured backend service with authentication, authorization, PostgreSQL persistence, automated tests, Docker support, event-driven components, streams, rate limiting, and production-oriented configuration.

---

## 🚀 Features

- REST API built with native Node.js HTTP server
- Layered backend architecture
- PostgreSQL database
- CRUD operations for tasks
- User management
- User registration and authentication
- Password hashing using Node.js `crypto.scrypt`
- JWT-based authentication
- Authorization and resource ownership
- Request validation
- Centralized error handling
- CORS support
- Security headers
- Rate limiting
- Request ID tracking
- Structured JSON responses
- Event-driven architecture using `EventEmitter`
- Node.js streams for task export
- Automated tests using Node.js built-in test runner
- Docker and Docker Compose support
- Environment-based configuration
- Graceful application shutdown
- Health check endpoint

---

## 🏗️ Architecture

The application follows a layered architecture:

```text
Client
  │
  ▼
HTTP Server
  │
  ▼
Router
  │
  ├── Authentication
  │
  ├── Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
PostgreSQL
```

The project is currently structured as a **modular monolith**.

Different responsibilities are separated into independent modules while the application still runs as a single Node.js process.

This structure provides a foundation for later evolving the application toward a microservices architecture.

---

## 📁 Project Structure

```text
task-manager/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── events/
│   │   ├── eventBus.js
│   │   ├── index.js
│   │   └── taskEvents.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── corsMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   ├── middleware.js
│   │   ├── rateLimitMiddleware.js
│   │   ├── requestIdMiddleware.js
│   │   └── securityHeadersMiddleware.js
│   │
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_tasks.sql
│   │   └── 003_add_password_to_users.sql
│   │
│   ├── repositories/
│   │   ├── taskRepository.js
│   │   └── userRepository.js
│   │
│   ├── services/
│   │   ├── taskService.js
│   │   └── userService.js
│   │
│   ├── streams/
│   │   ├── streamUtils.js
│   │   └── taskExportStream.js
│   │
│   ├── utils/
│   │   ├── databaseError.js
│   │   ├── delay.js
│   │   ├── errors.js
│   │   ├── http.js
│   │   ├── password.js
│   │   ├── request.js
│   │   └── token.js
│   │
│   ├── validators/
│   │   ├── taskValidator.js
│   │   └── userValidator.js
│   │
│   ├── app.js
│   ├── config.js
│   ├── database.js
│   ├── router.js
│   ├── server.js
│   └── shutdown.js
│
├── tests/
│   ├── auth.test.js
│   ├── events.test.js
│   ├── health.test.js
│   ├── middleware.test.js
│   ├── request.test.js
│   ├── stream.test.js
│   ├── utils.test.js
│   └── validators.test.js
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── package-lock.json
```

---

## 🛠️ Tech Stack

### Backend

- Node.js
- JavaScript
- Native Node.js HTTP server
- REST API
- PostgreSQL

### Authentication & Security

- JWT
- `crypto.scrypt`
- Password hashing
- Authorization
- CORS
- Security headers
- Rate limiting
- Request IDs

### Architecture

- Controllers
- Services
- Repositories
- Validators
- Middleware
- Event-driven components
- Streams

### Testing

- Node.js built-in test runner
- `node:assert`

### DevOps

- Docker
- Docker Compose
- Environment-based configuration

---

## 🔐 Authentication

The API uses JWT-based authentication.

Authentication flow:

```text
Register
   │
   ▼
Password hashing
   │
   ▼
PostgreSQL
   │
   ▼
Login
   │
   ▼
JWT
   │
   ▼
Authorization: Bearer <token>
   │
   ▼
Protected endpoints
```

Passwords are never stored as plain text.

Password hashing is implemented using Node.js `crypto.scrypt` with a randomly generated salt.

JWT tokens contain the authenticated user's ID and an expiration time.

---

## 🔑 Authorization

Tasks belong to users.

The authenticated user's ID is taken from the JWT rather than from the request body.

For example:

```http
POST /tasks
Authorization: Bearer <token>
```

The server determines the task owner from the authenticated user.

This prevents clients from creating or modifying resources on behalf of another user simply by changing a `userId` field in the request.

Task queries also enforce ownership at the repository/database level.

---

## 📡 API Endpoints

### Health

```http
GET /health
```

Returns the current API health status.

---

### Authentication

#### Register

```http
POST /auth/register
```

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /auth/login
```

Example:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns an authentication token.

---

### Current User

```http
GET /me
```

Requires authentication.

---

### Tasks

#### Get tasks

```http
GET /tasks
```

Supports filtering and searching.

Examples:

```text
GET /tasks
GET /tasks?completed=true
GET /tasks?completed=false
GET /tasks?search=node
```

#### Get task

```http
GET /tasks/:id
```

#### Create task

```http
POST /tasks
```

Example:

```json
{
  "title": "Learn Node.js",
  "description": "Study backend development"
}
```

#### Update task

```http
PATCH /tasks/:id
```

Example:

```json
{
  "completed": true
}
```

#### Delete task

```http
DELETE /tasks/:id
```

#### Task statistics

```http
GET /tasks/statistics
```

#### Export tasks

```http
GET /tasks/export
```

The export functionality uses Node.js streams instead of loading the entire dataset into memory at once.

---

### Users

```http
GET /users
GET /users/:id
```

User endpoints require authentication.

---

## ⚡ Event-Driven Components

The project uses Node.js `EventEmitter` to demonstrate event-driven architecture.

Task lifecycle events include:

```text
task.created
task.updated
task.deleted
```

Example:

```text
Task Service
     │
     ▼
Event Bus
     │
     ├── task.created
     ├── task.updated
     └── task.deleted
```

This creates loose coupling between the operation that produces an event and the components that react to it.

The event-based structure also provides a foundation for later introducing external message brokers when the architecture requires them.

---

## 🌊 Streams

Task export functionality uses Node.js streams.

Instead of building a potentially large response entirely in memory:

```text
Database
   │
   ▼
Readable Stream
   │
   ▼
Transform
   │
   ▼
HTTP Response
```

This demonstrates how Node.js can process large amounts of data incrementally.

---

## 🧪 Testing

Tests use the Node.js built-in test runner.

Run:

```bash
npm test
```

The test suite covers areas including:

- authentication
- health endpoint
- middleware
- request handling
- validation
- streams
- events
- utilities

---

## 🐳 Running with Docker

The project includes Docker and Docker Compose configuration.

Start the complete application:

```bash
docker compose up --build
```

The environment contains:

```text
Node.js API
     │
     ▼
PostgreSQL
```

Stop the containers:

```bash
docker compose down
```

---

## 💻 Running Locally

### Requirements

- Node.js
- npm
- PostgreSQL

Clone the repository:

```bash
git clone https://github.com/MacieyTM/task-manager.git
cd task-manager
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the database and application variables in `.env`.

Start the application:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

## ⚙️ Environment Variables

Configuration is provided through environment variables.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret

CORS_ORIGIN=http://localhost:4200
```

Secrets and local environment files are intentionally excluded from Git using `.gitignore`.

The repository contains `.env.example` as a safe configuration template.

---

## 🗄️ Database

The application uses PostgreSQL.

Main entities:

```text
users
  │
  │ 1:N
  ▼
tasks
```

A task belongs to a user through:

```text
tasks.user_id → users.id
```

Database migrations are stored in:

```text
src/migrations/
```

---

## 🛡️ Production-Oriented Features

The project includes several features commonly required by backend services:

- environment-based configuration
- validation
- centralized error handling
- structured API responses
- authentication
- authorization
- password hashing
- rate limiting
- CORS configuration
- security headers
- request ID generation
- graceful shutdown
- database connection management
- Docker support
- automated tests

The goal is to make the application behave more like a real backend service rather than a simple CRUD demo.

---

## 📈 Learning Roadmap

The project is being developed incrementally to explore backend engineering concepts.

### Completed

- Node.js fundamentals
- HTTP server
- routing
- request/response handling
- JSON request bodies
- CRUD
- asynchronous programming
- filesystem operations
- PostgreSQL
- service/repository architecture
- validation
- error handling
- authentication
- middleware
- events
- streams
- testing
- production-oriented Node.js
- Docker

### Planned

```text
Current
  │
  ▼
Modular Monolith
  │
  ▼
TypeScript
  │
  ▼
Microservices
  │
  ▼
CI/CD
  │
  ▼
Kubernetes
```

The architecture is intentionally being evolved step by step instead of introducing technologies without a practical reason.

---

## 🎯 Project Goals

The main goals of this project are:

1. Understand Node.js beyond framework abstractions.
2. Learn how backend applications are structured internally.
3. Build secure REST APIs.
4. Work with PostgreSQL from Node.js.
5. Understand authentication and authorization.
6. Learn event-driven and stream-based programming.
7. Write automated backend tests.
8. Containerize the application.
9. Understand modular monolith architecture.
10. Gradually evolve the system toward distributed backend architecture.

---

## 📄 License

This project is intended primarily as a learning and portfolio project.
