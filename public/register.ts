import { redirect, togglePassword } from "./funcs.js";

document.forms.namedItem("register")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(e.target as HTMLFormElement);
    const body = JSON.stringify({
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    });
  
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": body.length.toString(),
      },
    });
  
    if (res.status >= 400) {
      throw new Error();
    }
  
    window.location.replace("/");
  } catch (error) {
    console.error(error)
  }
});

togglePassword("register");
redirect()
