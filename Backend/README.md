# Blood Bond Backend API

Backend API for the Blood Bond blood donation platform built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT-based)
- User profile management
- Donor registration and management
- Blood request creation and management
- Blood camp management (Admin)
- Donation history tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blood-bond
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Donors
- `POST /api/donors/register` - Register as a blood donor
- `GET /api/donors/eligibility/:userId` - Check donation eligibility
- `GET /api/donors/find?bloodType=A+&pincode=123456` - Find available donors
- `DELETE /api/donors/cancel/:userId` - Cancel donor registration

### Blood Requests
- `POST /api/blood-requests` - Create a blood request
- `GET /api/blood-requests/user/:userId` - Get user's blood requests
- `GET /api/blood-requests/:requestId` - Get a specific blood request
- `PUT /api/blood-requests/:requestId/status` - Update request status
- `DELETE /api/blood-requests/:requestId` - Delete a blood request

### Blood Camps (Admin)
- `POST /api/blood-camps` - Create a blood camp (Admin only)
- `GET /api/blood-camps?state=State&district=District` - Get blood camps
- `GET /api/blood-camps/:campId` - Get a specific blood camp
- `PUT /api/blood-camps/:campId` - Update a blood camp (Admin only)
- `DELETE /api/blood-camps/:campId` - Delete a blood camp (Admin only)

### Donations
- `POST /api/donations` - Record a donation
- `GET /api/donations/user/:userId` - Get donation history

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Models

- **User**: User accounts and profiles
- **Donor**: Donor registration information
- **BloodRequest**: Blood requests from users
- **BloodCamp**: Blood donation camps
- **Donation**: Donation history records

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

## Development

The server uses:
- Express.js for routing
- MongoDB with Mongoose for database
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## License

ISC

