"use client";

import { useState, useEffect } from "react";
import { Star, User, Send } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { apiFetch } from "@/lib/api";

interface Review {
  _id: string;
  userId: { name: string; _id: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/reviews/${productId}`)
      .then((data: any) => {
        if (data.ok) setReviews(data.data);
      })
      .catch((err) => console.error("Lỗi tải đánh giá:", err));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data: any = await apiFetch("/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (data.ok) {
        setReviews([data.data, ...reviews]);
        setComment("");
        setRating(5);
        alert("Cảm ơn bạn đã để lại đánh giá.");
      }
    } catch (error: any) {
      console.error(error);
      alert("Lỗi: " + (error.message || "Không thể gửi đánh giá"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-[var(--border-soft)] pt-10">
      <h3 className="luxury-title mb-6 text-3xl text-[var(--foreground)]">Đánh giá từ khách hàng ({reviews.length})</h3>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="luxury-panel rounded-[28px] p-6">
            <h4 className="text-lg font-semibold text-[var(--foreground)]">Chia sẻ cảm nhận của bạn</h4>

            {user ? (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Bạn chấm bao nhiêu sao?</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors ${star <= rating ? "text-[var(--accent-deep)]" : "text-gray-300"}`}
                      >
                        <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Nội dung đánh giá</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hãy chia sẻ cảm nhận của bạn về thiết kế, độ hoàn thiện và trải nghiệm khi đeo..."
                    className="w-full rounded-[20px] border border-[var(--border-soft)] bg-[rgba(255,250,243,0.7)] p-4 outline-none focus:border-[var(--border-strong)]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--background)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:opacity-50"
                >
                  {isSubmitting ? "Đang gửi..." : <>Gửi đánh giá <Send size={16} /></>}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center">
                <p className="mb-3 text-[var(--muted)]">Bạn cần đăng nhập để viết đánh giá.</p>
                <a href="/login" className="font-semibold text-[var(--accent-deep)] hover:underline">
                  Đăng nhập ngay
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="max-h-[560px] space-y-6 overflow-y-auto pr-2">
          {reviews.length === 0 ? (
            <p className="italic text-[var(--muted)]">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="luxury-panel flex gap-4 rounded-[24px] p-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(157,122,69,0.12)]">
                  <User size={20} className="text-[var(--accent-deep)]" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--foreground)]">{rev.userId?.name || "Khách ẩn danh"}</span>
                    <span className="text-xs text-[var(--muted)]">• {new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="mb-2 flex text-[var(--accent-deep)]" title={`${rev.rating} sao`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? "currentColor" : "none"}
                        strokeWidth={i < rev.rating ? 0 : 1}
                        className={i >= rev.rating ? "text-gray-300" : ""}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-[var(--foreground)]/80">{rev.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
