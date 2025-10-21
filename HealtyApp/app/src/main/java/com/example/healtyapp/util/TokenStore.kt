package com.example.healtyapp.util

import android.content.Context
import android.content.SharedPreferences

object TokenStore {
    private const val PREFS_NAME = "auth_prefs"
    private const val ACCESS_TOKEN = "access_token"
    private const val REFRESH_TOKEN = "refresh_token"

    // Guardará una referencia a SharedPreferences una vez inicializado
    private lateinit var prefs: SharedPreferences

    /**
     * Debe ser llamado desde la clase Application para inicializar el singleton.
     */
    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    /**
     * Guarda los tokens. Ahora no necesita el contexto como parámetro.
     */
    fun save(accessToken: String, refreshToken: String) {
        if (!::prefs.isInitialized) {
            throw IllegalStateException("TokenStore.init(context) debe ser llamado antes de usar save()")
        }
        prefs.edit()
            .putString(ACCESS_TOKEN, accessToken)
            .putString(REFRESH_TOKEN, refreshToken)
            .apply()
    }

    /**
     * Obtiene el token de acceso.
     */
    fun getAccessToken(): String? {
        if (!::prefs.isInitialized) {
            // No lances una excepción aquí, porque el interceptor puede ejecutarse antes.
            // Simplemente devuelve null si no está inicializado.
            return null
        }
        return prefs.getString(ACCESS_TOKEN, null)
    }

    // Puedes añadir getRefreshToken() si lo necesitas
}
