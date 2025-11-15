export default function handler(req, res) {
  if (req.method === "POST") {
    //console.log("Datos recibidos:", req.body);

    return res.status(200).json({
      mensaje: "OK",
      recibido: req.body,
    });
  }

  return res.status(200).json({ mensaje: "API funcionando" });
}


