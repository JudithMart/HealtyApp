package com.example.healtyapp

import android.app.Application
import com.example.healtyapp.util.TokenStore

class HealtyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Aquí inicializamos el TokenStore con el contexto global.
        // Esto asegura que siempre tenga acceso a SharedPreferences.
        TokenStore.init(this)
    }
}
