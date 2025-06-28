import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Badge } from 'react-bootstrap';

function ResultsPage() {
  // 🌐 State variables to hold fetched results, loading and error
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // 🔁 Fetch results on component mount
  useEffect(() => {
    const loadQuizResults = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/answers/attempts", {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        });
        setQuizResults(response.data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setFetchError("Failed to load results.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizResults();
  }, []);

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
