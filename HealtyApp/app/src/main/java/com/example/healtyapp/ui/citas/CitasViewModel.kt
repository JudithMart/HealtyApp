// Contenido corregido para CitasViewModel.kt
package com.example.healtyapp.ui.citas

import android.app.Application
import androidx.lifecycle.AndroidViewModel // <-- Importante: heredar de AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.healtyapp.data.remote.api.ApiClient
import com.example.healtyapp.data.remote.dto.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.awaitResponse

data class CitasUiState(
    val items: List<Appointment> = emptyList(),
    val isLoading: Boolean = false,
    val page: Int = 1,
    val hasNext: Boolean = true,
    val error: String? = null
)

// 1. Heredar de AndroidViewModel y pasar 'application' al constructor
class CitasViewModel(application: Application) : AndroidViewModel(application) {

    private val _state = MutableStateFlow(CitasUiState())
    val state: StateFlow<CitasUiState> = _state
    private var pacienteId: Int = -1

    // 2. Obtener la instancia de la API pasando el contexto
    private val api = ApiClient.getApi(application)

    fun load(pacienteId: Int, page: Int = 1) {
        // Evita cargas innecesarias
        if (_state.value.isLoading || (page > 1 && !_state.value.hasNext)) return

        this.pacienteId = pacienteId
        _state.value = _state.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            try {
                // 3. Usar la instancia 'api' que creamos arriba
                val res = api.getCitas(page = page, pacienteId = pacienteId).awaitResponse()
                if (res.isSuccessful) {
                    val body: PageResponseCita<Appointment> = res.body()!!
                    _state.value = _state.value.copy(
                        items = if (page == 1) body.results else _state.value.items + body.results,
                        page = page,
                        hasNext = body.next != null,
                        isLoading = false
                    )
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = "Error ${res.code()}")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isLoading = false, error = e.message)
            }
        }
    }

    // 4. Mover la función crearCita DENTRO de la clase
    fun crearCita(nueva: Appointment, onOk: () -> Unit) {
        viewModelScope.launch {
            try {
                // Usar la instancia 'api' de la clase
                val res = api.crearCita(nueva).awaitResponse()
                if (res.isSuccessful) {
                    onOk()
                    // Recargar la lista de citas desde la página 1
                    if (pacienteId != -1) {
                        load(pacienteId, 1)
                    }
                } else {
                    _state.value = _state.value.copy(error = "Error al crear cita: ${res.code()}")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(error = "Error de red: ${e.message}")
            }
        }
    }
}
