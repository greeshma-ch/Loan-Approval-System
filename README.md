# 💼 CREDO — Loan Approval System

A full-stack application that integrates a C++ decision engine with a modern web stack to evaluate loan applications in real time.

🌐 **Live Demo:** https://loan-approval-system-gules.vercel.app
🔗 **Backend API:** https://credo-backend-725u.onrender.com

---

## 🧠 What this project does

CREDO lets users submit loan applications and get an approval decision based on a scoring algorithm.

The interesting part is that the scoring logic is written in **C++**, while the rest of the system is built using modern web technologies. The backend acts as a bridge between the frontend and the C++ engine.

---

## 📌 Features

### 🧠 C++ Engine

* Rule-based credit scoring (DSA + OOP)
* High-performance evaluation logic
* JSON output for API integration

### 🌐 Backend (Node.js)

* REST API for loan processing
* C++ integration via `child_process`
* MongoDB Atlas for persistent storage
* Deployed on Render

### 💻 Frontend (React)

* Interactive loan application form
* Real-time approval & score display
* Clean, responsive UI (Vercel)

---

## ⚙️ How it works

```
React (Frontend)
     │
     ▼
Node.js / Express (API)
     │
     ▼
C++ Scoring Engine
     │
     ▼
MongoDB Atlas (Database)
```

* The user fills out a form in the React app
* The data is sent to the Node.js API
* The API runs the C++ program using `child_process.spawn()`
* The C++ engine calculates the score and returns the result
* The result is stored in MongoDB and shown on the UI

---

## 🚀 Tech Stack

**Frontend**

* React (Vite)
* CSS

**Backend**

* Node.js
* Express

**Core Logic**

* C++ (STL)

**Database**

* MongoDB Atlas

**Deployment**

* Vercel (frontend)
* Render (backend + C++)

---

## 📊 Scoring Logic

The C++ engine uses a simple weighted scoring approach based on financial factors:

| Factor            | Condition | Points |
| ----------------- | --------- | ------ |
| Annual Income     | ≥ ₹50,000 | +25    |
|                   | ≥ ₹30,000 | +15    |
|                   | < ₹30,000 | +5     |
| Credit History    | ≥ 5 years | +20    |
|                   | ≥ 2 years | +10    |
| Loan/Income Ratio | < 0.2     | +20    |
|                   | < 0.5     | +10    |
| Existing Loans    | None      | +15    |
| Asset Value       | ≥ ₹50,000 | +10    |
| Monthly Expenses  | < ₹2,000  | +10    |
|                   | < ₹4,000  | +5     |

**Score ≥ 70 → Approved ✅**
**Score < 70 → Rejected ❌**

---

## 🧩 Some things I focused on

* Keeping the scoring logic in C++ instead of rewriting it in JavaScript
* Making Node.js communicate with a compiled binary using stdin/stdout
* Handling cases where the backend might be slow (fallback logic in frontend)
* Structuring the project so each part (UI, API, engine, DB) is separate

---

## 📂 Project Structure

```
loan-approval-system/
├── scoringlogic.cpp
├── backend/
├── frontend/
```

---

## 🚀 How to Run

### 🔹 Backend (C++)

Clone the repo

```bash
git clone https://github.com/greeshma-ch/loan-approval-system.git
cd loan-approval-system
```

Compile the code:

```bash
g++ scoringlogic.cpp -o scoring_engine
```

Run in JSON mode (for API testing):

```bash
echo '{"name":"Test","income":50000,"loanAmount":20000,"creditHistory":5,"hasLoans":false,"expenses":1500,"assets":80000}' | ./scoring_engine --json
```

---

### 🔹 Backend (Node.js)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Run server:

```bash
node server.js
```

---

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 🔌 API Endpoints

* `GET /api/health` → check server status
* `POST /api/loan/apply` → submit application
* `GET /api/loan/history` → get past records
(e.g. ➡️https://credo-backend-725u.onrender.com/api/health)
---

## 🔮 Future Improvements

* User authentication
* Better UI/UX
* Analytics dashboard
* Docker setup

---

## 👤 Author

Greeshmanjali CH


