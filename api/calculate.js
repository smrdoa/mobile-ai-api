// api/calculate.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { samples } = req.body;

  if (!samples || !Array.isArray(samples)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const n = samples.length;
  const average = samples.reduce((a, b) => a + b, 0) / n;
  const variance = samples.reduce((a, b) => a + Math.pow(b - average, 2), 0) / n;
  const min = Math.min(...samples);
  const max = Math.max(...samples);

  return res.status(200).json({
    average: parseFloat(average.toFixed(2)),
    variance: parseFloat(variance.toFixed(2)),
    min,
    max,
    status: "ok"
  });
}
