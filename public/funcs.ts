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

    if (!user && !isLoginPage(currentWindowLocation)) {
      window.location.replace("/login.html");
    } else if (user && isLoginPage(currentWindowLocation)) {
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

function isLoginPage(location: string): boolean {
  return (
    location.includes("login.html") || location.includes("register.html")
  );
}