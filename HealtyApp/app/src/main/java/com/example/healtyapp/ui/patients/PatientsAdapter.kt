// Contenido corregido para PatientsAdapter.kt
package com.example.healtyapp.ui.patients

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Patient

// 1. Añadimos el parámetro onClick al constructor del Adapter.
// Es una función que recibe un objeto 'Patient' y no devuelve nada.
class PatientsAdapter(private val onClick: (Patient) -> Unit) : ListAdapter<Patient, PatientsAdapter.VH>(DIFF) {

	// 2. El ViewHolder ahora también necesita recibir la función 'onClick'.
	class VH(view: View, val onClick: (Patient) -> Unit) : RecyclerView.ViewHolder(view) {
		private val tvName: TextView = view.findViewById(R.id.tvName)
		private val tvMeta: TextView = view.findViewById(R.id.tvMeta)

		fun bind(item: Patient) {
			tvName.text = "${item.nombre} ${item.apellido}"
			tvMeta.text = "Edad: ${item.edad ?: "-"} · Género: ${item.genero ?: "-"}"
			// 3. Cuando se pulsa el ítem, se llama a la función onClick pasándole el paciente.
			itemView.setOnClickListener { onClick(item) }
		}
	}

	override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
		val v = LayoutInflater.from(parent.context)
			.inflate(R.layout.item_patient, parent, false)
		// 4. Pasamos la función onClick al crear el ViewHolder.
		return VH(v, onClick)
	}

	override fun onBindViewHolder(holder: VH, position: Int) {
		holder.bind(getItem(position))
	}
}

// El objeto DIFF se mantiene igual
private val DIFF = object : DiffUtil.ItemCallback<Patient>() {
	override fun areItemsTheSame(oldItem: Patient, newItem: Patient) = oldItem.id == newItem.id
	override fun areContentsTheSame(oldItem: Patient, newItem: Patient) = oldItem == newItem
}
