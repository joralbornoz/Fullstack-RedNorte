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

    private final WebClient webClient;
    private final JwtUtil jwtUtil;
    private final String usuariosUrl;

    public AuthController(
            WebClient.Builder webClientBuilder,
            JwtUtil jwtUtil,
            @Value("${services.usuarios.url:http://localhost:8001/api/v1}") String usuariosUrl) {
        this.webClient = webClientBuilder.build();
        this.jwtUtil = jwtUtil;
        this.usuariosUrl = usuariosUrl;
    }

    @PostMapping("/login")
    public Mono<AuthResponse> login(@RequestBody Map<String, String> request) {
        System.out.println("🛃 [Gateway] Login para: " + request.get("rut"));
        System.out.println("🔗 [Gateway] URL ms-usuarios: " + usuariosUrl);

        return webClient.post()
                .uri(usuariosUrl + "/usuarios/auth/login")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnNext(userData -> System.out.println("✅ [Gateway] Respuesta ms-usuarios: " + userData))
                .doOnError(e -> System.err.println("❌ [Gateway] Error: " + e.getClass().getName() + " - " + e.getMessage()))
                .map(userData -> {
                    String token = jwtUtil.generateToken(
                            userData.get("rut").toString(),
                            userData.get("rol").toString()
                    );
                    return new AuthResponse(
                            token,
                            userData.get("rut").toString(),
                            userData.get("rol").toString()
                    );
                });
         }
    }