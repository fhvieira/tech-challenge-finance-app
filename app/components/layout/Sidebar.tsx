export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#0f4c5c",
        color: "white",
        padding: "20px",
        height: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>ByteBank</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "15px" }}>Início</li>
        <li style={{ marginBottom: "15px" }}>Transferências</li>
        <li style={{ marginBottom: "15px" }}>Investimentos</li>
        <li style={{ marginBottom: "15px" }}>Outros serviços</li>
      </ul>
    </aside>
  );
}