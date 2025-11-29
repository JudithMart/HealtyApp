package com.example.healtyapp.data.remote.dto

data class Appointment(
    val id: Int,
    val paciente: Int,
    val fecha: String, // &quot;YYYY-MM-DD&quot;
    val hora: String, // &quot;HH:mm:ss&quot;
    val motivo: String,
    val tipo: String, // &quot;primera&quot; | &quot;seguimiento&quot;
    val estado: String, // &quot;pendiente&quot; | &quot;asistida&quot; | &quot;cancelada&quot;
    val actividad_psicologica: String?,
    val afirmacion: String?

)

data class PageResponseCita<T>(
    val count: Int,
    val next: String?,
    val previous: String?,
    val results: List<T>
)