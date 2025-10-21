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

private val DIFF = object : DiffUtil.ItemCallback<Patient>() {
	override fun areItemsTheSame(oldItem: Patient, newItem: Patient) = oldItem.id == newItem.id
	override fun areContentsTheSame(oldItem: Patient, newItem: Patient) = oldItem == newItem
}

class PatientsAdapter : ListAdapter<Patient, PatientsAdapter.VH>(DIFF) {

	class VH(view: View) : RecyclerView.ViewHolder(view) {
		private val tvName: TextView = view.findViewById(R.id.tvName)
		private val tvMeta: TextView = view.findViewById(R.id.tvMeta)

		fun bind(item: Patient) {
			tvName.text = "${item.nombre} ${item.apellido}"
			tvMeta.text = "Edad: ${item.edad ?: "-"} · Género: ${item.genero ?: "-"}"
		}
	}

	override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
		val v = LayoutInflater.from(parent.context)
			.inflate(R.layout.item_patient, parent, false)
		return VH(v)
	}

	override fun onBindViewHolder(holder: VH, position: Int) {
		holder.bind(getItem(position))
	}
}
