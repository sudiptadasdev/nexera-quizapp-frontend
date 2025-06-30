import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";

test("renders forgot password form", () => {
  render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  );
  expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
});