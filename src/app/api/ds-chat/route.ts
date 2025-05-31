const ENDPOINT = 'https://api.deepseek.com/chat/completions';
const API_KEY = process.env.DS_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get('question');

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'Content-Encoding': 'utf-8',
    },
    body: JSON.stringify({
      stream: true,
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: question }],
    }),
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
