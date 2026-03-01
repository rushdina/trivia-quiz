# ❓ Trivia Quizzical

A multiple-choice quiz solo project from the [Scrimba Frontend Developer Career Path](https://scrimba.com/frontend-path-c0j). This app fetches multiple-choice questions from the **Open Trivia Database API**, allowing users to select answers, check their score, and play multiple rounds without repeating questions. Answers are shuffled, correct and incorrect selections are highlighted, and the app handles token expiration for a smooth quiz experience.

## 🖼️ Preview

🔗 Live Demo: https://scrimba-quizzical-rushdina.vercel.app/

![Quizzical Start Page Preview](assets/preview/preview-quizzical-start.png)
![Quizzical Questions Page Preview](assets/preview/preview-quizzical-questions.png)
![Quizzical Checked Answers Page Preview](assets/preview/preview-quizzical-checkedAnswers.png)

## 🛠️ Technologies Used

- **Frontend:** `React`, `Vite`, `JavaScript`, `CSS`
- **External APIs:** [Trivia API](https://opentdb.com/api_config.php) – Retrieve questions data
- **npm Packages:**
  - `nanoid` – Generates unique IDs for questions and answers
  - `he` (HTML Entities) – Decodes HTML entities from API responses (e.g: `&quot;` → `"`)

## ✨ Features

- Fetches random multiple-choice mixed-category questions from the Open Trivia Database API.
- Shuffles answer options are randomized to make each quiz unique.
- Calculates and displays user score after checking answers.
- Handles session tokens to avoid duplicate questions and expired tokens.
- Reset and play a new set of questions anytime.
- Responsive, user-friendly UI with loading state and error handling.
- Decodes HTML entities in questions and answers using the `he` package.

## ⚡ How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/<username>/<repository>.git
cd <repository>
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. Open the **Localhost URL** (`http://localhost:5173`) shown in your terminal.

## 🚀 Usage

1. Click **Start Quiz**
2. Select one answer for each question
3. Click **Check Answers**
4. View your score
5. Click **Play Again** to fetch new questions

## 🧠 Challenges Encountered

- **Handling API tokens & limits**: Tokens expired or ran out, causing errors. Rapid consecutive requests also triggered `429 Too Many Requests`.
  - Resolution: Implemented a workflow to fetch a new token when expired, reset token when all questions were used, and added a small delay (1 second) before each fetch to avoid hitting rate limits.
- **State Management**: : Coordinating multiple state variables while avoiding unnecessary re-renders and stale values.
  - Resolution: Structured `useEffect` with proper dependencies and passed the token explicitly to async fetch functions.
- **Shuffling and Formatting Questions**: API responses needed consistent formatting, and answers had to be shuffled while ensuring React re-renders correctly.
  - Resolution: Created a formatting function that applied `Fisher-Yates shuffle` and mapped the API response into a reusable structure for the component.
- **Check Answers**: Verify selected answers with the correct ones.
  - Resolution: Iterates through all questions, finds the selected answer object, and checks its `isCorrect` property to calculate the score.
- **Refactor**: `Questions.jsx` component was handling too many responsibilities (fetching API data, managing tokens, formatting questions, and rendering UI). Hard to maintain.
  - Resolution: Split API fetching, formatting, and UI into separate api, utils, and reusable components respectively.
  
## 📚 What I Learned
- Managing multiple React states and async operations.
- Managing API tokens, rate limits, and error recovery.
- Formatting and shuffling API data for dynamic UI updates.
- Handling user interactions like “Check Answers” reliably.
- Structuring React components for readability and reusability.

## 💡 Future Improvements

- Difficulty and category filters
- Timer mode

## 🙌 Acknowledgements

- **Scrimba course:** [Scrimba Frontend Developer Career Path](https://scrimba.com/frontend-path-c0j)
- **Design reference:** [Figma by Scrimba](https://www.figma.com/design/E9S5iPcm10f0RIHK8mCqKL/Quizzical-App?node-id=8-448&t=1PTwhDp6TAwDlrhX-0)
