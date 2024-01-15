import { getCurrentUser, fetchTrivia, shuffleArray } from "./funcs.js";

async function app() {
  try {
    const triviaId = window.location.hash.substring(1);

    if (!triviaId) {
      throw new Error("Trivia ID not found in the URL");
    }

    const userId = await getCurrentUser();

    const trivia = await fetchTrivia(triviaId);

    const gameTitle = document.getElementById("game-title");
    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers-container");
    const scoreElement = document.getElementById("score");

    if (!gameTitle || !questionElement || !answersContainer || !scoreElement) {
      throw new Error("HTML elements not found");
    }

    gameTitle.textContent = `${trivia.difficulty} ${trivia.category} Trivia`;

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
        )}. <span class="answer centered-flex">${answer}</span>`;
        button.addEventListener("click", () => handleAnswerClick(answer));
        answersContainer!.appendChild(button);
      });

      scoreElement!.innerHTML = `Score: ${score}`;
    }

    async function handleAnswerClick(selectedAnswer: string) {
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
          const response = await fetch("/api/users/updateUserPoints", {
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
