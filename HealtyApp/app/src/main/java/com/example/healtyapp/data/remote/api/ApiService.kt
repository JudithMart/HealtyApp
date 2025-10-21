package com.example.healtyapp.data.remote.api

import com.example.healtyapp.data.remote.dto.LoginRequest
import com.example.healtyapp.data.remote.dto.TokenResponse
import com.example.healtyapp.data.remote.dto.Patient
import com.example.healtyapp.data.remote.dto.PageResponse
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
}
