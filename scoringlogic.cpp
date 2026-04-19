#include <fstream>
#include <iomanip>
#include <iostream>
#include <limits>
#include <queue>
#include <sstream>
#include <string>
#include <vector>
#include <cstring>
#include <cctype>


using namespace std;

struct Customer {
  string name;
  int age;
  float annual_income;
  float loan_amount;
  int credit_history_years;
  bool has_existing_loans;
  float monthly_expenses;
  float assets_value;
  float score;

  bool operator<(const Customer &other) const {
    return score < other.score;
  }
};

float calculateScore(Customer &c) {
  float score = 0;

  if (c.annual_income >= 50000)
    score += 25;
  else if (c.annual_income >= 30000)
    score += 15;
  else
    score += 5;

  if (c.credit_history_years >= 5)
    score += 20;
  else if (c.credit_history_years >= 2)
    score += 10;

  float ratio = c.loan_amount / c.annual_income;
  if (ratio < 0.2)
    score += 20;
  else if (ratio < 0.5)
    score += 10;

  score += c.has_existing_loans ? 0 : 15;

  // Asset score
  if (c.assets_value >= 50000)
    score += 10;

  if (c.monthly_expenses < 2000)
    score += 10;
  else if (c.monthly_expenses < 4000)
    score += 5;

  c.score = score;
  return score;
}

void saveToCSV(const Customer &c, bool writeHeader = false) {
  ofstream file("loan_applications.csv", ios::app);
  if (writeHeader) {
    file << "Name,Age,Annual Income,Loan Amount,Credit History,Existing "
            "Loans,Monthly Expenses,Assets Value,Credit Score,Status\n";
  }
  file << fixed << setprecision(2);
  file << c.name << "," << c.age << "," << c.annual_income << ","
       << c.loan_amount << "," << c.credit_history_years << ","
       << (c.has_existing_loans ? "Yes" : "No") << "," << c.monthly_expenses
       << "," << c.assets_value << "," << c.score << ","
       << (c.score >= 70 ? "Approved" : "Rejected") << "\n";
  file.close();
}

void evaluateCustomer(const Customer &c) {
  cout << "\n--- Evaluation Result ---\n";
  cout << "Customer: " << c.name << endl;
  cout << "Credit Score: " << c.score << endl;
  cout << "Loan Status: " << (c.score >= 70 ? "Approved" : "Rejected") << "\n";
}

Customer getCustomerData() {
  Customer c;
  cout << "\n--- Enter Customer Data ---\n";
  cout << "Name: ";
  cin.ignore();
  getline(cin, c.name);

  cout << "Age: ";
  while (!(cin >> c.age) || c.age <= 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter a valid age: ";
  }

  cout << "Annual Income: ";
  while (!(cin >> c.annual_income) || c.annual_income <= 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter a valid income: ";
  }

  cout << "Loan Amount: ";
  while (!(cin >> c.loan_amount) || c.loan_amount <= 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter a valid loan amount: ";
  }

  cout << "Credit History (years): ";
  while (!(cin >> c.credit_history_years) || c.credit_history_years < 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter a valid credit history: ";
  }

  int hasLoans;
  cout << "Has Existing Loans (0 = No, 1 = Yes): ";
  while (!(cin >> hasLoans) || (hasLoans != 0 && hasLoans != 1)) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter 0 or 1: ";
  }
  c.has_existing_loans = hasLoans;

  cout << "Monthly Expenses: ";
  while (!(cin >> c.monthly_expenses) || c.monthly_expenses < 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter valid monthly expenses: ";
  }

  cout << "Assets Value: ";
  while (!(cin >> c.assets_value) || c.assets_value < 0) {
    cin.clear();
    cin.ignore(1000, '\n');
    cout << "Enter a valid asset value: ";
  }

  calculateScore(c);
  return c;
}

void viewApplications() {
  ifstream file("loan_applications.csv");
  if (!file.is_open()) {
    cout << "No application records found.\n";
    return;
  }

  string line;
  cout << "\n--- All Loan Applications ---\n";
  while (getline(file, line)) {
    cout << line << endl;
  }

  file.close();
}

