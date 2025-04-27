export default {
  async fetch(request, env, ctx) {
      const url = new URL(request.url);

      if (url.pathname === '/api/prioritize' && request.method === 'POST') {
	try{
        const { tasks } = await request.json();

        const prompt = `Tengo esta lista de tareas:\n\n${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nOrdena estas tareas por prioridad (de mayor a menor) y justifica por qué. Solo responde con la lista ordenada.`;

        const aiResponse = await env.ai.run("@cf/meta/llama-3-8b-instruct", {
          prompt,
          max_tokens: 500,
        });

        return new Response(JSON.stringify({
          message: "Prioritized by AI",
          result: aiResponse.response
        }), {
          headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
      return new Response(JSON.stringify({
        error: "Internal Error",
        message: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
	return env.ASSETS.fetch(request);
}
};

