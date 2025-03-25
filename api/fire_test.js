export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { aimX, aimY, targetX, targetY, clientTimestamp } = req.body;

  if (
    aimX === undefined ||
    aimY === undefined ||
    targetX === undefined ||
    targetY === undefined ||
    clientTimestamp === undefined
  ) {
    return res.status(400).json({ error: 'Eksik veri gönderildi.' });
  }

  const serverTimestamp = Date.now();
  const latency = serverTimestamp - clientTimestamp;

  // Vuruş hassasiyetini hesapla (basit öklid mesafesi simülasyonu)
  const distance = Math.sqrt(Math.pow(aimX - targetX, 2) + Math.pow(aimY - targetY, 2));
  const accuracy = Math.max(0, 100 - distance * 10); // 0-100 arası bir doğruluk yüzdesi
  const hit = accuracy >= 75 && latency <= 200; // 200ms altında ve %75 doğruluk varsa isabet

  return res.status(200).json({
    accuracy: parseFloat(accuracy.toFixed(2)),
    latency,
    decision: hit ? "ISABET ETTİ" : "KAÇTI",
    serverTimestamp,
  });
}



