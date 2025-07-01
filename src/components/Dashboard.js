import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import confetti from 'canvas-confetti';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ darkMode }) => {
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [quizSections, setQuizSections] = useState([]);
  const [trendScores, setTrendScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    API.get('user/dashboard/files', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setUploadedDocs(res.data))
      .catch(err => console.error('File load error', err));

    API.get('user/dashboard/weekly-scores', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setTrendScores(res.data))
      .catch(err => console.error('Weekly score fetch failed', err));
  }, []);

  const loadQuizSections = async (fileId) => {
    setActiveFileId(fileId);
    try {
      const res = await API.get(`user/dashboard/files/${fileId}/sections`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setQuizSections(res.data);
    } catch (err) {
      console.error("Error loading quiz sections", err);
    }
  };

  const generateQuizSection = async () => {
    if (!activeFileId) return;
    setIsLoading(true);
    try {
      const res = await API.post(`user/dashboard/files/${activeFileId}/generate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setShowSuccessToast(true);

      const newQuiz = res.data;
      navigate(`/quiz/${newQuiz.quiz_id}`);
    } catch (err) {
      console.error("Quiz generation failed", err);
      alert("Failed to generate quiz. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ SHOW SIMPLE MESSAGE DURING GENERATION
  if (isLoading) {
    return (
      <div className={`text-center mt-5 ${darkMode ? 'text-light bg-dark' : 'text-dark bg-light'}`} style={{ padding: '2rem' }}>
        <div className="spinner-border mb-3" role="status" />
        <p className="fw-bold fs-5">⏳ Generating your quiz... please wait.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg="success" show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={2000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>New quiz questions generated! 🎉</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="mt-4">
        <h2>Your Uploaded Files</h2>
        {uploadedDocs.length === 0 && <p>No uploaded files found.</p>}
        <div className="d-flex flex-wrap gap-3">
          {uploadedDocs.map(file => (
            <Card
              key={file.id}
              className={`p-3 cursor-pointer ${darkMode ? 'bg-dark text-light border-light' : 'bg-light text-dark border-dark'}`}
              onClick={() => loadQuizSections(file.id)}
              style={{ width: '200px' }}
            >
              <Card.Title>{file.original_name}</Card.Title>
              <Card.Text>Uploaded: {new Date(file.uploaded_at).toLocaleDateString()}</Card.Text>
            </Card>
          ))}
        </div>

        {trendScores.length > 0 && (
          <div className="mt-5">
            <h3>Weekly Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week_start" />
                <YAxis domain={[0, 10]} allowDecimals />
                <Tooltip />
                <Line type="monotone" dataKey="avg_score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeFileId && quizSections.length > 0 && (
          <>
            <h3 className="mt-5">Generated Quiz Sections</h3>
            <Table striped bordered hover variant={darkMode ? 'dark' : 'light'}>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Question Count</th>
                </tr>
              </thead>
              <tbody>
                {quizSections.map((section, index) => (
                  <tr key={index}>
                    <td>Section {index + 1}</td>
                    <td>{section.questions.length}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button
              variant={darkMode ? "outline-light" : "outline-primary"}
              className="mt-3"
              onClick={generateQuizSection}
            >
              Generate More Quizzes
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
