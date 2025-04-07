# 💼 Loan Approval System (C++ Console Application)

This is a Loan Approval System developed in C++ that evaluates and processes customer loan applications using a scoring algorithm. It is designed as a mini project suitable for academic or beginner-level C++ file handling and OOP practice.

---

## 📌 Features

- 📝 Accepts new loan applications with complete customer data.
- 📂 Saves all applications in a CSV file using file handling.
- 📊 Calculates a credit score based on:
  - Income-to-loan ratio
  - Credit history
  - Existing loans
  - Monthly expenses vs income
  - Assets owned
- ✅ Approves or rejects the loan based on the credit score.
- 📄 Displays all stored applications.
- 🏆 Highlights top-scoring applicants (score ≥ 80).

---

## 🧮 Credit Score Breakdown

| Factor                        | Points      |
|-------------------------------|-------------|
| High income vs loan ratio     | +20         |
| Long credit history           | +20         |
| No existing loans             | +15         |
| Low monthly expenses          | +15         |
| High asset value              | +30         |

> Score ≥ 70 = **Approved**  
> Score < 70 = **Rejected**

---

## 🧰 Technologies Used

- C++17
- File Handling (`fstream`)
- Simple Scoring Logic
- Menu-driven console UI
- CSV storage format

---

## 🚀 How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/@greeshma-ch/loan-approval-system.git
   cd loan-approval-system
2. Compile the code using g++ or any C++ compiler:

   ```bash
   g++ main.cpp -o loan_system
   ./loan_system
