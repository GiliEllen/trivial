async function app() {
  const user = await getJSON("/api/auth/currentUser");

  handleUser(user);
}

// async function app() {
//   const [user, trivia] = await Promise.all([
//     getJSON("/api/auth/currentUser"),
//     getJSON("/api/trivia/:triviaId"),
//   ]);

//   handleUser(user);
// }

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

      const trivia = await response.json();

      window.location.href = `/trivia.html#${trivia._id}`;
    } catch (error) {
      console.error("Error generating trivia:", error);
    }
  });

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

// async function app() {
//   const triviaId = window.location.hash.slice(1);
//   const chapterDetails = await getChapterDetails(chapterId);

//   renderChapterField("content");
//   renderChapterField("title");

//   function renderChapterField(field: keyof typeof chapterDetails) {
//       const fieldElement = document.querySelectorAll(`.chapter-${field}`) as NodeListOf<HTMLElement>;

//       if (!fieldElement) {
//           throw new Error();
//       }

//       fieldElement.forEach((element) => element.innerText = chapterDetails[field].toString());
//   }
// };

// app();
