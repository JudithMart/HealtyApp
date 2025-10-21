// Contenido para C:/.../healtyapp/ui/patients/PatientsViewModel.kt
package com.example.healtyapp.ui.patients

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.healtyapp.data.remote.api.ApiClient
import com.example.healtyapp.data.remote.dto.PageResponse
import com.example.healtyapp.data.remote.dto.Patient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.awaitResponse

data class PatientsUiState(
	val items: List<Patient> = emptyList(),
	val isLoading: Boolean = false,
	val page: Int = 1,
	val hasNext: Boolean = true,
	val error: String? = null
)

// La clase debe heredar de AndroidViewModel y recibir "application"
class PatientsViewModel(application: Application) : AndroidViewModel(application) {

	private val _state = MutableStateFlow(PatientsUiState())
	val state: StateFlow<PatientsUiState> = _state

	// Obtenemos la API pasando el contexto que recibimos
	private val api = ApiClient.getApi(application)

	init {
		// Carga la primera página cuando el ViewModel se crea
		loadPage()
	}

	// En /app/src/main/java/com/example/healtyapp/ui/patients/PatientsViewModel.kt

// ... (resto de la clase) ...

	fun loadPage(page: Int = 1) {
		if (_state.value.isLoading || (page > 1 && !_state.value.hasNext)) return // Evita cargas innecesarias
		_state.value = _state.value.copy(isLoading = true, error = null)

		viewModelScope.launch {
			try {
				val res = api.getPatients(page).awaitResponse()
				if (res.isSuccessful) {
					// ESTA ES LA LÓGICA CORRECTA PARA PAGINACIÓN
					val body: PageResponse<Patient> = res.body()!!
					_state.value = _state.value.copy(
						// Si es la página 1, reemplaza la lista. Si no, añade los nuevos resultados.
						items = if (page == 1) body.results else _state.value.items + body.results,
						page = page,
						// La API nos dice si hay una página siguiente (body.next no es nulo)
						hasNext = body.next != null,
						isLoading = false
					)
				} else {
					_state.value = _state.value.copy(
						isLoading = false,
						error = "Error al cargar pacientes: ${res.code()}"
					)
				}
			} catch (e: Exception) {
				_state.value =
					_state.value.copy(isLoading = false, error = "Error de red: ${e.message}")
			}
		}
	}
}

