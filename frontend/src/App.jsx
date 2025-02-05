import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import FileUpload from "./components/upload";
import ReportList from "./components/listrep";
import ReportDetail from "./components/reportDetail";
import UploadHistory from "./components/uploadHistory";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive 
          ? "bg-purple-600 text-white shadow-lg" 
          : "text-gray-700 hover:bg-purple-100"
      }`}
    >
      {children}
    </Link>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      <Router>
        <div className="container mx-auto px-4 py-6">
          <nav className="bg-white rounded-xl shadow-lg mb-8 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent mr-8">
                  CreditSea
                </h1>
                <div className="flex gap-2">
                  <NavLink to="/">Upload XML</NavLink>
                  <NavLink to="/reports">View Reports</NavLink>
                  <NavLink to="/history">Upload History</NavLink>
                </div>
              </div>
            </div>
          </nav>

          <main className="bg-white rounded-xl shadow-lg p-6">
            <Routes>
              <Route path="/" element={<FileUpload />} />
              <Route path="/reports" element={<ReportList />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/history" element={<UploadHistory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
};

export default App;