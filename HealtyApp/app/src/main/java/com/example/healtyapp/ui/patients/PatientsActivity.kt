// Contenido corregido para PatientsActivity.kt
package com.example.healtyapp.ui.patients

import android.content.Intent // <-- Importación añadidaimport android.os.Bundle
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.ui.citas.CitasActivity // <-- Importación añadida
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class PatientsActivity : AppCompatActivity() {
	private lateinit var vm: PatientsViewModel

	// Esta inicialización ahora es correcta porque el Adapter SÍ espera una función
	private val adapter = PatientsAdapter { patient ->

		//AQUÍ LLAMO LAS CITAS
		val i = Intent(this, CitasActivity::class.java)
		i.putExtra("paciente_id", patient.id)
		startActivity(i)
	}

	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_patients)

		// El resto del código se mantiene igual...
		vm = ViewModelProvider(this)[PatientsViewModel::class.java]

		val rv = findViewById<RecyclerView>(R.id.rvPatients)
		val progress = findViewById<ProgressBar>(R.id.progress)
		val btnLoadMore = findViewById<Button>(R.id.btnLoadMore)

		rv.layoutManager = LinearLayoutManager(this)
		rv.adapter = adapter

		btnLoadMore.setOnClickListener {
			vm.loadPage(vm.state.value.page + 1)
		}

		lifecycleScope.launch {
			vm.state.collectLatest { state ->
				progress.visibility = if (state.isLoading && state.items.isEmpty()) View.VISIBLE else View.GONE
				adapter.submitList(state.items)
				btnLoadMore.visibility = if (state.hasNext && !state.isLoading) View.VISIBLE else View.GONE
				state.error?.let {
					Toast.makeText(this@PatientsActivity, it, Toast.LENGTH_SHORT).show()
				}
			}
		}
	}
}
