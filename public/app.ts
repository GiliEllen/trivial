async function app() {
  const user = await getJSON("/api/auth/currentUser");

  handleUser(user);
}

app();

document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();

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

      // Handle the generated trivia data as needed
      const trivia = await response.json();
      console.log("Generated trivia:", trivia);
    } catch (error) {
      console.error("Error generating trivia:", error);
    }
  });

//   try {
// const difficultySelect = document.getElementById("difficulty") as HTMLSelectElement;
// const topicSelect = document.getElementById("topic") as HTMLSelectElement;

// const difficulty = difficultySelect.value;
// const category = topicSelect.value;

//     // Fetch new trivia based on user's selection
//     const response = await fetch(`/api/trivia/${category}/${difficulty}`, {
//       method: "GET",
//       credentials: "same-origin",
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch new trivia: ${response.statusText}`);
//     }

//     // Handle the fetched trivia data as needed
//     console.log("Fetched new trivia successfully");

//   } catch (error) {
//     console.error("An error occurred when trying to fetch new trivia", error);
//   }
// });

function handleUser(user: any) {
  if (!user) {
    document.getElementById("username")!.textContent = "guest";
    return;
  }

  document.body.classList.add("logged-in");
  document.getElementById("username")!.textContent = user.username;
}

async function getJSON(path: string) {
  const res = await fetch(path);

  return await res.json();
}
