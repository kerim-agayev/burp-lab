import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function VulnCheckout({ searchParams }) {
  const sp = await searchParams;
  const productId = Number(sp.productId ?? 1);
  // ⚠️ ZƏİF: qiymət müştərinin öz göndərdiyi dəyərdən götürülür (forma/URL-dən),
  // bazadan yox. ponytail: bilərəkdən — business logic dərsi üçün.
  const price = sp.price ?? null;

  const product = await prisma.product.findUnique({ where: { id: productId } });

  return (
    <main>
      <p><a href="/">← ana səhifə</a> · <a href={`/secure/checkout?productId=${productId}&price=${product?.price ?? ""}`}>təhlükəsiz versiya →</a></p>
      <h1>Ödəniş (zəif — Business logic)</h1>
      {product && (
        <>
          <p>Məhsul: <b>{product.name}</b> (bazada qiymət: {product.price})</p>
          <form>
            <input type="hidden" name="productId" value={productId} />
            <p>Ödəniləcək qiymət (dəyişə bilərsən!): <input name="price" defaultValue={price ?? product.price} /></p>
            <button type="submit">Al</button>
          </form>
        </>
      )}
      {price !== null && (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
          ✅ Alındı: {product?.name} — ödənilən: {price}
        </pre>
      )}
    </main>
  );
}
