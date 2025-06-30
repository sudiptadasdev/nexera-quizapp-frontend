import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../components/Login";

test("renders login page", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  expect(screen.getByText(/Log in/i)).toBeInTheDocument();
});