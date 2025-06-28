// src/components/HistoryPage.js
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Table, Card, Button, Modal } from 'react-bootstrap';

const HistoryPage = ({ darkMode }) => {
  const [quizSummaries, setQuizSummaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);

  // Fetch user quiz history once component mounts
  useEffect(() => {
    API.get('/user/dashboard/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => setQuizSummaries(res.data))
      .catch(err => console.error("Failed to load quiz history:", err));
  }, []);

  const fetchAttemptsForQuiz = async (quizId) => {
    try {
      const res = await API.get(`/user/dashboard/quiz/${quizId}/attempts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setActiveQuizId(quizId);
      setQuizAttempts(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Attempt fetch failed:", err);
      alert("Could not retrieve attempt data.");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4">Your Quiz Progress</h2>

      {quizSummaries.length === 0 ? (
        <Card className={`p-3 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
          <p className="mb-0">No quiz data available.</p>
        </Card>
      ) : (
        <Table striped bordered hover responsive variant={darkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Submitted</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {quizSummaries.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.label}</td>
                <td>{entry.score} / {entry.num_questions}</td>
                <td>{new Date(entry.submitted_at).toLocaleString()}</td>
                <td>
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    onClick={() => fetchAttemptsForQuiz(entry.quiz_id)}
                  >
                    View Attempts
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Attempts Modal */}
      <Modal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        centered
        size="lg"
        className={darkMode ? "dark-modal" : ""}
      >
        <Modal.Header closeButton className={darkMode ? "bg-dark text-light" : ""}>
          <Modal.Title>Attempts for Quiz {activeQuizId}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? "bg-dark text-light" : ""}>
          {quizAttempts.length === 0 ? (
            <p>No attempts recorded yet.</p>
          ) : (
            <Table striped bordered hover variant={darkMode ? "dark" : "light"}>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Score</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((attempt, index) => (
                  <tr key={index}>
                    <td>{attempt.label}</td>
                    <td>{attempt.score} / {attempt.num_questions}</td>
                    <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer className={darkMode ? "bg-dark text-light" : ""}>
          <Button variant={darkMode ? "outline-light" : "secondary"} onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistoryPage;
