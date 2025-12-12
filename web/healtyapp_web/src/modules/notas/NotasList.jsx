import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchNotas, deleteNota } from "./notas.api";

const styles = {
    page: {
        background: "#FFFFFF",
        padding: 20,
        minHeight: "80vh",
        color: "#333",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    btnPrimary: {
        background: "#7B4BDB",
        color: "#fff",
        padding: "10px 14px",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
    },
    card: {
        background: "#fff",
        borderRadius: 10,
        padding: 14,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        marginBottom: 12,
    },
};

export default function NotasList() {
    const navigate = useNavigate();
    const { id: routeCitaId } = useParams();          // /citas/:id/registros
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const citaQuery = params.get("cita") || "";

    const citaFilterInicial = citaQuery || routeCitaId || "";

    const [notas, setNotas] = useState([]);
    const [citaFilter, setCitaFilter] = useState(citaFilterInicial);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    async function cargarNotas() {
        setLoading(true);
        try {
            const data = await fetchNotas({ page, cita: citaFilter });
            setNotas(data.resultados);
            setTotal(data.total);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarNotas();
    }, [page, citaFilter]);

    function handleNuevo() {
        const url = `/notas/nueva${citaFilter ? `?cita=${citaFilter}` : ""}`;
        navigate(url);
    }

    function handleEditar(id) {
        const url = `/notas/${id}/editar${citaFilter ? `?cita=${citaFilter}` : ""}`;
        navigate(url);
    }

    async function handleEliminar(id) {
        if (!window.confirm("¿Eliminar esta nota?")) return;
        await deleteNota(id);
        cargarNotas();
    }

    const totalPages = Math.ceil(total / pageSize) || 1;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h2 style={{ color: "#5D3FD3" }}>
                    {citaFilter ? "Registros de la cita" : "Notas psicológicas"}
                </h2>

                <button style={styles.btnPrimary} onClick={handleNuevo}>
                    Nuevo registro
                </button>
            </div>

            {citaFilter ? (
                <p>Mostrando registros de la cita <strong>#{citaFilter}</strong></p>
            ) : (
                <p>Mostrando todas las notas</p>
            )}

            {loading ? <p>Cargando...</p> : null}

            {notas.length === 0 && !loading ? (
                <div style={{ ...styles.card, textAlign: "center" }}>
                    No hay registros.
                </div>
            ) : (
                notas.map((n) => (
                    <div key={n.id} style={styles.card}>
                        <div style={{ fontWeight: "bold" }}>{n.fecha}</div>
                        <div>Estado emocional: {n.estado_emocional}</div>
                        <div style={{ marginTop: 8 }}>{n.observaciones}</div>

                        <div style={{ marginTop: 10 }}>
                            <button onClick={() => handleEditar(n.id)} style={{ marginRight: 10 }}>
                                Editar
                            </button>
                            <button
                                onClick={() => handleEliminar(n.id)}
                                style={{ color: "red" }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))
            )}

            <div style={{ marginTop: 20 }}>
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                </button>

                <span style={{ margin: "0 10px" }}>
                    Página {page} de {totalPages}
                </span>

                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}
