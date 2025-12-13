import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ui } from "../styles/ui";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);

      // 👉 REDIRECCIÓN CORRECTA
      navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...ui.page,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleLogin} style={{ ...ui.card, width: 400 }}>
        <h2 style={{ ...ui.title, textAlign: "center" }}>HealtyApp</h2>
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 20 }}>
          Sistema psicológico de seguimiento clínico
        </p>

        {error && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              padding: 10,
              borderRadius: 8,
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <input
          style={ui.input}
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          style={ui.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{ ...ui.button, width: "100%", marginTop: 10 }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
