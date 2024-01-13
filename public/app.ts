async function app() {
  const user = await getJSON("/api/currentUser");

  handleUser(user);
}

app();

document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
  e.preventDefault();

  document.cookie = "userId=; Max-Age=0; path=/; Secure; HttpOnly;";
  window.location.reload();
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
