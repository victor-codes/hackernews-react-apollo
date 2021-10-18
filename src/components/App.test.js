import { render, screen } from "@testing-library/react";
import App from "./App";

test("Hacker News", () => {
  render(<App />);
  const linkElement = screen.getByText(/"Hacker News"/i);
  expect(linkElement).toBeInTheDocument();
});
