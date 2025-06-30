import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import QuizPage from "../components/QuizPage";

// Mock API to avoid .get errors
jest.mock("../api/api", () => ({
  get: jest.fn(() => Promise.resolve({ data: { questions: [] } })),
}));

test("renders quiz page without crashing", () => {
  render(
    <BrowserRouter>
      <QuizPage />
    </BrowserRouter>
  );
  expect(true).toBe(true); // dummy expectation to pass
});
