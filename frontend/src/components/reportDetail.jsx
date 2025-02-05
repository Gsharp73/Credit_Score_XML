import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Report not found.</p>
        <button
          onClick={() => navigate("/reports")}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          ← Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/reports")}
        className="mb-6 flex items-center text-purple-600 hover:text-purple-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Reports
      </button>

      <div className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{report.name}</h2>
              <p className="text-gray-500">PAN: {report.pan}</p>
              <p className="text-gray-500">Mobile: {report.mobilePhone}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg text-center ${
              report.creditScore >= 700 ? 'bg-green-100 text-green-800' :
              report.creditScore >= 600 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className="text-3xl font-bold">{report.creditScore}</div>
              <div className="text-sm font-medium">Credit Score</div>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Accounts</div>
              <div className="text-xl font-semibold text-purple-700">{report.reportSummary.totalAccounts}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Active Accounts</div>
              <div className="text-xl font-semibold text-green-700">{report.reportSummary.activeAccounts}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Closed Accounts</div>
              <div className="text-xl font-semibold text-gray-700">{report.reportSummary.closedAccounts}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Current Balance</div>
              <div className="text-xl font-semibold text-blue-700">₹{report.reportSummary.currentBalance.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600">Secured Balance</div>
              <div className="text-xl font-semibold text-yellow-700">₹{report.reportSummary.securedAmount.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600">Unsecured Balance</div>
              <div className="text-xl font-semibold text-red-700">₹{report.reportSummary.unsecuredAmount.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Last 7 Days Enquiries</div>
              <div className="text-xl font-semibold text-gray-700">{report.reportSummary.last7DaysEnquiries}</div>
            </div>
          </div>
        </div>

                {/* Credit Accounts with Conditional Styling */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Credit Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.creditAccounts.map((acc, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                  acc.overdueAmount > 0
                    ? 'border-red-300 bg-red-50 hover:bg-red-100'
                    : 'border-green-300 bg-green-50 hover:bg-green-100'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{acc.bank}</h4>
                  {acc.overdueAmount > 0 && (
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-sm font-semibold">
                      Overdue
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">A/C: <span className="font-medium">{acc.accountNumber}</span></p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Balance:</span>
                    <span className="font-semibold text-gray-800">
                      ₹{acc.currentBalance.toLocaleString()}
                    </span>
                  </div>
                  {acc.overdueAmount > 0 && (
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span className="text-sm">Overdue Amount:</span>
                      <span>₹{acc.overdueAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Credit Limit:</span>
                    <span className="font-medium text-gray-800">
                      ₹{acc.creditLimit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Addresses</h3>
          {report.addressDetails.map((addr, index) => (
            <p key={index} className="text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
