import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ padding: "1.5rem" }}>
      <header style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Panel Principal</h2>
        <nav style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/">Inicio</Link>
          <Link to="/pacientes">Pacientes</Link>
        </nav>
      </header>
      <p>Bienvenido al sistema web de HealtyApp.</p>
    </div>
  );
}