void showTopApplicants(int n) {
  ifstream file("loan_applications.csv");
  if (!file.is_open()) {
    cout << "No application records found.\n";
    return;
  }

  string line;
  getline(file, line);

  priority_queue<Customer> pq;
  while (getline(file, line)) {
    stringstream ss(line);
    Customer c;
    string temp;

    getline(ss, c.name, ',');
    getline(ss, temp, ',');
    c.age = stoi(temp);
    getline(ss, temp, ',');
    c.annual_income = stof(temp);
    getline(ss, temp, ',');
    c.loan_amount = stof(temp);
    getline(ss, temp, ',');
    c.credit_history_years = stoi(temp);
    getline(ss, temp, ',');
    c.has_existing_loans = (temp == "Yes");
    getline(ss, temp, ',');
    c.monthly_expenses = stof(temp);
    getline(ss, temp, ',');
    c.assets_value = stof(temp);
    getline(ss, temp, ',');
    c.score = stof(temp);

    pq.push(c);
  }

  cout << "\n--- Top Applicants ---\n";
  for (int i = 0; i < n && !pq.empty(); i++) {
    Customer top = pq.top();
    pq.pop();
    cout << i + 1 << ". " << top.name << " (Score: " << top.score << ")\n";
  }

  file.close();
}

// ============================================================
// JSON API HELPERS
// ------------------------------------------------------------
// These functions provide a minimal, dependency-free JSON
// parser for flat objects. This is used specifically so the
// C++ engine can communicate with the Node.js backend via
// stdin/stdout without requiring external libraries.
// ============================================================

string trim(const string &s) {
  size_t start = s.find_first_not_of(" \t\n\r");
  if (start == string::npos) return "";
  size_t end = s.find_last_not_of(" \t\n\r");
  return s.substr(start, end - start + 1);
}

string jsonGetString(const string &json, const string &key) {
  string search = "\"" + key + "\"";
  size_t pos = json.find(search);
  if (pos == string::npos) return "";

  pos = json.find(':', pos + search.length());
  if (pos == string::npos) return "";

  pos = json.find('"', pos + 1);
  if (pos == string::npos) return "";

  size_t end = json.find('"', pos + 1);
  if (end == string::npos) return "";

  return json.substr(pos + 1, end - pos - 1);
}

float jsonGetNumber(const string &json, const string &key) {
  string search = "\"" + key + "\"";
  size_t pos = json.find(search);
  if (pos == string::npos) return 0;

  pos = json.find(':', pos + search.length());
  if (pos == string::npos) return 0;

  pos++;
  while (pos < json.length() && (json[pos] == ' ' || json[pos] == '\t')) pos++;

  string numStr;
  while (pos < json.length() && (isdigit(json[pos]) || json[pos] == '.' || json[pos] == '-')) {
    numStr += json[pos];
    pos++;
  }

  return numStr.empty() ? 0 : stof(numStr);
}

bool jsonGetBool(const string &json, const string &key) {
  string search = "\"" + key + "\"";
  size_t pos = json.find(search);
  if (pos == string::npos) return false;

  pos = json.find(':', pos + search.length());
  if (pos == string::npos) return false;

  return json.find("true", pos) < json.find(',', pos) ||
         json.find("true", pos) < json.find('}', pos);
}

string generateBreakdownJSON(const Customer &c) {
  stringstream ss;
  ss << fixed << setprecision(2);

  int incomePoints = 0;
  if (c.annual_income >= 50000) incomePoints = 25;
  else if (c.annual_income >= 30000) incomePoints = 15;
  else incomePoints = 5;

  int creditPoints = 0;
  if (c.credit_history_years >= 5) creditPoints = 20;
  else if (c.credit_history_years >= 2) creditPoints = 10;

  float ratio = c.loan_amount / c.annual_income;
  int ratioPoints = 0;
  if (ratio < 0.2) ratioPoints = 20;
  else if (ratio < 0.5) ratioPoints = 10;

  int loanPoints = c.has_existing_loans ? 0 : 15;

  // Assets
  int assetPoints = c.assets_value >= 50000 ? 10 : 0;

  int expensePoints = 0;
  if (c.monthly_expenses < 2000) expensePoints = 10;
  else if (c.monthly_expenses < 4000) expensePoints = 5;

  ss << "[";
  ss << "{\"label\":\"Annual Income\",\"points\":" << incomePoints << ",\"maxPoints\":25},";
  ss << "{\"label\":\"Credit History\",\"points\":" << creditPoints << ",\"maxPoints\":20},";
  ss << "{\"label\":\"Loan-to-Income Ratio\",\"points\":" << ratioPoints << ",\"maxPoints\":20},";
  ss << "{\"label\":\"No Existing Loans\",\"points\":" << loanPoints << ",\"maxPoints\":15},";
  ss << "{\"label\":\"Asset Value\",\"points\":" << assetPoints << ",\"maxPoints\":10},";
  ss << "{\"label\":\"Monthly Expenses\",\"points\":" << expensePoints << ",\"maxPoints\":10}";
  ss << "]";

  return ss.str();
}

