// src/components/Dashboard.jsx
import { Link } from "react-router-dom";
import { ui } from "../styles/ui";

export default function Dashboard() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>HealtyApp</h1>
          <p style={styles.subtitle}>
            Sistema de gestión psicológica
          </p>
        </div>

        {/* Cards de navegación */}
        <div style={styles.grid}>
          {/* Card Pacientes */}
          <Link to="/pacientes" style={styles.linkCard}>
            <div style={styles.card}>
              <div style={styles.iconWrapper}>
                <svg 
                  style={styles.icon} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>Pacientes</h3>
              <p style={styles.cardDescription}>
                Administra la información y expedientes de tus pacientes
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.linkText}>Ver pacientes</span>
                <svg 
                  style={styles.arrow} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card Reportes */}
          <Link to="/reportes" style={styles.linkCard}>
            <div style={styles.card}>
              <div style={styles.iconWrapper}>
                <svg 
                  style={styles.icon} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>Reportes</h3>
              <p style={styles.cardDescription}>
                Genera reportes y estadísticas de consultas psicológicas
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.linkText}>Ver reportes</span>
                <svg 
                  style={styles.arrow} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

       
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 48,
    paddingTop: 40,
  },
  title: {
    color: "#5D3FD3",
    fontSize: 42,
    fontWeight: 700,
    margin: 0,
    marginBottom: 8,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 18,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    marginBottom: 32,
  },
  linkCard: {
    textDecoration: "none",
    display: "block",
  },
  card: {
    background: "#fff",
    padding: 32,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    background: "linear-gradient(135deg, #7B4BDB 0%, #9D71E8 100%)",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    width: 32,
    height: 32,
    color: "#fff",
  },
  cardTitle: {
    color: "#1F2937",
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    marginBottom: 12,
  },
  cardDescription: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 1.6,
    margin: 0,
    marginBottom: 24,
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTop: "1px solid #E5E7EB",
  },
  linkText: {
    color: "#7B4BDB",
    fontSize: 15,
    fontWeight: 600,
  },
  arrow: {
    width: 20,
    height: 20,
    color: "#7B4BDB",
  },
  infoCard: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  infoContent: {
    textAlign: "center",
  },
  infoTitle: {
    color: "#374151",
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    marginBottom: 8,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 1.6,
    margin: 0,
  },
};