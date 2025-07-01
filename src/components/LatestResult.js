import React, { useEffect, useState } from 'react';
import { Container, Card, Badge } from 'react-bootstrap';

function LatestResult() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("quiz_result");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return <Container className="mt-4"><p>No recent quiz result found.</p></Container>;
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Your Latest Quiz Result</h2>
      <p><strong>Score:</strong> {result.score}</p>
      <hr />
      {result.results.map((item, index) => (
        <Card key={index} className="mb-4">
          <Card.Body>
            <Card.Title>Q{index + 1}: {item.question}</Card.Title>
            <p>
              <strong>Your Answer: </strong>
              <Badge bg={item.is_correct ? "success" : "danger"}>
                {item.user_answer}
              </Badge>
            </p>
            {item.correct_answer && <p><strong>Correct Answer:</strong> {item.correct_answer}</p>}
            {item.explanation && <p><strong>Explanation:</strong> {item.explanation}</p>}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default LatestResult;
