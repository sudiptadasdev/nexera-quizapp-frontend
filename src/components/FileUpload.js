import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadComponent = () => {
  const [selectedFile, updateSelectedFile] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const SIZE_LIMIT = 1024 * 1024; // 1MB in bytes
  const VALID_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  // Handle file input change
  const onFileInputChange = (e) => {
    const chosenFile = e.target.files[0];
    if (!chosenFile) return;

    if (!VALID_TYPES.includes(chosenFile.type)) {
      setFeedbackMsg("❌ Only .pdf, .doc, or .docx files are supported.");
      setHasError(true);
      updateSelectedFile(null);
      return;
    }

    if (chosenFile.size > SIZE_LIMIT) {
      setFeedbackMsg("❌ File size should be under 1MB.");
      setHasError(true);
      updateSelectedFile(null);
      return;
    }

    updateSelectedFile(chosenFile);
    setFeedbackMsg("");
    setHasError(false);
  };

  // Handle file upload to backend
  const FileUpload = async () => {
    if (!selectedFile) {
      setFeedbackMsg("❌ Please choose a file before uploading.");
      setHasError(true);
      return;
    }

    const payload = new FormData();
    payload.append("file", selectedFile);

    setUploading(true);
    setFeedbackMsg("");
    setHasError(false);

    try {
      const authToken = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8000/upload-db/", payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { quiz_id } = res.data;
      setFeedbackMsg("✅ Quiz created successfully!");
      navigate(`/quiz/${quiz_id}`);
    } catch (err) {
      if (err.response?.status === 415) {
        setFeedbackMsg("❌ Invalid file format. Please upload PDF or Word documents.");
      } else {
        setFeedbackMsg(err.response?.data?.detail || "❌ Upload failed. Please try again.");
      }
      setHasError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Select a File to Upload</h3>
      <input
        type="file"
        onChange={onFileInputChange}
        accept=".pdf,.doc,.docx"
      />
      <button onClick={FileUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Submit"}
      </button>
      {feedbackMsg && (
        <p style={{ color: hasError ? "red" : "green", marginTop: "0.5rem" }}>
          {feedbackMsg}
        </p>
      )}
    </div>
  );
};

export default UploadComponent;
