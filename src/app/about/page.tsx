import Image from 'next/image';
import Link from 'next/link';
// Import các icon từ thư viện bạn chọn, ví dụ lucide-react
import { PackageCheck, Truck, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Về chúng tôi - BTCK | Nơi mua sắm tin cậy',
  description: 'Tìm hiểu về câu chuyện và cam kết chất lượng của BTCK.',
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* 1. Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center bg-gray-900 text-white">
        {/* Gợi ý: Thay bằng ảnh thật của shop làm nền */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-80"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Câu Chuyện Về BTCK</h1>
          <p className="text-xl md:text-2xl font-light">Nơi thời trang gặp gỡ sự tiện dụng và an tâm.</p>
        </div>
      </section>

      {/* 2. Story Section (Ảnh bên phải, chữ bên trái) */}
      <section className="container mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Khởi đầu từ sự thấu hiểu</h2>
            <p className="text-gray-600 leading-relaxed">
              Chào bạn, BTCK được thành lập với một niềm tin đơn giản: Mua sắm online không nên là một trò may rủi.
              Chúng tôi hiểu cảm giác thất vọng khi nhận được món hàng không như ý.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Tại BTCK, chúng tôi không chỉ bán sản phẩm, chúng tôi bán sự an tâm. Từ chiếc quần trendy đến đôi dép tổ ong bền bỉ, tất cả đều được tuyển chọn kỹ lưỡng để đảm bảo hình ảnh bạn thấy là thứ bạn nhận được.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
            {/* SỬA TẠI ĐÂY: Dùng thẻ img thường thay vì Image của Next.js */}
           <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" // Đây là link ảnh mẫu văn phòng đẹp (đuôi jpg)
              alt="Góc làm việc tại BTCK"
              className="w-full h-full object-cover" // Class này giúp ảnh phủ kín khung
            />
            </div>
        </div>
      </section>

      {/* 3. Cam kết Section (3 cột) */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Tại sao bạn nên chọn BTCK?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cam kết 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                <PackageCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ảnh Thật, Giá Trị Thật</h3>
              <p className="text-gray-600">Cam kết hình ảnh sản phẩm là chân thực 100%. Mô tả rõ ràng, không gây hiểu lầm.</p>
            </div>
            {/* Cam kết 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Xử Lý Thần Tốc</h3>
              <p className="text-gray-600">Tối ưu quy trình để đóng gói và giao cho đơn vị vận chuyển nhanh nhất có thể.</p>
            </div>
            {/* Cam kết 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-full mb-4">
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ Trợ Tận Tâm</h3>
              <p className="text-gray-600">Tư vấn size nhiệt tình. Đổi trả linh hoạt và nhanh chóng nếu có lỗi sản phẩm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action Cuối trang */}
      <section className="py-16 text-center px-4">
        <h2 className="text-2xl font-bold mb-6">Sẵn sàng trải nghiệm sự khác biệt?</h2>
        <Link href="/shop">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
            Khám phá Cửa hàng ngay
          </button>
        </Link>
      </section>
    </main>
  );
}