export const dynamic = "force-dynamic";

// ⚠️ ZƏİF: xəta baş verəndə server DAXİLİ məlumatları (stack trace, "DB" bağlantı sətri)
// birbaşa client-ə JSON kimi qaytarır. Bu, Information disclosure-dur.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idRaw = searchParams.get("id");
  const id = Number(idRaw);

  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        `Invalid account id: "${idRaw}". DB lookup failed on connection ` +
          `postgres://burpapp:S3cretPass!@ep-internal-db.neon.tech:5432/burplab ` +
          `at /var/task/lib/db.js:12:9`
      );
    }
    return Response.json({ accountId: id, balance: 1000 });
  } catch (err) {
    return Response.json(
      { error: err.message, stack: err.stack },
      { status: 400 }
    );
  }
}
