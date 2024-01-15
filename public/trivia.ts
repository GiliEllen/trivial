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

    const trivia = await fetchTrivia(triviaId);

    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers-container");

    if (!questionElement || !answersContainer) {
      throw new Error("HTML elements not found");
    }

    questionElement.innerHTML = trivia.questions[0].question;

    const allAnswers = [trivia.questions[0].correct_answer, ...trivia.questions[0].incorrect_answers];

    shuffleArray(allAnswers);

    allAnswers.forEach((answer: any, index: any) => {
      const button = document.createElement("button");
      button.id = `answer-${String.fromCharCode(97 + index)}-btn`;
      button.innerHTML = `${String.fromCharCode(65 + index)}. <span class="answer">${answer}</span>`;
      answersContainer.appendChild(button);
    });

  } catch (error) {
    console.error("Error fetching and updating trivia:", error);
  }
}

app();