import { giftState, resetGift } from "../../../lib/race";

export const dynamic = "force-dynamic";

// ⚠️ ZƏİF (race condition): "istifadə olunub?" yoxlaması ilə "istifadə olundu" işarəsi
// arasında bir GECİKMƏ (TOCTOU boşluğu) var. Paralel göndərilən sorğular hamısı
// yoxlamadan "keçə bilir", çünki heç biri hələ işarəni qoymayıb.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (body.code !== "WELCOME10") {
    return Response.json({ error: "Yanlış kod" }, { status: 400 });
  }

  // 1) YOXLAMA
  if (giftState.vuln.redeemed) {
    return Response.json({ error: "Bu kod artıq istifadə olunub" }, { status: 400 });
  }

  // Serverin "DB-ni yoxlayıb yazma" arasında sərf etdiyi real vaxtı simulyasiya edir.
  await new Promise((r) => setTimeout(r, 300));

  // 2) İŞARƏ QOYMA (yoxlamadan xeyli sonra — boşluq elə budur)
  giftState.vuln.redeemed = true;
  giftState.vuln.balance += 10;

  return Response.json({ ok: true, balance: giftState.vuln.balance });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("reset") === "1") {
    resetGift("vuln");
    return new Response("Sıfırlandı.\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(
    `Hədiyyə kodu: WELCOME10 (bir dəfəlik, +10 AZN)\nCari balans: ${giftState.vuln.balance} AZN\nRedeemed: ${giftState.vuln.redeemed}\n\nPOST JSON body: {"code":"WELCOME10"}\nSıfırla: /vuln/redeem?reset=1\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
