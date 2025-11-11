import { querydb } from "../lib/oracle";

export async function GET() {
  try {
    const usuarios = await querydb('SELECT * FROM TCDB_REGION');
    return Response.json(usuarios);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}