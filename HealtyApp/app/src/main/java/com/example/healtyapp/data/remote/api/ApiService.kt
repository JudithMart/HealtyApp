package com.example.healtyapp.data.remote.api
import com.example.healtyapp.data.remote.dto.LoginRequest
import com.example.healtyapp.data.remote.dto.TokenResponse
import retrofit2.Call
import retrofit2.http.Body


import retrofit2.http.POST
interface ApiService {
    @POST("auth/login/")
    fun login(@Body body: LoginRequest): Call<TokenResponse>
}