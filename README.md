# MERN Mobile Recharge Simulator

A production-grade MERN stack web application that simulates a mobile recharge platform for Indian telecom operators. The project demonstrates full-stack engineering practices including API design, state management, validation, and business logic without real payment integrations.

## 🚀 Features

- Operator catalogue with rich plan data for Airtel, Jio, Vi, and BSNL
- Recharge workflow with duplicate prevention and status simulation (70% success / 20% failed / 10% pending)
- Pending auto-resolution between 15–45 seconds with improved retry success rates
- Transaction history with filtering, pagination, and CSV export
- Detailed status page with polling, retry flow, and failure reason display
- Responsive, polished UI with React Router navigation

## 🏗 Technology Stack

| Layer     | Technologies |
|-----------|-------------|
| Frontend  | React 18, React Router, Axios |
| Backend   | Node.js, Express, Mongoose, express-validator |
| Database  | MongoDB (Atlas or local) |
| Tooling   | dotenv, cors, helmet, morgan, nodemon |

## 📁 Project Structure

```
mern-recharge-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- MongoDB connection string (Atlas or local)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env        # Update values as needed
npm run seed                # Seed operator & plan data
npm run dev                 # Starts Express server on http://localhost:5000
```

#### Backend Environment Variables (`backend/.env.example`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recharge_app
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env        # Optional: update API base URL
npm start                   # Starts React app on http://localhost:3000
```

#### Frontend Environment Variables (`frontend/.env.example`)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing Scenarios

1. **Happy Path** – Valid recharge leading to success
2. **Duplicate Prevention** – Attempt same number & plan within 2 minutes
3. **Failure Handling** – Observe failure reason and retry flow
4. **Pending Resolution** – Wait for auto-resolution of pending status
5. **History Filters** – Filter by status, number, transaction ID, and date range

## 📓 API Overview

Key endpoints include:

- `GET /api/operators` – List operators
- `GET /api/operators/:code/plans` – Fetch plans for operator
- `POST /api/recharge` – Initiate recharge with validation & simulation
- `GET /api/recharge/:transactionId` – Track transaction status
- `GET /api/recharge/history` – Paginated history with filters
- `POST /api/recharge/retry/:transactionId` – Retry failed recharge

Refer to inline controller JSDoc comments for detailed payloads.

## 🧠 Interview Talking Points

- Discuss idempotency with transaction IDs & duplicate detection window
- Explain status simulation percentages and retry bias
- Outline scaling considerations (queue workers for pending resolution, caching)
- Suggest enhancements (auth, payment gateways, notifications)

## 📸 Screenshots

Add your own screenshots in `frontend/public/` and link them here once captured.

## 🪪 License

MIT License
