package com.example.healtyapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.healtyapp.data.remote.api.ApiClient
import com.example.healtyapp.data.remote.dto.LoginRequest
import com.example.healtyapp.data.remote.dto.TokenResponse
import com.example.healtyapp.ui.patients.PatientsActivity
import com.example.healtyapp.util.TokenStore
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {
    private lateinit var etUser: EditText
    private lateinit var etPass: EditText
    private lateinit var btnLogin: Button
    private lateinit var tvResult: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etUser = findViewById(R.id.etUser)
        etPass = findViewById(R.id.etPass)
        btnLogin = findViewById(R.id.btnLogin)
        tvResult = findViewById(R.id.tvResult)

        // Valores por defecto para pruebas
        etUser.setText("admin")
        etPass.setText("admin123")

        btnLogin.setOnClickListener {
            doLogin(etUser.text.toString(), etPass.text.toString())
        }
    }

    private fun doLogin(username: String, password: String) {
        tvResult.text = "Autenticando..."
        // Ahora usamos getApi() y pasamos el contexto (this)
        val call = ApiClient.getApi(this).login(LoginRequest(username, password))

        call.enqueue(object : Callback<TokenResponse> {
            // ... (código anterior)
            override fun onResponse(call: Call<TokenResponse>, response: Response<TokenResponse>) {
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null) {
                        // La llamada ahora es más limpia
                        TokenStore.save(body.access, body.refresh) // Ya no se pasa this@MainActivity
                        tvResult.text = "Login OK. Token guardado."

                        // Abre la pantalla de pacientes
                        val intent = Intent(this@MainActivity, PatientsActivity::class.java)
                        startActivity(intent)
                        finish() // opcional: evita regresar al login
                    } else {
                        // ESTE ES UN PUNTO CRÍTICO
                        tvResult.text = "Respuesta vacía del servidor."
                    }
                } else {
                    tvResult.text = "Error ${response.code()}: ${response.errorBody()?.string()}"
                }
            }



            override fun onFailure(call: Call<TokenResponse>, t: Throwable) {
                tvResult.text = "Fallo de red: ${t.localizedMessage}"
            }
        })
    }
}
