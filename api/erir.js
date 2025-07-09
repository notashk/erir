export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    const { offset, limit, chargeId, filters } = req.body;

    const token = process.env.ERIR_TOKEN;

    if (!token) {
      console.error('❌ ERIR_TOKEN not found in env');
      return res.status(500).json({ error: 'ERIR_TOKEN missing' });
    }

    console.log('📦 Параметры запроса:', { offset, limit, chargeId, filters });

    const apiResponse = await fetch('https://erir.grfc.ru/deductions-service/v1/private/get_invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        offset,
        limit,
        chargeId,
        filters
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('🔴 Ошибка от API:', data);
      return res.status(apiResponse.status).json({ error: 'API error', detail: data });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error('💥 INTERNAL ERROR:', e);
    return res.status(500).json({ error: 'Internal server error', detail: e.message });
  }
}
