import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { formatQuestionObj } from "../utils/formatQuestionObj.js";

describe("formatQuestionObj", () => {
  // Mock question object test input
  const sampleQuestion = {
    question: "Which symbol represents 'less than or equal to' in math? (&le;)",
    correct_answer: "&le;",
    incorrect_answers: ["&lt;", "&gt;", "&ge;"],
  };

  // Deterministic shuffle tests
  let originalMathRandom; // backup the original Math.random

  // Runs once before all tests in this suite
  beforeAll(() => {
    originalMathRandom = Math.random;
    // Deterministic random values for shuffle: Mock Math.random so that the Fisher-Yates shuffle produces a predictable order.
    const mockRandomValues = [0.5, 0.3, 0.2, 0.1];
    let callCount = 0;
    globalThis.Math.random = () =>
      mockRandomValues[callCount++ % mockRandomValues.length];
  });

  // Runs once after all tests in this suite
  afterAll(() => {
    // Restore Math.random after tests
    globalThis.Math.random = originalMathRandom;
  });

  // Test 1: Check Question Object Keys & values
  it("returns a formatted question object with correct keys", () => {
    const result = formatQuestionObj(sampleQuestion);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty(
      "question",
      "Which symbol represents 'less than or equal to' in math? (≤)",
    ); // HTML entity decoded
    expect(result).toHaveProperty("answers");
    expect(result).toHaveProperty("selectedAnswerId", null);

    expect(Array.isArray(result.answers)).toBe(true); // checks answers is an array
    expect(result.answers.length).toBe(4); // 4 answer options
  });

  // Test 2: Check there’s exactly one correct answer and the rest are incorrect
  it("has exactly one correct answer and the rest incorrect", () => {
    const result = formatQuestionObj(sampleQuestion);
    const correctCount = result.answers.filter((a) => a.isCorrect).length; // filter correct ans length
    const incorrectCount = result.answers.filter((a) => !a.isCorrect).length; // filter wrong ans length

    // there should be 1 correct + 3 incorrect answers
    expect(correctCount).toBe(1); // checks the length of the filtered
    expect(incorrectCount).toBe(3);
  });

  // Test 3: Ensure deterministic shuffle works predictably when Math.random is mocked
  it("answers are shuffled deterministically with mocked Math.random", () => {
    const result = formatQuestionObj(sampleQuestion);

    // Check the order of answer texts (matches mockRandomValues shuffle)
    const answerTexts = result.answers.map((a) => a.text);
    expect(answerTexts).toEqual([">", "<", "≥", "≤"]); // checks exact order from mocked Math.random
  });

  // Test 4: Test non-deterministic shuffle randomness without caring about the exact order
  it("shuffle changes order of answers without caring about exact order", () => {
    // Restore original Math.random for this test so it behaves randomly
    globalThis.Math.random = originalMathRandom;

    // Call formatQuestionObj 10 times and record answer orders to check shuffle is random
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(
        formatQuestionObj(sampleQuestion)
          .answers.map((a) => a.text)
          .join(","),
      );
    }

    // Checks if all 10 results are exactly the same
    const allSame = results.every((val) => val === results[0]);
    // If shuffle works, at least one of the arrays should differ
    expect(allSame).toBe(false);
  });

  // Test 5: Checks HTML entity he.decode() is working
  it("decodes HTML entities in question and answers", () => {
    const result = formatQuestionObj(sampleQuestion);

    expect(result.question).toBe(
      "Which symbol represents 'less than or equal to' in math? (≤)",
    );

    const allTexts = result.answers.map((a) => a.text);
    expect(allTexts).toContain("≤");
    expect(allTexts).toContain("<");
    expect(allTexts).toContain(">");
    expect(allTexts).toContain("≥");
  });
});
