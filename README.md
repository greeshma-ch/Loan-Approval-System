💼 CREDO - Loan Approval System (C++ + React Application)

CREDO is a Loan Approval System that evaluates and processes customer loan applications using a rule-based scoring algorithm.
The project consists of a C++ console application (backend logic) and a React-based frontend for an interactive user experience.

🌐 Live Demo

👉 Add your deployed frontend link here

https://loan-approval-system-gules.vercel.app/

##📌 Features
🧠 Backend (C++ CLI)
📝 Accepts new loan applications with complete customer data
📂 Saves all applications in a CSV file using file handling
📊 Calculates a credit score based on multiple financial factors
✅ Approves or rejects loans based on computed score
📄 Displays all stored applications
🏆 Highlights top-scoring applicants using priority queue
💻 Frontend (React)
🧾 Interactive loan application form
⚡ Real-time credit score calculation
📊 Instant loan approval/rejection display
🎨 Clean and responsive UI

##🧮 Credit Score Breakdown
Factor	Points
High income	+25
Moderate income	+15
Low income	+5
Long credit history (≥5 years)	+20
Medium credit history (≥2 years)	+10
Low loan-to-income ratio (<0.2)	+20
Moderate ratio (<0.5)	+10
No existing loans	+15
High asset value	+10
Low monthly expenses	+10
Moderate expenses	+5
✅ Decision Rule
Score ≥ 70 → Approved ✅
Score < 70 → Rejected ❌

##🧰 Technologies Used
Backend:
C++17
File Handling (fstream)
STL (Priority Queue, Vectors)
CSV File Storage
Frontend:
React (Vite)
JavaScript
HTML/CSS



## 🚀 How to Run
🔹 Backend (C++)
1. **Clone the repo**
   ```bash
   git clone https://github.com/@greeshma-ch/loan-approval-system.git
   cd loan-approval-system
2. Compile the code using g++ or any C++ compiler:

   ```bash
   g++ main.cpp -o loan_system
   ./loan_system

🔹 Frontend (React)
cd frontend
npm install
npm run dev

Then open:

http://localhost:5173

##📊 Features Summary
Rule-based credit scoring system
Loan approval decision engine
CLI-based backend with file storage
Interactive frontend interface
🔮 Future Improvements
Backend API integration
Database support (MongoDB / SQL)
Authentication system
Analytics dashboard


