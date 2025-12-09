// src/App.test.js
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders navbar links", () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
