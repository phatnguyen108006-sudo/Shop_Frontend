"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CartPage() {
  const { items, hydrated, removeFromCart, addToCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (!hydrated) return null;

  const shipping = 0;
  const finalTotal = totalPrice + shipping;

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10">
      <section className="luxury-panel luxury-shell mb-8 rounded-[36px] px-6 py-10 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Giỏ hàng riêng của bạn</p>
        <h1 className="luxury-title mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">Những thiết kế bạn đang cân nhắc.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
          Kiểm tra lại lựa chọn trước khi hoàn tất đơn hàng. Mỗi thiết kế sẽ được chuẩn bị chỉn chu trong hộp quà mang dấu ấn atelier.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="luxury-panel flex flex-col items-center justify-center rounded-[32px] px-6 py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(157,122,69,0.12)] text-[var(--accent-deep)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="luxury-title text-3xl text-[var(--foreground)]">Giỏ hàng đang trống.</p>
          <p className="mt-3 max-w-md text-[var(--muted)]">
            Hãy khám phá bộ sưu tập để chọn cho mình một thiết kế phù hợp với phong cách hoặc dịp tặng quà sắp tới.
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-[var(--foreground)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
            href="/shop"
          >
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {items.map((it) => (
              <div key={it.id} className="luxury-panel relative flex gap-4 rounded-[28px] p-4 md:p-5">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-[20px] bg-[rgba(255,250,243,0.7)]">
                  <Image
                    src={it.image && it.image.startsWith("http") ? it.image : "/placeholder.png"}
                    alt={it.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 pr-8">
                      <Link href={`/shop/${it.slug || it.id}`} className="luxury-title line-clamp-2 text-2xl text-[var(--foreground)] hover:text-[var(--accent-deep)]">
                        {it.name}
                      </Link>
                    </div>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Tuyển chọn từ atelier</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--accent-deep)]">{formatVND(it.price)}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-[rgba(255,250,243,0.74)]">
                      <button
                        className="flex h-10 w-10 items-center justify-center text-[var(--muted)] transition-colors hover:bg-[rgba(157,122,69,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={it.quantity <= 1}
                        onClick={() => updateQuantity(it.id, it.quantity - 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      </button>
                      <span className="w-12 text-center text-sm font-semibold text-[var(--foreground)]">{it.quantity}</span>
                      <button
                        className="flex h-10 w-10 items-center justify-center text-[var(--muted)] transition-colors hover:bg-[rgba(157,122,69,0.08)]"
                        onClick={() =>
                          addToCart({
                            id: it.id,
                            name: it.name,
                            price: it.price,
                            image: it.image,
                            slug: it.slug,
                          })
                        }
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-lg font-semibold text-[var(--foreground)]">{formatVND(it.price * it.quantity)}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(it.id)}
                  className="absolute right-4 top-4 rounded-full bg-[rgba(255,250,243,0.9)] p-2 text-[var(--muted)] transition hover:bg-[rgba(157,122,69,0.08)] hover:text-red-500"
                  title="Xóa sản phẩm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <aside className="luxury-panel sticky top-24 h-fit rounded-[32px] p-6">
            <h2 className="luxury-title text-3xl text-[var(--foreground)]">Tóm tắt đơn hàng</h2>

            <div className="mt-6 space-y-3 border-b border-[var(--border-soft)] pb-6 text-[var(--muted)]">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-medium text-[var(--foreground)]">{formatVND(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-[var(--accent-deep)]">Miễn phí</span>
              </div>
            </div>

            <div className="my-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-[var(--foreground)]">Tổng cộng</span>
              <span className="text-3xl font-semibold text-[var(--accent-deep)]">{formatVND(finalTotal)}</span>
            </div>

            <Link href="/checkout" className="block w-full">
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]">
                Tiến hành thanh toán
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </Link>

            <button
              className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-[var(--muted)] transition hover:text-red-600"
              onClick={() => {
                if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                  clearCart();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Xóa toàn bộ giỏ hàng
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
