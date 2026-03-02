import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import QuestionCard from "../components/QuestionCard.jsx";

// Test suite for QuestionCard.jsx
describe("QuestionCard component", () => {
  // Mock question data
  const sampleQuestion = {
    id: "q1",
    question: "What is 2 + 2?",
    answers: [
      { id: "a1", text: "3", isCorrect: false },
      { id: "a2", text: "4", isCorrect: true },
      { id: "a3", text: "5", isCorrect: false },
    ],
    selectedAnswerId: null, // no answer is selected initially
  };

  // Test 1: Renders question text
  it("renders the question text", () => {
    render(
      <QuestionCard
        questionObj={sampleQuestion}
        checkedAns={false}
        handleSelectAnswer={vi.fn()}
      />,
    );
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });

  // Test 2: Renders all answer options
  it("renders all answer options", () => {
    render(
      <QuestionCard
        questionObj={sampleQuestion}
        checkedAns={false}
        handleSelectAnswer={vi.fn()}
      />,
    );
    sampleQuestion.answers.forEach((answer) => {
      expect(screen.getByText(answer.text)).toBeInTheDocument();
    });
  });

  // Test 3: Passes checkedAns prop to all AnswerOptions
  it("passes checkedAns prop to all AnswerOptions", () => {
    render(
      <QuestionCard
        questionObj={sampleQuestion}
        checkedAns={true}
        handleSelectAnswer={vi.fn()}
      />,
    );
    // Finds all radio inputs and gets an array of disabled states
    const labels = screen.getAllByRole("radio").map((input) => input.disabled);
    // When checkedAns=true, all radio inputs should be disabled
    labels.forEach((disabled) => expect(disabled).toBe(true));
  });

  // Test 4: Calls handleSelectAnswer on click
  it("calls handleSelectAnswer when an answer is clicked", () => {
    const handleSelectAnswerMock = vi.fn();
    render(
      <QuestionCard
        questionObj={sampleQuestion}
        checkedAns={false}
        handleSelectAnswer={handleSelectAnswerMock}
      />,
    );

    // Finds the first answer input
    const firstInput = screen.getByLabelText("3");
    fireEvent.click(firstInput); // click first answer
    expect(handleSelectAnswerMock).toHaveBeenCalledWith("q1", "a1"); // check correct arguments were passed
  });

  // Test 5: Handles empty answers array
  it("handles empty answers array without crashing", () => {
    const emptyQuestion = { ...sampleQuestion, answers: [] };
    render(
      <QuestionCard
        questionObj={emptyQuestion}
        checkedAns={false}
        handleSelectAnswer={vi.fn()}
      />,
    );
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
});
