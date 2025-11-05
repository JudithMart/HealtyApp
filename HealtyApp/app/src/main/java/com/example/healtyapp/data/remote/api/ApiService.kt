package com.example.healtyapp.data.remote.api

import com.example.healtyapp.data.remote.dto.LoginRequest
import com.example.healtyapp.data.remote.dto.TokenResponse
import com.example.healtyapp.data.remote.dto.Patient
import com.example.healtyapp.data.remote.dto.PageResponse
import com.example.healtyapp.data.remote.dto.PageResponseCita
import com.example.healtyapp.data.remote.dto.Appointment
import com.example.healtyapp.data.remote.dto.Registro
import com.example.healtyapp.data.remote.dto.PageResponseRegistro

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {
    @POST("auth/login/")
    fun login(@Body body: LoginRequest): Call<TokenResponse>

    @GET("pacientes/")
    fun getPatients(
        @Query("page") page: Int,
        @Query("page_size") pageSize: Int = 10
    ): Call<PageResponse<Patient>>

    @GET("citas/")
        fun getCitas(
            @Query("page") page: Int,
            @Query("page_size") pageSize: Int = 10,
            @Query("paciente") pacienteId: Int
        ): Call<PageResponseCita<Appointment>>

    @POST("citas/")
    fun crearCita(@Body body: Appointment): Call<Appointment>

    @GET("registros/")
    fun getRegistros(
        @Query("cita") citaId: Int? = null,
        @Query("page") page: Int = 1
    ): Call<PageResponse<Registro>>
       
    @POST("registros/")
    fun crearRegistro(@Body body: Registro): Call<Registro>
    

}
