package com.example.healtyapp.ui.citas
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Appointment
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import java.util.*
import com.example.healtyapp.ui.registros.RegistrosActivity
import android.content.Intent

class CitasActivity : ComponentActivity() {
    private val vm: CitasViewModel by viewModels()
    private lateinit var adapter: CitasAdapter
    private val scope = MainScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_citas)

        adapter = CitasAdapter { cita ->
            val i = Intent(this, RegistrosActivity::class.java)
            i.putExtra("cita_id", cita.id)
            startActivity(i)
        }

        val rv = findViewById<RecyclerView>(R.id.rvCitas)
        rv.layoutManager = LinearLayoutManager(this)
        rv.adapter = adapter // Asigna el adaptador ya configurado



        val pacienteId = intent.getIntExtra("paciente_id", -1)
        require(pacienteId != -1)


        val progress = findViewById<ProgressBar>(R.id.progressBar)

        val btnNueva = findViewById<Button>(R.id.btnNueva)



        btnNueva.setOnClickListener { mostrarDialogoNueva(pacienteId) }

        scope.launch {
            vm.state.collectLatest { s ->
                progress.visibility = if (s.isLoading && s.items.isEmpty()) View.VISIBLE
                else View.GONE
                adapter.submitList(s.items)
                s.error?.let { Toast.makeText(this@CitasActivity, it, Toast.LENGTH_SHORT).show() }
            }
        }


    vm.load(pacienteId, 1)
}

    private fun mostrarDialogoNueva(pacienteId: Int) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_nueva_cita, null)

        val etActividad = dialogView.findViewById<EditText>(R.id.etActividad)
        val etAfirmacion = dialogView.findViewById<EditText>(R.id.etAfirmacion)
        val tvFecha = dialogView.findViewById<TextView>(R.id.tvFecha)
        val tvHora = dialogView.findViewById<TextView>(R.id.tvHora)
        val btnGuardar = dialogView.findViewById<Button>(R.id.btnGuardar)

        val cal = Calendar.getInstance()
        var fechaSeleccionada = ""
        var horaSeleccionada = ""

        tvFecha.setOnClickListener {
            DatePickerDialog(this, { _, y, m, d ->
                fechaSeleccionada = String.format("%04d-%02d-%02d", y, m + 1, d)
                tvFecha.text = "Fecha: $fechaSeleccionada"
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show()
        }

        tvHora.setOnClickListener {
            TimePickerDialog(this, { _, hh, mm ->
                horaSeleccionada = String.format("%02d:%02d:00", hh, mm)
                tvHora.text = "Hora: $horaSeleccionada"
            }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), true).show()
        }

        val dialog = android.app.AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        dialog.show()

        btnGuardar.setOnClickListener {
            val actividad = etActividad.text.toString()
            val afirmacion = etAfirmacion.text.toString()

            if (actividad.isBlank() || afirmacion.isBlank() || fechaSeleccionada.isBlank() || horaSeleccionada.isBlank()) {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val nueva = Appointment(
                id = 0,
                paciente = pacienteId,
                fecha = fechaSeleccionada,
                hora = horaSeleccionada,
                motivo = "Consulta",
                tipo = "primera",
                estado = "pendiente",
                actividad_psicologica = actividad,
                afirmacion = afirmacion
            )

            vm.crearCita(nueva) {
                Toast.makeText(this, "Cita creada", Toast.LENGTH_SHORT).show()
                dialog.dismiss()
            }
        }
    }

}