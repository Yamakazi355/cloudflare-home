export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const form = await request.formData();
        const tresc = form.get("tresc");

        if (!tresc) {
          return new Response("Brak treści wpisu", { status: 400 });
        }

        await env.DB.prepare("INSERT INTO wpisy (tresc) VALUES (?)").bind(tresc).run();

        return new Response(
          `<p>Wpis zapisany! <a href="/">Wróć</a></p>`,
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      } catch (e) {
        return new Response("Błąd podczas zapisu: " + e.message, { status: 500 });
      }
    }

    // GET - wyświetlanie wpisów
    try {
      const { results } = await env.DB.prepare("SELECT * FROM wpisy ORDER BY created_at DESC").all();
      const lista = results.map(w => `<li>${w.tresc} (${w.created_at})</li>`).join("");

      return new Response(
        `
        <h1>Moje wpisy</h1>
        <form method="POST">
          <input name="tresc" placeholder="Wpisz coś..." required />
          <button type="submit">Dodaj</button>
        </form>
        <ul>${lista}</ul>
        `,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    } catch (e) {
      return new Response("Błąd podczas ładowania wpisów: " + e.message, { status: 500 });
    }
  }
};
