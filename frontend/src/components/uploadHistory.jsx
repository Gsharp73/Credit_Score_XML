import React, { useEffect, useState } from "react";

const UploadHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/history`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching upload history:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Upload History</h2>
      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">PAN</th>
              <th className="border p-2">Filename</th>
              <th className="border p-2">Upload Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border p-2">{entry.pan}</td>
                <td className="border p-2">{entry.fileName}</td>
                <td className="border p-2">{new Date(entry.uploadTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UploadHistory;
