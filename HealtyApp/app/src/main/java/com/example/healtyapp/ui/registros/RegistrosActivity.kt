package com.example.healtyapp.ui.registros

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Registro
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class RegistrosActivity : AppCompatActivity() {
    private lateinit var vm: RegistrosViewModel
    private lateinit var adapter: RegistrosAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registros)

        vm = ViewModelProvider(this)[RegistrosViewModel::class.java]

        val citaId = intent.getIntExtra("cita_id", -1)
        if (citaId == -1) {
            Toast.makeText(this, "Error: ID de cita no encontrado", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        val rv = findViewById<RecyclerView>(R.id.rvRegistros)
        val btnNuevo = findViewById<Button>(R.id.btnNuevo)

        // ✅ inicializamos el adapter con un callback de click
        adapter = RegistrosAdapter { registro ->
            Toast.makeText(this, "Registro: ${registro.fecha}", Toast.LENGTH_SHORT).show()
        }

        rv.layoutManager = LinearLayoutManager(this)
        rv.adapter = adapter

        lifecycleScope.launch {
            vm.state.collectLatest { state ->
                adapter.submitList(state.items)
                state.error?.let { msg ->
                    Toast.makeText(this@RegistrosActivity, msg, Toast.LENGTH_SHORT).show()
                    vm.clearError()
                }
            }
        }

        btnNuevo.setOnClickListener {
            val nuevo = Registro(
                id = 0,
                cita = citaId,
                fecha = "2025-11-01",
                cumplio = false,
                observaciones = "Nueva observación"
            )
            vm.crearRegistro(nuevo) {
                Toast.makeText(this, "Registro agregado", Toast.LENGTH_SHORT).show()
            }
        }

        vm.cargar(citaId)
    }
}
