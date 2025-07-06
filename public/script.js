const form = document.getElementById("form");
const lista = document.getElementById("lista");

async function zaladujWpisy() {
  const resp = await fetch("/api/wpisy");
  const data = await resp.json();
  lista.innerHTML = data
    .map((w) => `<li>${w.tresc} (${w.created_at})</li>`)
    .join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tresc = form.tresc.value;
  if (!tresc) return;

  await fetch("/api/wpisy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tresc }),
  });

  form.reset();
  await zaladujWpisy();
});

zaladujWpisy();
