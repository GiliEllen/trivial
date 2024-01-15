import { getJSON } from "./funcs.js";

type Difficulty = "easy" | "medium" | "hard";

type Question = {
  type: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type Trivia = {
  difficulty: Difficulty;
  category: string;
  questions: Question[];
  shareId: string;
};

async function getCurrentUser() {
  const user = await getJSON("/api/auth/currentUser");
  return user;
}

async function fetchTrivia(triviaId: string) {
  try {
    const response = await fetch(`/api/trivia/${triviaId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trivia: ${response.statusText}`);
    }

    const trivia = await response.json();
    return trivia;
  } catch (error) {
    console.error("Error fetching trivia:", error);
    throw error;
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function app() {
  try {
    const triviaId = window.location.hash.substring(1);

    if (!triviaId) {
      throw new Error("Trivia ID not found in the URL");
    }

    const userId = await getCurrentUser();

    const trivia = await fetchTrivia(triviaId);

    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers-container");
    const scoreElement = document.getElementById("score");

    if (!questionElement || !answersContainer || !scoreElement) {
      throw new Error("HTML elements not found");
    }

    let currentQuestionIndex = 0;
    let score = 0;

    function updateUI() {
      questionElement!.innerHTML =
        trivia.questions[currentQuestionIndex].question;

      const allAnswers = [
        trivia.questions[currentQuestionIndex].correct_answer,
        ...trivia.questions[currentQuestionIndex].incorrect_answers,
      ];

      shuffleArray(allAnswers);

      answersContainer!.innerHTML = "";

      allAnswers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.id = `answer-${String.fromCharCode(97 + index)}-btn`;
        button.innerHTML = `${String.fromCharCode(
          65 + index
        )}. <span class="answer">${answer}</span>`;
        button.addEventListener("click", () => handleAnswerClick(answer));
        answersContainer!.appendChild(button);
      });

      scoreElement!.innerHTML = `Score: ${score}`;
    }

    async function handleAnswerClick(selectedAnswer: any) {
      const correctAnswer =
        trivia.questions[currentQuestionIndex].correct_answer;

      if (selectedAnswer === correctAnswer) {
        score += 1;
      }

      currentQuestionIndex += 1;

      if (currentQuestionIndex < trivia.questions.length) {
        updateUI();
      } else {
        try {
          const response = await fetch("/api/updateUserPoints", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId, 
              points: score,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to update user points: ${response.statusText}`
            );
          }

          alert(
            `Game Over! Your final score is ${score}. Points updated successfully!`
          );
          window.location.replace("/");
        } catch (error) {
          console.error("Error updating user points:", error);
        }
      }
    }

    updateUI();
  } catch (error) {
    console.error("Error fetching and updating trivia:", error);
  }
}

app();
