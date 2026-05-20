package com.rednorte.apigateway.controller;

import com.rednorte.apigateway.config.JwtUtil;
import com.rednorte.apigateway.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final WebClient.Builder webClientBuilder;
    private final JwtUtil jwtUtil;

    @Value("${services.usuarios.url:http://localhost:8001/api/v1}")
    private String usuariosUrl;

    public AuthController(WebClient.Builder webClientBuilder, JwtUtil jwtUtil) {
        this.webClientBuilder = webClientBuilder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Mono<AuthResponse> login(@RequestBody Map<String, String> request) {
        System.out.println("🛃 [Gateway] Procesando login para: " + request.get("rut"));
        System.out.println("🔗 [Gateway] Llamando a: " + usuariosUrl);

        return webClientBuilder.build()
                .post()
                .uri(usuariosUrl + "/usuarios/auth/login")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(userData -> {
                    String token = jwtUtil.generateToken(
                            userData.get("rut").toString(),
                            userData.get("rol").toString()
                    );
                    return new AuthResponse(token, userData.get("rut").toString(), userData.get("rol").toString());
                });
    }
}