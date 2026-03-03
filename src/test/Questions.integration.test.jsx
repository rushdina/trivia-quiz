// Questions.integration.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Questions from "../components/Questions.jsx";
import * as api from "../api/triviaAPI.js";

// Mock API functions for integration tests
vi.mock("../api/triviaAPI.js", async () => {
  const actual = await vi.importActual("../api/triviaAPI.js");
  return {
    ...actual,
    fetchToken: vi.fn(actual.fetchToken),
    fetchQuestions: vi.fn(actual.fetchQuestions),
    resetToken: vi.fn(actual.resetToken),
  };
});

describe("Questions Component - Integration Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: Test normal flow, simulates the entire user flow of the quiz
  it("normal flow: fetches questions, selects answers, checks score, and plays again", async () => {
    // Mock token and questions
    api.fetchToken.mockResolvedValueOnce("mock-token");
    api.fetchQuestions.mockResolvedValueOnce({
      response_code: 0,
      results: [
        {
          question: "What is 2+2?",
          correct_answer: "4",
          incorrect_answers: ["3", "5", "6"],
        },
        {
          question: "Capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["London", "Berlin", "Madrid"],
        },
      ],
    });

    // Render Questions component
    render(<Questions />);

    // 1. Loading state
    expect(screen.getByText(/loading questions/i)).toBeInTheDocument();

    // 2. Wait for questions to appear in DOM
    await waitFor(() =>
      expect(screen.getByText("What is 2+2?")).toBeInTheDocument(),
    );
    // Both questions rendered
    expect(screen.getByText("Capital of France?")).toBeInTheDocument();

    // 3. Select answers
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("Paris"));

    // 4. Check answers button should be enabled
    const checkButton = screen.getByText("Check answers");
    expect(checkButton).not.toBeDisabled();

    // 5. Click check answers
    fireEvent.click(checkButton);

    // 6. Score message appears
    await waitFor(() =>
      expect(
        screen.getByText("You scored 2/2 correct answers!"),
      ).toBeInTheDocument(),
    );

    // Play again question mock data
    api.fetchQuestions.mockResolvedValueOnce({
      response_code: 0,
      results: [
        {
          question: "New question?",
          correct_answer: "Answer",
          incorrect_answers: ["X", "Y", "Z"],
        },
      ],
    });

    // 7. Click "Play again" (checkButton now shows Play again)
    fireEvent.click(screen.getByText("Play again"));

    // Wait for loading spinner appears
    await waitFor(() =>
      expect(screen.getByText(/loading questions/i)).toBeInTheDocument(),
    );

    // New question loaded
    await waitFor(() =>
      expect(screen.getByText("New question?")).toBeInTheDocument(),
    );
  });

  // Test 2: API error handling
  it("handles API error and retry", async () => {
    // Simulates fetch failure
    api.fetchToken.mockResolvedValueOnce("mock-token");
    api.fetchQuestions.mockRejectedValueOnce(new Error("API failure"));

    render(<Questions />);

    // Wait for error message to render
    await waitFor(() =>
      expect(
        screen.getByText(
          /something went wrong\. please try again after a few seconds/i,
        ),
      ).toBeInTheDocument(),
    );

    // Retry button exists
    expect(screen.getByText("Retry")).toBeInTheDocument();

    // Retry triggers fetch again
    api.fetchQuestions.mockResolvedValueOnce({
      response_code: 0,
      results: [
        {
          question: "Recovered question?",
          correct_answer: "Yes",
          incorrect_answers: ["No"],
        },
      ],
    });

    // Click Retry triggers loadQuiz again
    fireEvent.click(screen.getByText("Retry"));

    await waitFor(() =>
      expect(screen.getByText("Recovered question?")).toBeInTheDocument(),
    );
  });

  // Test 3: Handle token expired
  it("handles token expired (response_code 3) scenario", async () => {
    // Mocks scenario where token is expired
    api.fetchToken.mockResolvedValueOnce("mock-token");
    api.fetchQuestions.mockResolvedValueOnce({ response_code: 3 }); // token expired
    api.fetchToken.mockResolvedValueOnce("new-token");
    api.fetchQuestions.mockResolvedValueOnce({
      response_code: 0,
      results: [
        {
          question: "Recovered after token?",
          correct_answer: "Yes",
          incorrect_answers: ["No"],
        },
      ],
    });

    // Confirms component retries with a new token and renders questions
    render(<Questions />);

    await waitFor(() =>
      expect(screen.getByText("Recovered after token?")).toBeInTheDocument(),
    );

    // Checks that fetchToken called twice: initial + expired
    expect(api.fetchToken).toHaveBeenCalledTimes(2);
  });

  // Test 4: Test when all questions used
  it("handles all questions used (response_code 4) scenario", async () => {
    // Mocks scenario where all questions were used
    api.fetchToken.mockResolvedValueOnce("mock-token");
    api.fetchQuestions.mockResolvedValueOnce({ response_code: 4 }); // all questions used
    // Checks component can refresh token and fetch new questions
    api.resetToken.mockResolvedValueOnce(undefined); // return nothing
    api.fetchQuestions.mockResolvedValueOnce({
      response_code: 0,
      results: [
        {
          question: "Question after reset?",
          correct_answer: "Yes",
          incorrect_answers: ["No"],
        },
      ],
    });

    render(<Questions />);

    await waitFor(() =>
      expect(screen.getByText("Question after reset?")).toBeInTheDocument(),
    );

    // Checks that resetToken is called
    expect(api.resetToken).toHaveBeenCalledWith("mock-token");
  });
});
