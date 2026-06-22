package com.rednorte.apigateway.controller;

import com.rednorte.apigateway.config.JwtUtil;
import com.rednorte.apigateway.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController - Pruebas unitarias")
class AuthControllerTest {

    private JwtUtil jwtUtil;
    private AuthController authController;

    @Mock
    private WebClient.Builder webClientBuilder;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    @DisplayName("AuthResponse debe contener token rut y rol correctos")
    void authResponseDebeContenerCampos() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        AuthResponse response = new AuthResponse(token, "33333333-3", "MEDICO");

        assertNotNull(response.getToken());
        assertEquals("33333333-3", response.getRut());
        assertEquals("MEDICO", response.getRol());
    }

    @Test
    @DisplayName("Token generado debe ser valido")
    void tokenGeneradoDebeSerValido() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertDoesNotThrow(() -> jwtUtil.validateToken(token));
    }

    @Test
    @DisplayName("Token debe contener el rut correcto")
    void tokenDebeContenerRut() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertEquals("33333333-3", jwtUtil.extractUsername(token));
    }

    @Test
    @DisplayName("Token debe contener el rol correcto")
    void tokenDebeContenerRol() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertEquals("MEDICO", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("AuthResponse vacio no debe tener token")
    void authResponseVacioNoDebeTenerToken() {
        AuthResponse response = new AuthResponse();
        assertNull(response.getToken());
    }

    @Test
    @DisplayName("Token de admin debe contener rol ADMIN")
    void tokenAdminDebeContenerRol() {
        String token = jwtUtil.generateToken("11111111-1", "ADMIN");
        assertEquals("ADMIN", jwtUtil.extractRole(token));
    }
}