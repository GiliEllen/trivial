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

export async function redirectIfLoggedIn() {
  const user = await getJSON("/api/currentUser");
  const currentWindowLocation = window.location.href;

  if (user && (currentWindowLocation.includes("login.html") || currentWindowLocation.includes("register.html"))) {
    window.location.replace("/");
  }
}

export async function getJSON(path: string) {
  const res = await fetch(path);

  return await res.json();
}