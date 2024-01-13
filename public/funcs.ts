export function togglePassword(formName: string): void {
    document.getElementById("toggle-password")?.addEventListener("click", (e) => {
        const input = document.forms.namedItem(formName)?.elements.namedItem("password") as HTMLInputElement | null;
  
        if (!input) {
            throw new Error();
        }
  
        input.type = input.type === "password" ? "text" : "password";
        (e.target as HTMLSpanElement).innerText = input.type === "password" ? "Show" : "Hide";
    });
  }
  