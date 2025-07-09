export default async function handler(req, res) {
  const { offset, limit, chargeId, filters } = req.body;

  const apiResponse = await fetch('https://erir.grfc.ru/deductions-service/v1/private/get_invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ERIR_TOKEN}`
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
    return res.status(apiResponse.status).json({ error: 'API error', detail: data });
  }

  return res.status(200).json(data);
}
