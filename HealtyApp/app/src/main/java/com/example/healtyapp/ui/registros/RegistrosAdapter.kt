package com.example.healtyapp.ui.registros

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.healtyapp.R
import com.example.healtyapp.data.remote.dto.Registro

// Igual que PatientsAdapter, pero para registros
class RegistrosAdapter(private val onClick: (Registro) -> Unit) :
    ListAdapter<Registro, RegistrosAdapter.VH>(DIFF) {

    class VH(view: View, val onClick: (Registro) -> Unit) : RecyclerView.ViewHolder(view) {
        private val tvFecha: TextView = view.findViewById(R.id.tvFecha)
        private val chkCumplio: CheckBox = view.findViewById(R.id.chkCumplio)
        private val tvObs: TextView = view.findViewById(R.id.tvObs)

        fun bind(item: Registro) {
            tvFecha.text = item.fecha
            chkCumplio.isChecked = item.cumplio
            tvObs.text = item.observaciones ?: ""
            itemView.setOnClickListener { onClick(item) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_registro, parent, false)
        return VH(v, onClick)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        holder.bind(getItem(position))
    }

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<Registro>() {
            override fun areItemsTheSame(oldItem: Registro, newItem: Registro) = oldItem.id == newItem.id
            override fun areContentsTheSame(oldItem: Registro, newItem: Registro) = oldItem == newItem
        }
    }
}
