export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const targetUrl = 'https://erir.grfc.ru/deductions-service/v1/private/get_invoices';
  const token = process.env.ERIR_TOKEN;

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await upstreamResponse.text();
    const isJson = upstreamResponse.headers.get('content-type')?.includes('application/json');

    if (!upstreamResponse.ok) {
      console.error('Ошибка от API:', upstreamResponse.status, text);
      return res.status(upstreamResponse.status).json({
        error: 'Ошибка от API',
        detail: isJson ? JSON.parse(text) : text
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(isJson ? text : JSON.stringify({ raw: text }));
  } catch (error) {
    console.error('Ошибка запроса к ERIR API:', error.message);
    return res.status(500).json({ error: 'fetch failed', detail: error.message });
  }
}