void handleJsonMode() {
  string input;
  string line;
  while (getline(cin, line)) {
    input += line;
  }

  input = trim(input);
  if (input.empty()) {
    cout << "{\"error\":\"Empty input received\"}" << endl;
    return;
  }

  Customer c;
  c.name = jsonGetString(input, "name");
  c.age = (int)jsonGetNumber(input, "age");
  c.annual_income = jsonGetNumber(input, "income");
  c.loan_amount = jsonGetNumber(input, "loanAmount");
  c.credit_history_years = (int)jsonGetNumber(input, "creditHistory");
  c.has_existing_loans = jsonGetBool(input, "hasLoans");
  c.monthly_expenses = jsonGetNumber(input, "expenses");
  c.assets_value = jsonGetNumber(input, "assets");

  if (c.name.empty()) {
    cout << "{\"error\":\"Missing required field: name\"}" << endl;
    return;
  }
  if (c.annual_income <= 0) {
    cout << "{\"error\":\"Invalid or missing field: income\"}" << endl;
    return;
  }
  if (c.loan_amount <= 0) {
    cout << "{\"error\":\"Invalid or missing field: loanAmount\"}" << endl;
    return;
  }

  calculateScore(c);

  // Build breakdown
  string breakdown = generateBreakdownJSON(c);

  cout << fixed << setprecision(2);
  cout << "{";
  cout << "\"name\":\"" << c.name << "\",";
  cout << "\"age\":" << c.age << ",";
  cout << "\"income\":" << c.annual_income << ",";
  cout << "\"loanAmount\":" << c.loan_amount << ",";
  cout << "\"creditHistory\":" << c.credit_history_years << ",";
  cout << "\"hasLoans\":" << (c.has_existing_loans ? "true" : "false") << ",";
  cout << "\"expenses\":" << c.monthly_expenses << ",";
  cout << "\"assets\":" << c.assets_value << ",";
  cout << "\"score\":" << c.score << ",";
  cout << "\"status\":\"" << (c.score >= 70 ? "Approved" : "Rejected") << "\",";
  cout << "\"approved\":" << (c.score >= 70 ? "true" : "false") << ",";
  cout << "\"breakdown\":" << breakdown;
  cout << "}" << endl;
}


int main(int argc, char *argv[]) {

  // JSON API MODE — used by Node.js backend
  // Usage: echo '{"name":"...","income":...}' | scoring_engine.exe --json
  if (argc > 1 && strcmp(argv[1], "--json") == 0) {
    handleJsonMode();
    return 0;
  }

  int choice;
  bool headerWritten = false;

  ifstream checkFile("loan_applications.csv");
  if (checkFile.peek() == ifstream::traits_type::eof()) {
    headerWritten = true;
  }
  checkFile.close();

  do {
    cout << "\n==== Loan Approval System ====\n";
    cout << "1. New Loan Application\n";
    cout << "2. View All Applications\n";
    cout << "3. Show Top Applicants\n";
    cout << "4. Exit\n";
    cout << "Choose an option: ";
    cin >> choice;

    if (cin.fail()) {
      cin.clear();
      cin.ignore(1000, '\n');
      cout << "Invalid input. Please enter a number.\n";
      continue;
    }

    switch (choice) {
    case 1: {
      Customer c = getCustomerData();
      evaluateCustomer(c);
      saveToCSV(c, headerWritten);
      headerWritten = false;
      break;
    }
    case 2:
      viewApplications();
      break;
    case 3: {
      int n;
      cout << "Enter number of top applicants to display: ";
      cin >> n;
      showTopApplicants(n);
      break;
    }
    case 4:
      cout << "Exiting the system. Goodbye!\n";
      break;
    default:
      cout << "Invalid choice. Please select from the menu.\n";
    }
  } while (choice != 4);

  return 0;
}
