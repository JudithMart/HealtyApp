package com.example.healtyapp

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.healtyapp.data.remote.api.ApiClient
import com.example.healtyapp.data.remote.dto.LoginRequest
import com.example.healtyapp.data.remote.dto.TokenResponse


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

        // Valores por defecto para probar rápido:
        etUser.setText("admin")
        etPass.setText("admin123")

        btnLogin.setOnClickListener {
            doLogin(etUser.text.toString(), etPass.text.toString())
        }
    }

    private fun doLogin(username: String, password: String) {
        tvResult.text = "Autenticando..."
        val call = ApiClient.api.login(LoginRequest(username, password))
        call.enqueue(object : Callback<TokenResponse> {
            override fun onResponse(call: Call<TokenResponse>, response: Response<TokenResponse>) {
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null) {
                        TokenStore.save(this@MainActivity, body.access, body.refresh)
                        tvResult.text = "Login OK. Token guardado."
                    } else {
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