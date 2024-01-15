import { getJSON, handleUser, redirect } from "./funcs.js";

async function app() {
  const user = await getJSON("/api/auth/currentUser");

  handleUser(user);
  redirect();
}

app();

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "same-origin",
    });

    new Promise<void>((resolve) => {
      window.location.href = "/api/auth/logout";
      resolve();
    }).then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error("An error occurred during logout", error);
  }
});

document
  .getElementById("newTriviaBtn")
  ?.addEventListener("click", async (e) => {
    e.preventDefault();
    const difficultySelect = document.getElementById(
      "difficulty"
    ) as HTMLSelectElement;
    const topicSelect = document.getElementById("topic") as HTMLSelectElement;

    const difficulty = difficultySelect.value;
    const category = topicSelect.value;

    try {
      const response = await fetch("/api/trivia/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty, category }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate trivia: ${response.statusText}`);
      }

      const trivia = await response.json();

      window.location.href = `/trivia.html#${trivia._id}`;
    } catch (error) {
      console.error("Error generating trivia:", error);
    }
  });