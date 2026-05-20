package com.rednorte.apigateway.controller;

import com.rednorte.apigateway.config.JwtUtil;
import com.rednorte.apigateway.dto.AuthResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final WebClient.Builder webClientBuilder;
    private final JwtUtil jwtUtil;

    public AuthController(WebClient.Builder webClientBuilder, JwtUtil jwtUtil) {
        this.webClientBuilder = webClientBuilder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Mono<AuthResponse> login(@RequestBody Map<String, String> request) {
        System.out.println("🛃 [Gateway] Procesando login local para: " + request.get("rut"));

        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8001/api/v1/usuarios/auth/login") // Llama al puerto interno de usuarios
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(userData -> {
                    // El MS-Usuarios valida la clave y devuelve los datos. El Gateway genera el token:
                    String token = jwtUtil.generateToken(
                            userData.get("rut").toString(),
                            userData.get("rol").toString()
                    );
                    return new AuthResponse(token, userData.get("rut").toString(), userData.get("rol").toString());
                });
    }
}