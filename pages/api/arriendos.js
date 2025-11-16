import { querydb } from "@/database/oracle";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const results = await querydb(`SELECT a.id_arriendo,i.tipo_inmueble,a.tipo_arriendo,a.titulo,TO_CHAR(a.precio, '$999,999') as "PRECIO", i.num_habitaciones, i.num_banios, a.imagen_portada,d.calle||' '||d.numero as "DIRECCION" 
                                    FROM TCDB_ARRIENDO a JOIN TCDB_INMUEBLE i ON(i.id_inmueble = a.id_inmueble)
                                    JOIN TCDB_DIRECCION d ON (d.id_direccion = i.id_direccion)`);
    return res.json({results});

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    return res.json({ error: error.message }, { status: 500 });
  }
}

