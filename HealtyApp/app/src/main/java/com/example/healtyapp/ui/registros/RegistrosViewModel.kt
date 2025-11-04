package com.example.healtyapp.ui.registros

import android.app.Application
import androidx.lifecycle.AndroidViewModel // <-- 1. Heredar de AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.healtyapp.data.remote.api.ApiClient
import com.example.healtyapp.data.remote.dto.Registro
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.awaitResponse

data class RegistrosUiState(
    val items: List<Registro> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

// 1. Cambiar a AndroidViewModel y recibir 'application'
class RegistrosViewModel(application: Application) : AndroidViewModel(application) {
    private val _state = MutableStateFlow(RegistrosUiState())
    val state: StateFlow<RegistrosUiState> = _state

    // 2. Obtener la API autenticada pasando el contexto
    private val api = ApiClient.getApi(application)

    fun cargar(citaId: Int) {
        _state.value = _state.value.copy(isLoading = true, error = null)
        viewModelScope.launch {
            try {
                // 3. La llamada ahora usa la API autenticada y espera una List<Registro>
                val res = api.getRegistros(citaId).awaitResponse()
                if (res.isSuccessful) {
                    val page = res.body()
                    val registros = page?.results ?: emptyList()
                    _state.value = _state.value.copy(items = registros, isLoading = false)
                } else {
                    _state.value = _state.value.copy(isLoading = false, error = "Error ${res.code()}")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isLoading = false, error = e.message)
            }
        }
    }

    // 4. Añadir la función para crear un nuevo registro
    fun crearRegistro(nuevo: Registro, onOk: () -> Unit) {
        viewModelScope.launch {
            try {
                val res = api.crearRegistro(nuevo).awaitResponse()
                if (res.isSuccessful) {
                    onOk()
                    // Recargamos la lista para mostrar el nuevo registro
                    cargar(nuevo.cita)
                } else {
                    _state.value = _state.value.copy(error = "Error al crear: ${res.code()}")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(error = e.message)
            }
        }
    }

    // 5. Añadir la función para limpiar el mensaje de error
    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}
