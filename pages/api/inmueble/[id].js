export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id } = req.query
    res.status(200).json({ mensaje: id });

  } catch (error) {
    console.error("❌ Error al conectar a Oracle:", error);
    res.status(500).json({ error: error.message });
  }
}