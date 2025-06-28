import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import confetti from 'canvas-confetti';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ darkMode }) => {
  // ==================== State Variables ====================
  const [uploadedDocs, setUploadedDocs] = useState([]);             // User's uploaded files
  const [activeFileId, setActiveFileId] = useState(null);           // Currently selected file
  const [quizSections, setQuizSections] = useState([]);             // Quiz sections derived from the file
  const [trendScores, setTrendScores] = useState([]);               // Weekly performance chart
  const [isLoading, setIsLoading] = useState(false);                // For global loading indicator
  const [showSuccessToast, setShowSuccessToast] = useState(false);  // For confetti success message

  const navigate = useNavigate();

  // ==================== Load on Mount ====================
  useEffect(() => {
    // Fetch list of uploaded files
    API.get('user/dashboard/files', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setUploadedDocs(res.data))
      .catch(err => console.error('File load error', err));

    // Fetch weekly performance chart data
    API.get('user/dashboard/weekly-scores', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setTrendScores(res.data))
      .catch(err => console.error('Weekly score fetch failed', err));
  }, []);

  // ==================== Fetch Quiz Sections ====================
  const loadQuizSections = async (fileId) => {
    setActiveFileId(fileId);  // Update current file selection
    try {
      const res = await API.get(`user/dashboard/files/${fileId}/sections`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setQuizSections(res.data);
    } catch (err) {
      console.error("Error loading quiz sections", err);
    }
  };

  // ==================== Trigger Gemini Quiz Generation ====================
  const generateQuizSection = async () => {
    if (!activeFileId) return;
    setIsLoading(true);
    try {
      await API.post(`user/dashboard/files/${activeFileId}/generate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); // 🎉
      setShowSuccessToast(true);
      await loadQuizSections(activeFileId); // Refresh list
    } catch (err) {
      console.error("Quiz generation failed", err);
      alert("Failed to generate quiz. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== UI ====================
  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className={`global-overlay ${darkMode ? "dark" : "light"}`}>
          <div className="spinner-border" role="status" />
        </div>
      )}

      {/* Toast success message */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg="success" show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={2000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>New quiz questions generated! 🎉</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Uploaded Files Section */}
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

        {/* Weekly Score Chart */}
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

        {/* Quiz Sections */}
        {activeFileId && quizSections.length > 0 && (
          <>
            <h3 className="mt-5">Generated Quiz Sections</h3>
            <Table striped bordered hover variant={darkMode ? 'dark' : 'light'}>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Question Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizSections.map((section, index) => (
                  <tr key={index}>
                    <td>Section {index + 1}</td>
                    <td>{section.questions.length}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                          navigate('/quiz', {
                            state: {
                              quizData: {
                                quiz_id: section.quiz_id,
                                questions: section.questions.map(q => ({
                                  id: q.id,
                                  question: q.text,
                                  options: q.options,
                                  correct_answer: q.correct_answer,
                                  explanation: q.explanation
                                }))
                              }
                            }
                          });
                        }}
                      >
                        Take Quiz
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Generate More Button */}
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
