import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuizPage() {
  const { quizId } = useParams();                          // Extract quizId from route
  const [quizQuestions, setQuizQuestions] = useState([]);  // Stores fetched quiz questions
  const [answers, setAnswers] = useState({});              // Stores user's selected answers
  const [isLoading, setIsLoading] = useState(true);        // UI loading state
  const [fetchError, setFetchError] = useState(null);      // Error state
  const navigate = useNavigate();

  // 🔽 Fetch quiz details on mount
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/api/quizzes/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setQuizQuestions(response.data.questions);
      } catch (err) {
        console.error('Quiz load error:', err);
        setFetchError('Unable to load quiz. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [quizId]);

  // 🔄 Update user's answer selection
  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  // ✅ Submit user answers
  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        quizData: { quiz_id: quizId, questions: quizQuestions },
        userAnswers: Object.entries(answers).map(([questionId, answer]) => ({
          id: questionId,
          answer: answer
        }))
      };

      const response = await axios.post(
        'http://localhost:8000/api/answers/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store result and redirect to results page
      localStorage.setItem('quiz_result', JSON.stringify(response.data));
      navigate('/results');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit answers. Please try again.');
    }
  };

  // ⏳ Loading and error states
  if (isLoading) return <div>Loading quiz...</div>;
  if (fetchError) return <div className="text-danger">{fetchError}</div>;

  return (
    <div className="quiz-page container mt-4">
      <h2 className="mb-4">Take the Quiz</h2>

      {quizQuestions.map((question, index) => (
        <div key={question.id} className="mb-4 p-3 border rounded">
          <p><strong>Q{index + 1}:</strong> {question.text}</p>

          {question.question_type === 'mcq' && Array.isArray(question.options) ? (
            <ul className="list-unstyled">
              {question.options.map((option, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="form-check-input me-2"
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder="Your answer here"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button onClick={handleSubmitQuiz} className="btn btn-primary">
        Submit
      </button>
    </div>
  );
}

export default QuizPage;
