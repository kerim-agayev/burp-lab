export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: xəta detalları yalnız server konsoluna yazılır (console.error),
// client-ə isə HEÇ VAXT daxili mesaj/stack göndərilmir — sadəcə ümumi mesaj.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idRaw = searchParams.get("id");
  const id = Number(idRaw);

  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`Invalid account id: "${idRaw}"`);
    }
    return Response.json({ accountId: id, balance: 1000 });
  } catch (err) {
    console.error("secure/account error:", err); // real detallar yalnız server loqunda
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
