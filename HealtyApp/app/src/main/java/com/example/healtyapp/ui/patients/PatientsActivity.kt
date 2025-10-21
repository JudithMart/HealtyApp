// En /app/src/main/java/com/example/healtyapp/ui/patients/PatientsActivity.kt
package com.example.healtyapp.ui.patients

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity // <-- Mejor usar AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope // <-- Más seguro que MainScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class PatientsActivity : AppCompatActivity() {
	private lateinit var vm: PatientsViewModel
	private val adapter = PatientsAdapter()

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_patients)

		// Inicializamos el ViewModel correctamente
		vm = ViewModelProvider(this)[PatientsViewModel::class.java]

		// Referencias a las vistas
		val rv = findViewById<RecyclerView>(R.id.rvPatients)
		val progress = findViewById<ProgressBar>(R.id.progress)
		val btnLoadMore = findViewById<Button>(R.id.btnLoadMore) // <-- Referencia al botón

		// Configuración del RecyclerView
		rv.layoutManager = LinearLayoutManager(this)
		rv.adapter = adapter

		// Configuración del OnClickListener para el botón
		btnLoadMore.setOnClickListener {
			// Le decimos al ViewModel que cargue la siguiente página
			vm.loadPage(vm.state.value.page + 1)
		}

		// Observamos el estado del ViewModel para actualizar la UI
		lifecycleScope.launch {
			vm.state.collectLatest { state ->
				// 1. Visibilidad de la barra de progreso
				progress.visibility = if (state.isLoading && state.items.isEmpty()) View.VISIBLE else View.GONE

				// 2. Actualizar la lista
				adapter.submitList(state.items)

				// 3. Visibilidad del botón "Cargar Más"
				btnLoadMore.visibility = if (state.hasNext && !state.isLoading) View.VISIBLE else View.GONE

				// 4. Mostrar errores
				state.error?.let {
					Toast.makeText(this@PatientsActivity, it, Toast.LENGTH_SHORT).show()
				}
			}
		}

		// La carga inicial ya se hace en el 'init' del ViewModel, no es necesario llamarla aquí.
	}
}
