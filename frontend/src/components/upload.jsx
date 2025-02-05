import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("xmlFile", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
      } else {
        setMessage(data.message || "Error uploading file.");
      }
    } catch (error) {
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 text-purple-600">Upload XML File</h2>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragging 
            ? "border-purple-500 bg-purple-50" 
            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            className={`w-12 h-12 ${dragging ? "text-purple-500" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600">
            Drag & drop your XML file here, or{" "}
            <label
              htmlFor="fileInput"
              className="text-purple-500 font-semibold cursor-pointer hover:text-purple-600"
            >
              click to select
            </label>
          </p>
        </div>
        <input
          type="file"
          id="fileInput"
          accept=".xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
          <span className="text-purple-700">{file.name}</span>
          <button
            className="text-red-500 hover:text-red-600 transition-colors"
            onClick={() => setFile(null)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!file}
      >
        Upload XML File
      </button>

      {message && (
        <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${
          message.includes("success") 
            ? "bg-green-50 text-green-700" 
            : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;