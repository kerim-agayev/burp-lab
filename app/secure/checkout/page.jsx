import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function SecureCheckout({ searchParams }) {
  const sp = await searchParams;
  const productId = Number(sp.productId ?? 1);
  const attempted = sp.price !== undefined;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  // ✅ TƏHLÜKƏSİZ: qiymət HƏMİŞƏ bazadan götürülür, client-in göndərdiyi "price" nəzərə alınmır.
  const realPrice = product?.price;

  return (
    <main>
      <p><a href="/">← ana səhifə</a> · <a href={`/vuln/checkout?productId=${productId}&price=${realPrice ?? ""}`}>zəif versiya →</a></p>
      <h1>Ödəniş (təhlükəsiz)</h1>
      {product && (
        <>
          <p>Məhsul: <b>{product.name}</b> (bazada qiymət: {product.price})</p>
          <form>
            <input type="hidden" name="productId" value={productId} />
            <p>Göndərdiyin "price" (burada IGNORE olunur): <input name="price" defaultValue={sp.price ?? product.price} /></p>
            <button type="submit">Al</button>
          </form>
        </>
      )}
      {attempted && (
        <pre style={{ background: "#12241e", color: "#8af0b8", padding: 12, borderRadius: 8 }}>
          ✅ Alındı: {product?.name} — ödəniləcək (əsl, bazadan): {realPrice}
        </pre>
      )}
    </main>
  );
}
