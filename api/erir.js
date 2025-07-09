export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method Not Allowed' });
  }

  try {
    const erirRes = await fetch('https://erir.grfc.ru/deductions-service/v1/private/get_invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: JSON.stringify(req.body)
    });

    const text = await erirRes.text();
    res.status(erirRes.status).send(text);
  } catch (error) {
    console.error('💥 Ошибка при fetch:', error); // <--- ВОТ ЭТО главное!
    res.status(500).send({ error: 'fetch failed', detail: error.message });
  }
}
