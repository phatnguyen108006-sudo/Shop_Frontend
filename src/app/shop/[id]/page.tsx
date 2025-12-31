import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { formatVND } from "@/lib/format";
import ProductImageGallery from "@/components/ProductImageGallery"; 
import ProductReviews from "@/components/ProductReviews"; 

// --- CÁC ICON TRANG TRÍ ---
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

// --- FETCH DATA ---
async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/v1/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    
    const json = await res.json();
    return json.data || json; 
  } catch (error) {
    console.error("Lỗi FETCH:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>; // Dùng [slug] hay [id] thì sửa ở đây cho khớp tên file
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) return notFound(); 
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 space-x-2 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-black transition">Trang chủ</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition">Cửa hàng</Link>
          <span>/</span>
          <span className="text-black font-medium truncate">{product.title}</span>
        </nav>

        {/* --- PHẦN 1: CHI TIẾT SẢN PHẨM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 mb-20">
          
          {/* CỘT TRÁI: GALLERY ẢNH */}
          <div className="lg:col-span-7">
            <ProductImageGallery images={product.images} title={product.title} />
          </div>

          {/* CỘT PHẢI: THÔNG TIN */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              
              {/* Header thông tin */}
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wide">
                      {product.category || "Sản phẩm"}
                    </span>
                    {product.brand && (
                      <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-wide">
                        {product.brand}
                      </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-end gap-4">
                  <span className="text-3xl font-bold text-black">
                    {typeof formatVND === 'function' 
                      ? formatVND(product.price) 
                      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                  
                  {isOutOfStock ? (
                      <span className="mb-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        Hết hàng tạm thời
                      </span>
                  ) : (
                      <span className="mb-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Còn {product.stock} sản phẩm
                      </span>
                  )}
                </div>
              </div>

              {/* Mô tả ngắn */}
              <div className="prose prose-sm text-gray-600 leading-relaxed">
                <p>{product.description || "Đang cập nhật mô tả..."}</p>
              </div>

              {/* Nút hành động */}
              <div className="space-y-3 pt-2">
                <AddToCartButton 
                  product={product} 
                  disabled={isOutOfStock} 
                  fullWidth={true}
                  className="h-14 text-lg font-semibold shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-300"
                />

                <Link 
                  href="/shop"
                  className="flex items-center justify-center w-full h-12 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:text-black transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>

                {!isOutOfStock && (
                  <p className="text-center text-xs text-gray-400">
                    Miễn phí vận chuyển cho đơn hàng trên 500k
                  </p>
                )}
              </div>

              {/* Box Cam kết */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
                <div className="flex items-start">
                  <TruckIcon />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Giao hàng nhanh chóng</h4>
                    <p className="text-xs text-gray-500 mt-1">Nhận hàng trong 2-4 ngày làm việc. Freeship nội thành.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldIcon />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Bảo hành chính hãng</h4>
                    <p className="text-xs text-gray-500 mt-1">Cam kết sản phẩm chính hãng 100%. Hoàn tiền nếu phát hiện giả.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Đổi trả dễ dàng</h4>
                    <p className="text-xs text-gray-500 mt-1">Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- PHẦN 2: ĐÁNH GIÁ SẢN PHẨM (MỚI THÊM) --- */}
        <div id="reviews">
          {/* Truyền ID của sản phẩm vào component để nó tự fetch đánh giá */}
          <ProductReviews productId={product._id || product.id} />
        </div>

      </main>
    </div>
  );
}