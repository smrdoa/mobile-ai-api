export default async function handler(req, res) {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const duration = Date.now() - start;
  res.status(200).json({
    message: "✅ Sunucu işlemi tamamlandı",
    durationMs: duration,
    timestamp: new Date().toISOString(),
  });
}

