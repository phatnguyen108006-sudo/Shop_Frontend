import Link from "next/link";
import { Gem, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Về chúng tôi - Trang Sức",
  description: "Tìm hiểu câu chuyện, triết lý tuyển chọn và dịch vụ của Trang Sức.",
};

export default function AboutPage() {
  return (
    <main className="pb-12">
      <section className="mx-auto mt-4 max-w-7xl px-4 sm:mt-8">
        <div className="luxury-panel luxury-shell rounded-[40px] px-6 py-14 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--accent-deep)]">Câu chuyện thương hiệu</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="luxury-title text-5xl font-semibold leading-none text-[var(--foreground)] md:text-7xl">
                Chúng tôi tin vẻ đẹp sang trọng nên được cảm nhận một cách tự nhiên.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
                Trang Sức ra đời từ mong muốn tạo nên một không gian tuyển chọn trang sức nơi mỗi thiết kế không chỉ đẹp, mà còn phù hợp với nhịp sống thanh lịch hiện đại.
              </p>
            </div>
            <div className="rounded-[32px] border border-[var(--border-soft)] bg-[rgba(255,250,243,0.56)] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-deep)]">Tuyên ngôn</p>
              <p className="luxury-title mt-4 text-3xl text-[var(--foreground)]">
                Một món trang sức đẹp không chỉ để ngắm, mà để đồng hành cùng những khoảnh khắc đáng nhớ.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="luxury-panel rounded-[36px] p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[var(--accent-deep)]">Khởi đầu từ sự chọn lọc</p>
            <h2 className="luxury-title mt-4 text-4xl text-[var(--foreground)] md:text-5xl">
              Mỗi thiết kế đều được cân nhắc để giữ được vẻ đẹp lâu dài.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              Chúng tôi ưu tiên những kiểu dáng có tỉ lệ hài hòa, chất liệu hoàn thiện tốt và khả năng đeo lâu dài mà vẫn giữ được cá tính riêng.
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              Từ một món quà kỷ niệm cho đến thiết kế đồng hành hằng ngày, Trang Sức hướng đến cảm giác tinh tế, vừa đủ nổi bật nhưng không phô trương.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <ValueCard icon={<Gem size={26} />} title="Tuyển chọn kỹ lưỡng" desc="Mỗi mẫu đều được cân nhắc về độ sáng, chất liệu và khả năng phối." />
            <ValueCard icon={<ShieldCheck size={26} />} title="Minh bạch" desc="Thông tin về sản phẩm, bảo hành và dịch vụ được trình bày rõ ràng." />
            <ValueCard icon={<Sparkles size={26} />} title="Tinh tế" desc="Trải nghiệm mua sắm riêng tư, chỉn chu và phù hợp với nhiều dịp đặc biệt." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <InfoCard
            id="size-guide"
            title="Tư vấn kích cỡ"
            desc="Nhẫn và vòng tay được đo theo chu vi để đeo vừa vặn. Nếu bạn chưa chắc kích cỡ, hãy đặt lịch để được hướng dẫn đo size trực tiếp."
            actionHref="/register"
            actionLabel="Đặt lịch tư vấn"
          />
          <InfoCard
            id="return-policy"
            title="Chính sách đổi trả"
            desc="Sản phẩm được hỗ trợ đổi trong 7 ngày nếu chưa qua sử dụng và còn đầy đủ hộp, thẻ bảo hành cùng hóa đơn."
            actionHref="/orders"
            actionLabel="Theo dõi đơn"
          />
          <InfoCard
            id="warranty-care"
            title="Bảo hành và chăm sóc"
            desc="Atelier hỗ trợ vệ sinh, đánh bóng và kiểm tra ngóng đá định kỳ. Khách có thể liên hệ trước qua email hoặc điện thoại."
            actionHref="mailto:concierge@btck.vn"
            actionLabel="Gửi yêu cầu"
          />
          <InfoCard
            id="terms"
            title="Điều khoản"
            desc="Thông tin giá, tồn kho và lịch hẹn có thể thay đổi theo từng thời điểm. Đơn hàng được xác nhận sau khi nhận phản hồi từ hệ thống."
            actionHref="/shop"
            actionLabel="Xem bộ sưu tập"
          />
          <InfoCard
            id="privacy"
            title="Bảo mật"
            desc="Dữ liệu liên hệ và lịch sử đặt hàng chỉ được dùng để xử lý giao dịch, chăm sóc khách hàng và gửi thông tin khi bạn đồng ý."
            actionHref="mailto:concierge@btck.vn?subject=Yeu%20cau%20bao%20mat%20thong%20tin"
            actionLabel="Liên hệ bảo mật"
          />
          <InfoCard
            id="cookies"
            title="Cookie"
            desc="Trang sử dụng cookie cần thiết để ghi nhớ phiên đăng nhập, giỏ hàng và cài đặt giao diện nhằm cải thiện trải nghiệm mua sắm."
            actionHref="/"
            actionLabel="Về trang chủ"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6">
        <div className="overflow-hidden rounded-[40px] bg-[#1a130f] px-6 py-12 text-center md:px-12">
          <p className="text-[11px] uppercase tracking-[0.42em] text-[#a98a61]">Hẹn xem bộ sưu tập</p>
          <h2 className="luxury-title mt-4 text-4xl text-[#fff6e7] md:text-5xl">Sẵn sàng khám phá một thiết kế dành riêng cho bạn?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#d8c5aa]">
            Hãy bắt đầu từ bộ sưu tập hiện có hoặc liên hệ để nhận tư vấn riêng theo nhu cầu đeo hằng ngày và quà tặng.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-[#f0d7ae] px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#1a130f] transition hover:bg-[#fff6e7]"
            >
              Khám phá cửa hàng
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-[rgba(212,178,124,0.22)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fff6e7] transition hover:bg-[rgba(255,246,231,0.08)]"
            >
              Đặt lịch tư vấn
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="luxury-panel rounded-[28px] p-6">
      <div className="mb-5 inline-flex rounded-full border border-[var(--border-soft)] bg-[rgba(255,250,243,0.7)] p-3 text-[var(--accent-deep)]">{icon}</div>
      <h3 className="luxury-title text-3xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{desc}</p>
    </div>
  );
}

function InfoCard({
  id,
  title,
  desc,
  actionHref,
  actionLabel,
}: {
  id: string;
  title: string;
  desc: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 luxury-panel rounded-[28px] p-6">
      <h3 className="luxury-title text-3xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{desc}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex rounded-full border border-[var(--border-strong)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--foreground)] hover:bg-[rgba(157,122,69,0.08)]"
      >
        {actionLabel}
      </Link>
    </section>
  );
}
