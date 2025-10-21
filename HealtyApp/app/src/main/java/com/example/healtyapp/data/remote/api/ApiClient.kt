package com.example.healtyapp.data.remote.api

import android.content.Context
import com.example.healtyapp.util.TokenStore
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "http://10.0.2.2:8000/"

    // Variable para guardar la instancia de la API y no crearla cada vez
    private var apiService: ApiService? = null

    // Esta es la función que solucionará tu error.
    // Crea o devuelve una instancia de la API que incluye el token de autenticación.
    fun getApi(context: Context): ApiService {
        // Usamos un singleton para no crear un nuevo cliente en cada llamada
        if (apiService == null) {
            // Interceptor para ver los logs de la petición (muy útil)
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            // Interceptor para añadir el token a las cabeceras
            val authInterceptor = Interceptor { chain ->
                val originalRequest = chain.request()
                // Lee el token (ahora funciona gracias a HealtyApplication.kt)
                val token = TokenStore.getAccessToken()

                val requestBuilder = originalRequest.newBuilder()
                if (token != null) {
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }
                chain.proceed(requestBuilder.build())
            }

            // Construye el cliente OkHttp con los interceptores
            val client = OkHttpClient.Builder()
                .addInterceptor(authInterceptor)
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            // Construye Retrofit
            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            // Crea la implementación de la API
            apiService = retrofit.create(ApiService::class.java)
        }
        return apiService!!
    }
}
