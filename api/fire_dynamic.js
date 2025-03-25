export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { aimX, aimY, targetX, targetY, clientTimestamp, distribution } = req.body;

  if (
    aimX === undefined ||
    aimY === undefined ||
    targetX === undefined ||
    targetY === undefined ||
    clientTimestamp === undefined ||
    distribution === undefined
  ) {
    return res.status(400).json({ error: 'Eksik veri gönderildi.' });
  }

  const serverTimestamp = Date.now();
  const latency = serverTimestamp - clientTimestamp;

  // 1. Cihaz tarafı yükü: sadece hedefi hesaplamış gibi düşün (simülasyon)
  const deviceLoadRatio = distribution.device; // örn: 0.3
  const cloudLoadRatio = distribution.cloud;   // örn: 0.7

  // 2. Doğruluk payını yük oranlarına göre değiştir
  const baseDistance = Math.sqrt(Math.pow(aimX - targetX, 2) + Math.pow(aimY - targetY, 2));
  const distanceFactor = baseDistance * 10;

  // Hibrit doğruluk hesaplama
  const accuracy = Math.max(0, 100 - (distanceFactor * cloudLoadRatio));
  const hit = accuracy >= 75 && latency <= 200;

  // 3. Performans skoru: doğruluk yüksek + gecikme düşük = iyi skor
  const score = (accuracy * 0.7) - (latency * 0.3);

  return res.status(200).json({
    latency,
    accuracy: parseFloat(accuracy.toFixed(2)),
    decision: hit ? "ISABET ETTİ" : "KAÇTI",
    score: parseFloat(score.toFixed(2)),
    usedDistribution: {
      device: deviceLoadRatio,
      cloud: cloudLoadRatio,
    },
  });
}
