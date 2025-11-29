package com.example.healtyapp.ui.citas

import android.view.*
import android.widget.TextView
import androidx.recyclerview.widget.*
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Appointment

class CitasAdapter(private val onClick: (Appointment) -> Unit)
    : ListAdapter<Appointment, CitasAdapter.VH>(DIFF) {

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<Appointment>() {
            override fun areItemsTheSame(o: Appointment, n: Appointment) = o.id == n.id
            override fun areContentsTheSame(o: Appointment, n: Appointment) = o == n
        }
    }

    class VH(view: View, val onClick: (Appointment) -> Unit) : RecyclerView.ViewHolder(view) {
        private val tvFH: TextView = view.findViewById(R.id.tvFechaHora)
        private val tvMotivo: TextView = view.findViewById(R.id.tvMotivo)
        private val tvMeta: TextView = view.findViewById(R.id.tvMeta)

        fun bind(cita: Appointment) {
            tvFH.text = "${cita.fecha} · ${cita.hora}"
            tvMotivo.text = "Motivo: ${cita.motivo}"

            val actividad = cita.actividad_psicologica ?: "Sin actividad asignada"
            val afirmacion = cita.afirmacion ?: "Sin afirmación asignada"

            tvMeta.text = "Actividad: $actividad\nAfirmación: $afirmacion"

            itemView.setOnClickListener { onClick(cita) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cita, parent, false)
        return VH(v, onClick)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        holder.bind(getItem(position))
    }
}
