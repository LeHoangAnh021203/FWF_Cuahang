export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e5e7eb', marginTop: '2rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '1rem', fontSize: 12 }}>
        © {new Date().getFullYear()} FB Cửa hàng
      </div>
    </footer>
  );
}



