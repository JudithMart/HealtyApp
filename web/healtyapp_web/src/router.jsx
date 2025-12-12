import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import PacientesList from "./modules/pacientes/PacientesList";
import PacienteForm from "./modules/pacientes/PacienteForm";
import CitasList from "./modules/citas/CitasList";
import CitaForm from "./modules/citas/CistasForm";





import Dashboard from "./views/Dashboard";
import NotasList from "./modules/notas/NotasList";
import NotaForm from "./modules/notas/NotaForm";

export default function AppRouter() {
  function PrivateRoute({ children }) {
    const token = localStorage.getItem("access");
    return token ? children : <Navigate to="/LoginPage" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <PacientesList />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes/nuevo"
          element={
            <PrivateRoute>
              <PacienteForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes/:id/editar"
          element={
            <PrivateRoute>
              <PacienteForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/citas"
          element={
            <PrivateRoute>
              <CitasList />
            </PrivateRoute>
          }
        />
        <Route
          path="/citas/nueva"
          element={
            <PrivateRoute>
              <CitaForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/citas/:id/editar"
          element={
            <PrivateRoute>
              <CitaForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes/:id/citas"
          element={
            <PrivateRoute>
              <CitasList />
            </PrivateRoute>
          }
        />
        <Route path="/notas"
          element={<PrivateRoute>

            <NotasList />
          </PrivateRoute>} />

        <Route path="/notas/nueva"
          element={<PrivateRoute>
            <NotaForm />
          </PrivateRoute>} />

        <Route path="/notas/:id/editar"
          element={<PrivateRoute>
            <NotaForm />
          </PrivateRoute>} />

        <Route
          path="/citas/:id/notas"
          element={
            <PrivateRoute>
              <NotasList />
            </PrivateRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}
