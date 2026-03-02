import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchToken, resetToken, fetchQuestions } from "../api/triviaAPI.js";

describe("triviaAPI", () => {
  let originalFetch;

  // Backup original fetch before each test so tests don’t break the app
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(); // mock fetch function for testing
  });

  // Restore original fetch after each tests so other tests not affected
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // Test 1: Test fetchToken success
  it("fetchToken returns token when API responds successfully", async () => {
    // simulates API response without calling the real API
    const mockTokenData = {
      response_code: 0,
      response_message: "Token Generated Successfully!",
      token: "mocked_token_123",
    };

    // mockResolvedValueOnce tells mock fetch to return this fake Response object
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData, // returns mock token data
    });

    const token = await fetchToken();
    expect(token).toBe("mocked_token_123");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://opentdb.com/api_token.php?command=request",
    ); // checks that fetch was called with the exact API URL
  });

  // Test 2: Test fetchToken failure
  it("fetchToken throws error when response.ok is false", async () => {
    // Simulates a failed fetch (server error)
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    // Assert that the function throws an error with the correct message
    await expect(fetchToken()).rejects.toThrow("Failed to get token: 500");
  });

  // Test 3: resetToken calls fetch with the correct reset URL
  it("resetToken calls fetch with correct URL", async () => {
    const token = "mocked_token_123"; // dummy token to reset
    globalThis.fetch.mockResolvedValueOnce({ ok: true }); // simulate a successful fetch (HTTP 200)

    await resetToken(token);

    // Checks that fetch was called with the correct reset URL
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `https://opentdb.com/api.php?command=reset&token=${token}`,
    );
  });

  // Test 4: Test fetchQuestions success
  it("fetchQuestions returns questions data when API responds successfully", async () => {
    // Mock question data, structured exactly like Open Trivia API returns
    const mockQuestionsData = {
      response_code: 0,
      results: [
        {
          question: "Q1",
          correct_answer: "A",
          incorrect_answers: ["B", "C", "D"],
        },
        {
          question: "Q2",
          correct_answer: "X",
          incorrect_answers: ["Y", "Z", "W"],
        },
      ],
    };

    // Simulate a successful fetch with the mock questions
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuestionsData,
    });

    const data = await fetchQuestions("mocked_token_123");
    expect(data).toEqual(mockQuestionsData);

    // Assert that fetchQuestions returns exactly the mock data
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://opentdb.com/api.php?amount=5&type=multiple&token=mocked_token_123",
    ); // checks that the API URL has amount=5, type=multiple, and token included
  });

  // Test 5: Test fetchQuestions failure
  it("fetchQuestions throws error when response.ok is false", async () => {
    // Simulate a failed API call
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    // Checks that the function throws an error with correct message
    await expect(fetchQuestions("mocked_token_123")).rejects.toThrow(
      "Failed to fetch questions: 404",
    );
  });
});
