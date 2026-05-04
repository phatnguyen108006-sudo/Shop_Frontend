import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";

interface ApiResponse {
  ok: boolean;
  data: Product[];
  page: number;
  total: number;
  hasNext: boolean;
}

const LIMIT = 12;

type SearchParams = Promise<{
  page?: string;
  q?: string;
}>;

function makePageHref(page: number, qParam: string) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (qParam) {
    params.set("q", qParam);
  }

  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const pageParam = Math.max(parseInt(resolvedSearchParams.page || "1", 10), 1);
  const qParam = resolvedSearchParams.q?.trim() || "";

  const params = new URLSearchParams({
    page: String(pageParam),
    limit: String(LIMIT),
  });

  if (qParam) {
    params.set("q", qParam);
  }

  let data: ApiResponse | null = null;
  let errorMsg = "";

  try {
    data = await apiFetch<ApiResponse>(`/products?${params.toString()}`);
  } catch (error) {
    errorMsg = error instanceof Error ? error.message : "Không tải được dữ liệu";
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="luxury-panel luxury-shell mb-8 rounded-[36px] px-6 py-10 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--accent-deep)]">Nhà tuyển chọn trang sức</p>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="luxury-title text-4xl font-semibold text-[var(--foreground)] md:text-6xl">
              Bộ sưu tập dành cho nét đẹp thanh lịch.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] md:text-base">
              Khám phá nhẫn, dây chuyền và vòng tay được chọn lọc theo gu sang trọng hiện đại, tối ưu cho việc tặng quà và sử dụng hằng ngày.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--border-soft)] bg-[rgba(255,250,243,0.62)] px-5 py-4 text-sm text-[var(--muted)]">
            {qParam ? (
              <p>
                Kết quả tìm kiếm cho <span className="font-semibold text-[var(--foreground)]">"{qParam}"</span>
              </p>
            ) : (
              <p>Tất cả thiết kế hiện có tại atelier</p>
            )}
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Sản phẩm nổi bật</h2>
        {qParam && <p className="text-sm text-[var(--muted)]">Đang lọc theo từ khóa tìm kiếm</p>}
      </div>

      {errorMsg && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-red-600">
          Lỗi: {errorMsg}. Vui lòng thử lại sau.
        </div>
      )}

      {!errorMsg && data && data.data.length === 0 && (
        <div className="py-16 text-center text-[var(--muted)]">
          <p className="luxury-title text-3xl text-[var(--foreground)]">Không tìm thấy thiết kế phù hợp.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm uppercase tracking-[0.25em] text-[var(--accent-deep)] hover:opacity-80">
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}

      {!errorMsg && data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {data.data.map((product, index) => (
            <ProductCard key={product._id || product.id || index} product={product} />
          ))}
        </div>
      )}

      {!errorMsg && data && (data.page > 1 || data.hasNext) && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={makePageHref(Math.max(pageParam - 1, 1), qParam)}
            aria-disabled={pageParam <= 1}
            className={`h-11 rounded-full border px-5 text-sm uppercase tracking-[0.2em] inline-flex items-center ${
              pageParam <= 1
                ? "pointer-events-none cursor-not-allowed border-[var(--border-soft)] text-[var(--muted)] opacity-50"
                : "border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[rgba(157,122,69,0.08)]"
            }`}
          >
            Trang trước
          </Link>
          <span className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Trang {data.page}</span>
          <Link
            href={makePageHref(data.page + 1, qParam)}
            aria-disabled={!data.hasNext}
            className={`h-11 rounded-full border px-5 text-sm uppercase tracking-[0.2em] inline-flex items-center ${
              !data.hasNext
                ? "pointer-events-none cursor-not-allowed border-[var(--border-soft)] text-[var(--muted)] opacity-50"
                : "border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[rgba(157,122,69,0.08)]"
            }`}
          >
            Trang sau
          </Link>
        </div>
      )}
    </main>
  );
}
