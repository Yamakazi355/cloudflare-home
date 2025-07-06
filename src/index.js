export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/wpisy") {
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM wpisy ORDER BY created_at DESC"
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });
      }

      if (request.method === "POST") {
        try {
          const data = await request.json();
          if (!data.tresc) {
            return new Response("Brak treści wpisu", { status: 400 });
          }
          await env.DB
            .prepare("INSERT INTO wpisy (tresc) VALUES (?)")
            .bind(data.tresc)
            .run();
          return new Response(
            JSON.stringify({ message: "Wpis zapisany" }),
            { headers: { "Content-Type": "application/json;charset=utf-8" } }
          );
        } catch (e) {
          return new Response("Błąd podczas zapisu: " + e.message, {
            status: 500,
          });
        }
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
