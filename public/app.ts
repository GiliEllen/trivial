async function app() {
  const user = await getJSON("/api/currentUser");

  handleUser(user);
  console.log(user)
}

app();

document.getElementById("logoutBtn")?.addEventListener("click", logOut)

function logOut() {
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload()
}

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