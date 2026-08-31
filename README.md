
# Find My Study Buddy

A full-stack web application that helps students discover compatible study partners based on their academic profile, subjects, study preferences, and location. The platform supports secure authentication, buddy requests, real-time messaging, online status tracking, and message delivery/read status.

## Features

### Authentication

- User registration
- Secure user login
- JWT-based authentication
- Protected API routes
- Logout functionality
- User session stored on the frontend

### User Profile

Users can manage their academic and personal study preferences, including:

- Full name
- College
- Course
- Year
- Bio
- Subjects
- Study mode
- Location

### Find Study Buddies

Users can search for potential study partners using filters such as:

- Subject
- College
- Course
- Year
- Study mode
- Location

The search results automatically exclude the currently logged-in user.

### Buddy System

- Send buddy requests
- View received buddy requests
- Accept buddy requests
- View study buddy list
- Restrict messaging to accepted study buddies

### Real-Time Chat

The application uses Socket.IO for real-time communication.

Implemented features include:

- Real-time messaging
- Online user tracking
- Online/offline events
- Buddy-only messaging
- Message persistence using MongoDB

### Message Status

Messages support three states:

- Sent
- Delivered
- Read

Real-time Socket.IO events update message delivery and read status.

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.IO
- bcryptjs
- dotenv
- cookie-parser
- CORS

## Project Structure

```text
find-my-study-buddy/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── FindBuddies.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── buddyController.js
│   │   └── chatController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── BuddyRequest.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── buddyRoutes.js
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   ├── buddyService.js
│   │   └── chatService.js
│   │
│   ├── sockets/
│   │   └── socket.js
│   │
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md
