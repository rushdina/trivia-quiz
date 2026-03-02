import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AnswerOption from "../components/AnswerOption.jsx";

// Test suite for AnswerOption.jsx
describe("AnswerOption component", () => {
  // Props to reuse in tests
  const defaultProps = {
    answerId: "a1",
    answerIsCorrect: false,
    answerText: "Option A",
    questionId: "q1",
    questionSelectedAnswerId: null,
    checkedAns: false,
    handleSelectAnswer: vi.fn(), // mock func
  };

  // Test 1: Renders answer text
  it("renders the answer text", () => {
    render(<AnswerOption {...defaultProps} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  // Test 2: Input is checked if selected
  it("checks the input if selected", () => {
    render(<AnswerOption {...defaultProps} questionSelectedAnswerId="a1" />);
    const input = screen.getByRole("radio"); // find radio element
    expect(input.checked).toBe(true);
  });

  // Test 3: Input is disabled when checkedAns is true
  it("disables input when checkedAns is true", () => {
    render(<AnswerOption {...defaultProps} checkedAns={true} />);
    const input = screen.getByRole("radio");
    expect(input.disabled).toBe(true);
  });

  // Test 4: CSS class for correct answer
  it("applies correct CSS class for correct answer", () => {
    render(
      <AnswerOption
        {...defaultProps}
        checkedAns={true}
        answerIsCorrect={true}
      />,
    );
    const label = screen.getByText("Option A").closest("label");
    expect(label).toHaveClass("correct-answer");
  });

  // Test 5: CSS class for wrong answer
  it("applies correct CSS class for wrong selected answer", () => {
    render(
      <AnswerOption
        {...defaultProps}
        checkedAns={true}
        questionSelectedAnswerId="a1"
      />,
    );
    const label = screen.getByText("Option A").closest("label");
    expect(label).toHaveClass("wrong-selected");
  });

  // Test 6: Calls handleSelectAnswer on click
  it("calls handleSelectAnswer when clicked", () => {
    const handleSelectAnswerMock = vi.fn(); // mock func
    render(
      <AnswerOption
        {...defaultProps}
        handleSelectAnswer={handleSelectAnswerMock}
      />,
    );
    const input = screen.getByRole("radio");
    fireEvent.click(input);
    expect(handleSelectAnswerMock).toHaveBeenCalledWith("q1", "a1"); // checks correct function arguments
  });
});
