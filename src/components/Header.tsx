import Link from "next/link";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1rem" }}>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/">FB Cửa hàng</Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
            <Link href="/">Trang chủ</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
