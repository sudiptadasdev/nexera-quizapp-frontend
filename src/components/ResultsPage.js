import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function ResultsPage() {
  const location = useLocation();
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      const token = localStorage.getItem("token");

      try {
        console.log("📍 Location state:", location.state);

        if (location.state?.fromSubmit) {
          // Show only latest result from localStorage
          const latest = JSON.parse(localStorage.getItem('quiz_result'));
          console.log("📍 Latest result from localStorage:", latest);

          if (latest && Array.isArray(latest.results)) {
            setQuizResults(latest.results);  // ✅ Only store the results array
            console.log("✅ Set quizResults to latest:", latest.results);
          } else {
            setFetchError("No latest quiz result found.");
          }
        } else {
          // Full attempt history
          const response = await axios.get("http://localhost:8000/api/answers/attempts", {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          console.log("📜 All past attempts received:", response.data);
          setQuizResults(response.data);
        }
      } catch (err) {
        console.error("❌ Error loading results:", err);
        setFetchError("Failed to load quiz results.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [location.state]);

  if (isLoading) return <p>Loading results...</p>;
  if (fetchError) return <p>{fetchError}</p>;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Quiz Results</h2>

      {quizResults.length === 0 ? (
        <p>No results to display.</p>
      ) : (
        quizResults.map((result, idx) => (
          <Card key={idx} className="mb-4">
            <Card.Body>
              <Card.Title>Q{idx + 1}: {result.question}</Card.Title>
              <p>
                <strong>Your Answer: </strong>
                <Badge bg={result.is_correct ? "success" : "danger"}>
                  {result.user_answer}
                </Badge>
              </p>

              {result.correct_answer !== null && (
                <p><strong>Correct Answer:</strong> {result.correct_answer}</p>
              )}

              {result.explanation && (
                <p><strong>Explanation:</strong> {result.explanation}</p>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default ResultsPage;
