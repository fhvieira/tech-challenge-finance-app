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
        <li
          style={{
            marginBottom: "15px",
            background: "rgba(255,255,255,0.18)",
            padding: "10px 12px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Início
        </li>
        <li
          style={{
            marginBottom: "15px",
            padding: "10px 12px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Transferências
        </li>
        <li
          style={{
            marginBottom: "15px",
            padding: "10px 12px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Investimentos
        </li>
        <li
          style={{
            marginBottom: "15px",
            padding: "10px 12px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Outros serviços
        </li>
      </ul>
    </aside>
  );
}