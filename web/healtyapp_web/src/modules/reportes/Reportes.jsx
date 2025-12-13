// src/modules/reportes/Reportes.jsx
import { useEffect, useState } from "react";
import { fetchReportes } from "./reportes.api";
import { fetchPacientes } from "../pacientes/pacientes.api";
import { ui } from "../../styles/ui";

const styles = {
    page: { 
        padding: 20, 
        background: "#F5F3FF", 
        minHeight: "100vh" 
    },
    header: {
        marginBottom: 24,
    },
    title: { 
        color: "#5D3FD3", 
        marginBottom: 8,
        fontSize: 28,
        fontWeight: 700,
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 14,
    },
    card: {
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        marginBottom: 20,
    },
    filterGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 20,
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontWeight: 600,
        marginBottom: 6,
        color: "#374151",
        fontSize: 14,
    },
    select: {
        padding: 10,
        borderRadius: 8,
        border: "1px solid #D1D5DB",
        fontSize: 14,
        background: "#fff",
        cursor: "pointer",
        transition: "border-color 0.2s",
    },
    dateRange: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
    },
    input: {
        padding: 10,
        borderRadius: 8,
        border: "1px solid #D1D5DB",
        fontSize: 14,
    },
    buttonGroup: {
        display: "flex",
        gap: 12,
        marginTop: 20,
    },
    btnPrimary: {
        background: "#7B4BDB",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
        transition: "background 0.2s",
    },
    btnSecondary: {
        background: "#EDE9FE",
        color: "#5D3FD3",
        border: "none",
        padding: "12px 24px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
        transition: "background 0.2s",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 16,
    },
    th: {
        background: "#EDE9FE",
        padding: 12,
        textAlign: "left",
        fontWeight: 600,
        color: "#5D3FD3",
        fontSize: 14,
    },
    td: {
        padding: 12,
        borderBottom: "1px solid #E5E7EB",
        fontSize: 14,
        color: "#374151",
    },
    emptyState: {
        textAlign: "center",
        padding: 40,
        color: "#9CA3AF",
    },
    statsRow: {
        display: "flex",
        gap: 16,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        background: "linear-gradient(135deg, #7B4BDB 0%, #9D71E8 100%)",
        padding: 16,
        borderRadius: 10,
        color: "#fff",
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.9,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 700,
    },
};

export default function Reportes() {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteId, setPacienteId] = useState("");
    const [tipo, setTipo] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPacientes({ page: 1 }).then((data) =>
            setPacientes(data.resultados)
        );
    }, []);

    async function generarReporte() {
        setLoading(true);
        try {
            const data = await fetchReportes({
                pacienteId,
                tipo,
                fechaInicio,
                fechaFin,
            });
            setResultados(data);
        } catch (e) {
            console.error("Error al generar reporte:", e);
        } finally {
            setLoading(false);
        }
    }

    function limpiarFiltros() {
        setPacienteId("");
        setTipo("");
        setFechaInicio("");
        setFechaFin("");
        setResultados([]);
    }

    function exportToCSV() {
        const filtered = filtrarResultados();
        const csv =
            "Paciente,Fecha,Hora,Tipo,Motivo\n" +
            filtered
                .map((r) => {
                    return `"${r.paciente}","${r.fecha}","${r.hora}","${formatTipo(r.tipo)}","${r.motivo}"`;
                })
                .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `reporte_healtyapp_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function filtrarResultados() {
        return resultados.filter((r) => {
            const fecha = new Date(r.fecha);

            if (tipo && r.tipo !== tipo) return false;
            if (fechaInicio && fecha < new Date(fechaInicio)) return false;
            if (fechaFin && fecha > new Date(fechaFin)) return false;

            return true;
        });
    }

    function formatFecha(fechaStr) {
        if (!fechaStr) return "-";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function formatHora(horaStr) {
        if (!horaStr) return "-";
        if (horaStr.length >= 5) {
            return horaStr.substring(0, 5);
        }
        return horaStr;
    }

    function formatTipo(tipo) {
        const tipos = {
            'primera': 'Primera vez',
            'seguimiento': 'Seguimiento'
        };
        return tipos[tipo] || tipo;
    }

    const resultadosFiltrados = filtrarResultados();

    return (
        <div style={styles.page}>
            {/* ENCABEZADO */}
            <div style={styles.header}>
                <h2 style={styles.title}> Reportes Psicológicos</h2>
                
            </div>

            {/* FILTROS */}
            <div style={styles.card}>
                <h3 style={{ color: "#374151", marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
                    Filtros de búsqueda
                </h3>

                <div style={styles.filterGrid}>
                    {/* Paciente */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Paciente</label>
                        <select
                            style={styles.select}
                            value={pacienteId}
                            onChange={(e) => setPacienteId(e.target.value)}
                        >
                            <option value="">Todos los pacientes</option>
                            {pacientes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tipo de cita</label>
                        <select
                            style={styles.select}
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="">Todos los tipos</option>
                            <option value="primera">Primera vez</option>
                            <option value="seguimiento">Seguimiento</option>
                        </select>
                    </div>
                </div>

                {/* Rango de fechas */}
                <div style={{ marginTop: 16 }}>
                    <label style={styles.label}>Rango de fechas</label>
                    <div style={styles.dateRange}>
                        <div style={styles.fieldGroup}>
                            <label style={{ ...styles.label, fontSize: 12, color: "#6B7280" }}>
                                Desde
                            </label>
                            <input
                                style={styles.input}
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={{ ...styles.label, fontSize: 12, color: "#6B7280" }}>
                                Hasta
                            </label>
                            <input
                                style={styles.input}
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div style={styles.buttonGroup}>
                    <button
                        style={styles.btnPrimary}
                        onClick={generarReporte}
                        disabled={loading}
                    >
                        {loading ? " Generando..." : "Generar reporte"}
                    </button>
                    
                </div>
            </div>

            {/* RESULTADOS */}
            <div style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ color: "#374151", fontSize: 16, fontWeight: 600 }}>
                        Resultados
                    </h3>
                    {resultadosFiltrados.length > 0 && (
                        <button style={styles.btnPrimary} onClick={exportToCSV}>
                            Exportar CSV
                        </button>
                    )}
                </div>

              

                {loading ? (
                    <div style={styles.emptyState}>
                        <p> Cargando datos...</p>
                    </div>
                ) : resultadosFiltrados.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: 48, margin: 0 }}></p>
                        <p style={{ fontSize: 16, marginTop: 12 }}>
                            {resultados.length === 0 
                                ? "Selecciona los filtros y presiona 'Generar reporte'"
                                : "No se encontraron resultados con los filtros aplicados"
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Paciente</th>
                                    <th style={styles.th}>Fecha</th>
                                    <th style={styles.th}>Hora</th>
                                    <th style={styles.th}>Tipo</th>
                                    <th style={styles.th}>Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosFiltrados.map((r, index) => (
                                    <tr key={r.id || index}>
                                        <td style={styles.td}>
                                            <strong>
                                                {r.paciente}
                                            </strong>
                                        </td>
                                        <td style={styles.td}>{formatFecha(r.fecha)}</td>
                                        <td style={styles.td}>{formatHora(r.hora)}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                background: r.tipo === 'primera' ? '#D1FAE5' : '#FEF3C7',
                                                color: r.tipo === 'primera' ? '#065F46' : '#92400E',
                                                padding: "4px 8px",
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}>
                                                {formatTipo(r.tipo)}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{r.motivo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}