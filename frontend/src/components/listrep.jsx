import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setFilteredReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredReports(
      reports.filter((report) =>
        report.name.toLowerCase().includes(value.toLowerCase()) || 
        report.pan.toLowerCase().includes(value.toLowerCase()) 
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600">Credit Reports</h2>
        <div className="relative">
          <input
            type="text"
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all duration-300"
            placeholder="Search by name or PAN..."
            value={search}
            onChange={handleSearch}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-12 bg-purple-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-gray-600">No reports found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/reports/${report._id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.creditScore >= 700 ? 'bg-green-100 text-green-700' :
                    report.creditScore >= 600 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {report.creditScore}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-3">PAN: {report.pan}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 text-sm font-medium">
                    {report.reportSummary.totalAccounts} Accounts
                  </span>
                  <span className="text-gray-400 hover:text-purple-500 transition-colors">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;