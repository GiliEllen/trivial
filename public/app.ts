async function app() {
  const user = await getJSON("/api/currentUser");

  handleUser(user);
}

app();

document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await fetch("/logout", {
      method: "GET",
      credentials: "same-origin",
    });

    console.log("Logout successful");

    new Promise<void>((resolve) => {
      window.location.href = "/logout";
      resolve();
    }).then(() => {
      window.location.reload();
    });

  } catch (error) {
    console.error("An error occurred during logout", error);
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
