import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { formatVND } from "@/lib/format";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import { apiFetch } from "@/lib/api";

const DetailItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent-deep)]" />
    <div>
      <h4 className="text-sm font-semibold text-[var(--foreground)]">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{desc}</p>
    </div>
  </div>
);

async function getProduct(id: string) {
  try {
    const result: any = await apiFetch(`/products/${id}`, {
      cache: "no-store",
    });

    return result.data || result;
  } catch (error) {
    console.error("Lỗi fetch sản phẩm:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) return notFound();
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <div className="min-h-screen pb-20">
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <nav className="mb-8 flex items-center space-x-2 overflow-hidden whitespace-nowrap text-sm text-[var(--muted)]">
          <Link href="/" className="transition hover:text-[var(--foreground)]">Trang chủ</Link>
          <span>/</span>
          <Link href="/shop" className="transition hover:text-[var(--foreground)]">Bộ sưu tập</Link>
          <span>/</span>
          <span className="truncate font-medium text-[var(--foreground)]">{product.title}</span>
        </nav>

        <div className="mb-20 grid grid-cols-1 gap-10 xl:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductImageGallery images={product.images} title={product.title} />
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-5 border-b border-[var(--border-soft)] pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[rgba(157,122,69,0.12)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--accent-deep)]">
                    {product.category || "Trang sức"}
                  </span>
                  {product.brand && (
                    <span className="rounded-full border border-[var(--border-soft)] bg-[rgba(255,250,243,0.7)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--foreground)]">
                      {product.brand}
                    </span>
                  )}
                </div>

                <h1 className="luxury-title text-4xl font-semibold leading-tight text-[var(--foreground)] md:text-5xl">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-end gap-4">
                  <span className="text-3xl font-semibold text-[var(--accent-deep)]">
                    {typeof formatVND === "function"
                      ? formatVND(product.price)
                      : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </span>

                  {isOutOfStock ? (
                    <span className="mb-1 rounded-full bg-[var(--foreground)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--background)]">
                      Hết hàng tạm thời
                    </span>
                  ) : (
                    <span className="mb-1 rounded-full bg-[rgba(157,122,69,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
                      Còn {product.stock} sản phẩm
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border-soft)] bg-[rgba(255,250,243,0.56)] p-6">
                <p className="text-sm leading-7 text-[var(--foreground)]/80">{product.description || "Mô tả sản phẩm đang được cập nhật."}</p>
              </div>

              <div className="space-y-3 pt-2">
                <AddToCartButton
                  product={product}
                  disabled={isOutOfStock}
                  fullWidth={true}
                  className="h-14 text-sm shadow-[0_20px_50px_rgba(77,53,26,0.12)]"
                />

                <Link
                  href="/shop"
                  className="flex h-12 w-full items-center justify-center rounded-full border border-[var(--border-strong)] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition-colors hover:bg-[rgba(157,122,69,0.08)]"
                >
                  Tiếp tục mua sắm
                </Link>

                {!isOutOfStock && (
                  <p className="text-center text-xs text-[var(--muted)]">
                    Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                  </p>
                )}
              </div>

              <div className="luxury-panel rounded-[28px] p-6 space-y-5">
                <DetailItem title="Giao hàng nhanh chóng" desc="Đơn hàng được đóng gói cẩn thận và giao trong 2-4 ngày làm việc tùy khu vực." />
                <DetailItem title="Bảo hành chính hãng" desc="Thông tin chất liệu minh bạch, hỗ trợ bảo hành và chăm sóc theo chính sách của atelier." />
                <DetailItem title="Đổi trả dễ dàng" desc="Hỗ trợ đổi trả trong thời gian quy định nếu sản phẩm phát sinh lỗi từ nhà sản xuất." />
              </div>
            </div>
          </div>
        </div>

        <div id="reviews">
          <ProductReviews productId={product._id || product.id} />
        </div>
      </main>
    </div>
  );
}
