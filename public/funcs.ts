export function togglePassword(formName: string): void {
  document.getElementById("toggle-password")?.addEventListener("click", (e) => {
    const input = document.forms
      .namedItem(formName)
      ?.elements.namedItem("password") as HTMLInputElement | null;

    if (!input) {
      throw new Error();
    }

    input.type = input.type === "password" ? "text" : "password";
    (e.target as HTMLSpanElement).innerText =
      input.type === "password" ? "Show" : "Hide";
  });
}

export async function redirect() {
  try {
    const user = await getJSON("/api/auth/currentUser");
    const currentWindowLocation = window.location.href;

    if (!user && !isEntryPage(currentWindowLocation)) {
      window.location.replace("/login.html");
    } else if (user && isEntryPage(currentWindowLocation)) {
      window.location.replace("/");
    }
  } catch (error) {
    console.error("Error during redirect:", error);
  }
}

export async function getJSON(path: string) {
  const res = await fetch(path);
  return await res.json();
}

function isEntryPage(location: string): boolean {
  return location.includes("login.html") || location.includes("register.html");
}

export function handleUser(user: any) {
  if (!user) {
    return;
  }

  document.body.classList.add("logged-in");
  document.getElementById("username")!.textContent = user.username;
  document.getElementById("points")!.textContent = user.points;
}

export function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
export async function getCurrentUser() {
  const user = await getJSON("/api/auth/currentUser");
  return user;
}
export async function fetchTrivia(triviaId: string) {
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
