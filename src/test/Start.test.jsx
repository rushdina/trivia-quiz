import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Start from "../components/Start.jsx";

// Test suite for Start.jsx
describe("Start component", () => {
  // Test 1: Render heading and paragraph
  it("renders heading and paragraph", () => {
    render(<Start goToQuestions={() => {}} />);

    expect(screen.getByText("Quizzical")).toBeInTheDocument(); // check heading
    expect(
      screen.getByText(
        /Trivia, fun and challenges, all in one quiz! How many questions can you get right\?/i,
      ),
    ).toBeInTheDocument(); // check paragraph text
  });

  // Test 2: Check button exists
  it("renders Start quiz button", () => {
    render(<Start goToQuestions={() => {}} />);

    const button = screen.getByText("Start quiz");
    expect(button).toBeInTheDocument();
  });

  // Test 3: Button click calls prop function
  it("calls goToQuestions when button is clicked", () => {
    const goToQuestionsMock = vi.fn(); // mock func to track how many times it's called
    render(<Start goToQuestions={goToQuestionsMock} />);

    const button = screen.getByText("Start quiz");
    fireEvent.click(button);

    expect(goToQuestionsMock).toHaveBeenCalledTimes(1);
  });
});
