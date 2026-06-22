package com.rednorte.apigateway.filter;

import com.rednorte.apigateway.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("JwtWebFilter - Pruebas unitarias")
class JwtWebFilterTest {

    private JwtUtil jwtUtil;
    private JwtWebFilter filter;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        filter = new JwtWebFilter(jwtUtil);
    }

    @Test
    @DisplayName("Peticion sin token debe continuar la cadena")
    void peticionSinTokenDebeContinuar() {
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/v1/auth/login").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = ex -> Mono.empty();

        StepVerifier.create(filter.filter(exchange, chain))
                .verifyComplete();
    }

    @Test
    @DisplayName("Peticion con token valido debe continuar")
    void peticionConTokenValidoDebeContinuar() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/v1/bff/lista-espera/todos")
                .header("Authorization", "Bearer " + token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = ex -> Mono.empty();

        StepVerifier.create(filter.filter(exchange, chain))
                .verifyComplete();
    }

    @Test
    @DisplayName("Peticion con token invalido debe continuar sin autenticacion")
    void peticionConTokenInvalidoDebeContinuar() {
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/v1/bff/lista-espera/todos")
                .header("Authorization", "Bearer token.invalido.xxx")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = ex -> Mono.empty();

        StepVerifier.create(filter.filter(exchange, chain))
                .verifyComplete();
    }

    @Test
    @DisplayName("Token de admin debe procesarse correctamente")
    void tokenAdminDebeProcearse() {
        String token = jwtUtil.generateToken("11111111-1", "ADMIN");

        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/v1/admin/usuarios")
                .header("Authorization", "Bearer " + token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);
        WebFilterChain chain = ex -> Mono.empty();

        StepVerifier.create(filter.filter(exchange, chain))
                .verifyComplete();
    }
}