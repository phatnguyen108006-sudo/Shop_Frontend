"use client";

import { useState, useEffect } from "react";
import { Star, User, Send } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context"; // Lấy thông tin user đăng nhập

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface Review {
  _id: string;
  userId: { name: string; _id: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth(); // Kiểm tra xem user đã login chưa
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5); // Mặc định 5 sao
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load danh sách đánh giá khi vào trang
  useEffect(() => {
    fetch(`${API_URL}/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setReviews(data.data);
      })
      .catch((err) => console.error(err));
  }, [productId]);

  // Xử lý gửi đánh giá
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Gửi token để xác thực
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();
      if (data.ok) {
        setReviews([data.data, ...reviews]); // Thêm review mới vào đầu danh sách
        setComment(""); // Reset form
        setRating(5);
      } else {
        alert("Lỗi: " + (data.error?.message || "Không thể gửi đánh giá"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-bold mb-6">Đánh giá sản phẩm ({reviews.length})</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* CỘT TRÁI: Form viết đánh giá */}
        <div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="font-bold text-lg mb-4">Viết nhận xét của bạn</h4>
            
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Chọn Sao */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bạn chấm mấy sao?</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nhập nội dung */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung đánh giá</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Sản phẩm dùng tốt không? Chia sẻ ngay..."
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang gửi..." : <>Gửi đánh giá <Send size={16} /></>}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Bạn cần đăng nhập để viết đánh giá.</p>
                <a href="/login" className="text-blue-600 font-bold hover:underline">
                  Đăng nhập ngay
                </a>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: Danh sách Review */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="flex gap-4 p-4 border rounded-xl hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{rev.userId?.name || "Người dùng ẩn danh"}</span>
                    <span className="text-xs text-gray-400">• {new Date(rev.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2" title={`${rev.rating} sao`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={i < rev.rating ? 0 : 1} className={i >= rev.rating ? "text-gray-300" : ""} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}