import { giftState, resetGift } from "../../../lib/race";

export const dynamic = "force-dynamic";

// ✅ TƏHLÜKƏSİZ: yoxlama VƏ işarə qoyma eyni sinxron addımda (heç bir `await`-dən əvvəl)
// baş verir. Node.js tək-thread-li olduğu üçün bu iki sətir arasına başqa sorğu girə bilmir —
// TOCTOU boşluğu YOXDUR.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (body.code !== "WELCOME10") {
    return Response.json({ error: "Yanlış kod" }, { status: 400 });
  }

  // YOXLA + İŞARƏ QOY — arada heç nə yoxdur, atomic blok
  if (giftState.secure.redeemed) {
    return Response.json({ error: "Bu kod artıq istifadə olunub" }, { status: 400 });
  }
  giftState.secure.redeemed = true;

  // Gecikmə indi, işarə artıq qoyulandan SONRA gəlir — başqa sorğuya təsiri yoxdur.
  await new Promise((r) => setTimeout(r, 300));
  giftState.secure.balance += 10;

  return Response.json({ ok: true, balance: giftState.secure.balance });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("reset") === "1") {
    resetGift("secure");
    return new Response("Sıfırlandı.\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(
    `Hədiyyə kodu: WELCOME10 (bir dəfəlik, +10 AZN)\nCari balans: ${giftState.secure.balance} AZN\nRedeemed: ${giftState.secure.redeemed}\n\nPOST JSON body: {"code":"WELCOME10"}\nSıfırla: /secure/redeem?reset=1\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
