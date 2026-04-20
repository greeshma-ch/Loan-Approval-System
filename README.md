# 💼 CREDO - Loan Approval System (C++ + React + Node + MongoDB Application)

CREDO is a Loan Approval System that evaluates and processes customer loan applications using a rule-based scoring algorithm.
The project integrates a C++ decision engine with a Node.js backend, MongoDB Atlas for persistent storage, and a React-based frontend for an interactive user experience.

🌐 Live Demo

👉 https://loan-approval-system-gules.vercel.app/
🔗 Backend API: https://credo-backend-725u.onrender.com

## 📌 Features

### 🧠 Backend (C++ Engine)

* 📝 Processes loan applications with complete customer data
* ⚡ High-performance scoring using C++ (DSA + OOP concepts)
* 📊 Calculates a credit score based on multiple financial factors
* ✅ Approves or rejects loans based on computed score
* 📄 Generates structured JSON output for API integration

---

### 🌐 Backend API (Node.js + Express)

* 🔗 REST API for handling loan applications
* ⚙️ Integrates C++ engine using `child_process` (stdin/stdout)
* 📥 Accepts application data via POST requests
* 📤 Returns structured JSON responses
* 💾 Stores applications in MongoDB Atlas
* 🚀 Deployed on Render

---

### 💻 Frontend (React)

* 🧾 Interactive loan application form
* ⚡ Real-time API-based processing
* 📊 Instant loan approval/rejection display
* 📉 Credit score breakdown visualization
* 🎨 Clean and responsive UI
* 🚀 Deployed on Vercel

---

## 🧮 Credit Score Breakdown

| Factor                           | Points |
| -------------------------------- | ------ |
| High income                      | +25    |
| Moderate income                  | +15    |
| Low income                       | +5     |
| Long credit history (≥5 years)   | +20    |
| Medium credit history (≥2 years) | +10    |
| Low loan-to-income ratio (<0.2)  | +20    |
| Moderate ratio (<0.5)            | +10    |
| No existing loans                | +15    |
| High asset value                 | +10    |
| Low monthly expenses             | +10    |
| Moderate expenses                | +5     |

---

## ✅ Decision Rule

* **Score ≥ 70 → Approved ✅**
* **Score < 70 → Rejected ❌**

---

## 🧰 Technologies Used

### Backend (C++ Engine):

* C++17
* STL (Priority Queue, Vectors)
* Custom JSON parsing

### Backend API:

* Node.js
* Express.js
* child_process (C++ integration)
* MongoDB Atlas (Cloud Database)
* Render (Deployment)

### Frontend:

* React (Vite)
* JavaScript
* HTML/CSS
* Vercel (Deployment)

---

## 🚀 How to Run

🔹 Backend (C++)

1. **Clone the repo**

   ```bash
   git clone https://github.com/greeshma-ch/loan-approval-system.git
   cd loan-approval-system
   ```

2. Compile the code:

   ```bash
   g++ scoringlogic.cpp -o scoring_engine
   ```

3. Run in JSON mode (for API testing):

   ```bash
   echo '{"name":"Test","income":50000,"loanAmount":20000,"creditHistory":5,"hasLoans":false,"expenses":1500,"assets":80000}' | ./scoring_engine --json
   ```

---

🔹 Backend (Node.js)

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

🔹 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Then open:

http://localhost:5173

---

## 📊 Features Summary

* Full-stack loan approval system
* C++-based decision engine integrated with web backend
* Real-time API processing
* Cloud database storage (MongoDB Atlas)
* Deployed frontend and backend

---

## 🔮 Future Improvements

* Authentication system (JWT)
* Admin dashboard with analytics
* Advanced filtering & search
* Improved UI/UX with charts
* Docker containerization

