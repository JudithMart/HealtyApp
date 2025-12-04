package com.example.healtyapp.ui.registros

import android.app.Application
import androidx.lifecycle.AndroidViewModel
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

class RegistrosViewModel(application: Application) : AndroidViewModel(application) {

    private val _state = MutableStateFlow(RegistrosUiState())
    val state: StateFlow<RegistrosUiState> = _state

    // API autenticada
    private val api = ApiClient.getApi(application)

    fun cargar(citaId: Int) {
        _state.value = _state.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            try {
                val res = api.getRegistros(citaId).awaitResponse()

                if (res.isSuccessful) {

                    // ⬅️ ESTA ES LA CORRECCIÓN: tomar results, no body
                    val page = res.body()
                    val registros = page?.results ?: emptyList()

                    _state.value = _state.value.copy(
                        items = registros,
                        isLoading = false
                    )

                } else {
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "Error ${res.code()}"
                    )
                }

            } catch (e: Exception) {

                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun crearRegistro(registro: Registro, onOk: () -> Unit) {
        _state.value = _state.value.copy(isLoading = true)

        viewModelScope.launch {
            try {
                val res = api.crearRegistro(registro).awaitResponse()

                if (res.isSuccessful) {

                    // Recargar la lista de la cita
                    cargar(registro.cita)

                    _state.value = _state.value.copy(isLoading = false)
                    onOk()

                } else {
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "Error ${res.code()}"
                    )
                }

            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}
