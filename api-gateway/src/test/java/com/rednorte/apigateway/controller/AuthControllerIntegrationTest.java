package com.rednorte.apigateway.controller;

import com.rednorte.apigateway.config.JwtUtil;
import com.rednorte.apigateway.dto.AuthResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController - Pruebas logica de negocio")
class AuthControllerIntegrationTest {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    @DisplayName("JwtUtil genera token que AuthController usaria")
    void jwtUtilGeneraTokenCorrecto() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertNotNull(token);
        assertEquals("33333333-3", jwtUtil.extractUsername(token));
        assertEquals("MEDICO", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("AuthResponse debe construirse con los datos del token")
    void authResponseDebeConstruirseConDatosToken() {
        String rut = "33333333-3";
        String rol = "MEDICO";
        String token = jwtUtil.generateToken(rut, rol);

        AuthResponse response = new AuthResponse(token, rut, rol);

        assertNotNull(response.getToken());
        assertEquals(rut, response.getRut());
        assertEquals(rol, response.getRol());
    }

    @Test
    @DisplayName("Token generado para ADMIN debe tener rol correcto")
    void tokenAdminDebeContenerRolAdmin() {
        String token = jwtUtil.generateToken("11111111-1", "ADMIN");
        assertEquals("ADMIN", jwtUtil.extractRole(token));
        assertEquals("11111111-1", jwtUtil.extractUsername(token));
    }

    @Test
    @DisplayName("Token generado para PACIENTE debe tener rol correcto")
    void tokenPacienteDebeContenerRolPaciente() {
        String token = jwtUtil.generateToken("77777777-7", "PACIENTE");
        assertEquals("PACIENTE", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Token invalido no debe pasar validacion")
    void tokenInvalidoNoDebePassarValidacion() {
        assertThrows(Exception.class,
                () -> jwtUtil.validateToken("eyJ.invalido.xxx"));
    }
}