package com.example.healtyapp.ui.registros

import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Registro
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.time.LocalDate

class RegistroPacienteActivity : ComponentActivity() {

    private val vm: RegistrosViewModel by viewModels()

    // ✔ Opción A: pasamos la lambda del onClick
    private val adapter = RegistrosAdapter { registro ->
        Toast.makeText(
            this,
            "Registro del día ${registro.fecha}",
            Toast.LENGTH_SHORT
        ).show()
    }

    private val scope = MainScope()

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registro_paciente)

        // 1. Obtener datos enviados desde CitasActivity
        val citaId = intent.getIntExtra("cita_id", -1)
        val detallePlan = intent.getStringExtra("detalle_plan") ?: ""

        require(citaId != -1) { "cita_id es obligatorio" }

        // 2. Referencias a vistas
        val tvDetallePlan = findViewById<TextView>(R.id.tvDetallePlan)
        val rvRegistros = findViewById<RecyclerView>(R.id.rvRegistrosPaciente)
        val chkCumplioHoy = findViewById<CheckBox>(R.id.chkCumplioHoy)
        val etObservacionesHoy = findViewById<EditText>(R.id.etObservacionesHoy)
        val btnGuardarHoy = findViewById<Button>(R.id.btnGuardarHoy)
        val progress = findViewById<ProgressBar>(R.id.progressPaciente)

        // 3. Mostrar el plan
        tvDetallePlan.text = detallePlan

        // 4. Configurar RecyclerView
        rvRegistros.layoutManager = LinearLayoutManager(this)
        rvRegistros.adapter = adapter

        // 5. Observar ViewModel
        scope.launch {
            vm.state.collectLatest { s ->
                progress.visibility =
                    if (s.isLoading && s.items.isEmpty()) View.VISIBLE else View.GONE

                adapter.submitList(s.items)

                s.error?.let { msg ->
                    Toast.makeText(
                        this@RegistroPacienteActivity,
                        msg,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

        // 6. Cargar registros
        vm.cargar(citaId)

        // 7. Guardar registro de hoy
        btnGuardarHoy.setOnClickListener {
            val hoy = LocalDate.now().toString()
            val cumplio = chkCumplioHoy.isChecked
            val obs = etObservacionesHoy.text.toString().ifBlank { null }

            val nuevo = Registro(
                id = 0,
                cita = citaId,
                fecha = hoy,
                cumplio = cumplio,
                observaciones = obs
            )

            vm.crearRegistro(nuevo) {
                Toast.makeText(
                    this,
                    "Registro de hoy guardado correctamente",
                    Toast.LENGTH_SHORT
                ).show()

                chkCumplioHoy.isChecked = false
                etObservacionesHoy.text?.clear()
            }
        }
    }
}
