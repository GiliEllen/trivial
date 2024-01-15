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
    console.log("Fetched trivia:", trivia);
    return trivia;
  } catch (error) {
    console.error("Error fetching trivia:", error);
    throw error;
  }
}

async function app() {
  try {
    const triviaId = window.location.hash.substring(1);

    if (!triviaId) {
      throw new Error("Trivia ID not found in the URL");
    }

    const trivia = await fetchTrivia(triviaId);
  } catch (error) {
    console.error("Error fetching trivia:", error);
  }
}

app();

// async function getTrivia(triviaId: string): Promise<Trivia> {
//   const res = await fetch(`/api/trivia/${triviaId}`);

//   return res.json();
// }


// const triviaId = getTrivia();

// fetchTrivia(triviaId)
//   .then((trivia) => {
//     console.log(trivia);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// export function renderChapters(chapters: any, amount: number) {
//   const latestsChapters = document.getElementById("chapters-list");

//   if (!latestsChapters) {
//     throw new Error("Couldn't find chapters-list");
//   }

//   latestsChapters.innerHTML = chapters
//     .slice(0, amount)
//     .map(
//       (chapter: any) => `<li class="chapter">
//         <a class="chapterLi" href="/chapter-details.html#${chapter._id}">${
//         chapter.title
//       } (${chapter.author})</a>
//       <time datetime="${chapter.timePosted}">${new Date(
//         chapter.timePosted
//       ).toLocaleString("en-gb")}</time>
//       </li>`
//     )
//     .join("\n");
// }
