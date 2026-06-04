# Cvio API

Cvio API is a RESTful authentication and user management service built with Node.js, Express, MongoDB, Redis, and JWT.  
It provides secure authentication using access and refresh tokens, user profile management, session handling, and token revocation capabilities.

## Features

- User registration
- User login
- JWT access tokens
- JWT refresh tokens
- Refresh token rotation
- Single-device logout
- Logout from all devices
- Protected routes
- User profile retrieval
- User profile update
- Soft account deletion
- Redis-backed session storage
- MongoDB persistence
- Request validation with Yup
- Structured logging
- Centralized error handling
- Correlation ID request tracking

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Cache & Session Store

- Redis Cloud
- ioredis

### Authentication

- JWT
- bcryptjs

### Validation

- Yup

### Security

- Helmet
- HTTP-only cookies
- JWT rotation

### Logging

- Winston

## Architecture

The application follows a layered architecture:

Routes
→ Controllers
→ Services
→ Models

Supporting layers include:

- Validation
- Authentication middleware
- Error handling
- Logging
- Database configuration
- Redis configuration

Folder structure:

```raw
src/
├── api/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── utils/
├── config/
└── models/
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000

DATABASE_URI=

PASSWORD_HASH_SALT=10

SERVICE=cvio-api

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES=15m

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES=7d

REDIS_CLOUD_URL=
```

## Running Locally

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Endpoints

### Authentication

POST /v1/auth/register

POST /v1/auth/login

POST /v1/auth/refresh

POST /v1/auth/logout

POST /v1/auth/logout-all

### Users

GET /v1/users/me

PATCH /v1/users/me

DELETE /v1/users/me

## Authentication Flow

1. User logs in.
2. API returns an access token.
3. Refresh token is stored in an HTTP-only cookie.
4. Access token is sent in the Authorization header.
5. When the access token expires, the client calls `/auth/refresh`.
6. A new access token and refresh token are issued.
7. Previous refresh token is revoked.
8. Logout revokes the current refresh token.
9. Logout-all increments tokenVersion and invalidates all sessions.

## Example

POST /v1/auth/login

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "success": true,
  "message": "User logged in",
  "token": "...",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Deployment

The API is deployed on Render.

Services used:

- Render
- MongoDB Atlas
- Redis Cloud

Live URL: https://cvio-api.onrender.com

## Future Improvements

- Email verification
- Password reset
- Role-based authorization
- Rate limiting
- API documentation with Swagger
- User activity tracking
- Refresh token family tracking

## Author

Henry Amponsah

GitHub:
https://github.com/toqnoe
