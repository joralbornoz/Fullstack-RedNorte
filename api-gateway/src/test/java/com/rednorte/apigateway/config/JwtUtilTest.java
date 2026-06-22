package com.rednorte.apigateway.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JwtUtil - Pruebas unitarias")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    @DisplayName("Debe generar token no nulo")
    void deberiaGenerarTokenNoNulo() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertNotNull(token);
    }

    @Test
    @DisplayName("Token debe tener 3 partes separadas por punto")
    void tokenDebeTener3Partes() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    @DisplayName("Debe extraer RUT correctamente")
    void deberiaExtraerRut() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertEquals("33333333-3", jwtUtil.extractUsername(token));
    }

    @Test
    @DisplayName("Debe extraer rol MEDICO")
    void deberiaExtraerRolMedico() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertEquals("MEDICO", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Debe extraer rol ADMIN")
    void deberiaExtraerRolAdmin() {
        String token = jwtUtil.generateToken("11111111-1", "ADMIN");
        assertEquals("ADMIN", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Debe extraer rol PACIENTE")
    void deberiaExtraerRolPaciente() {
        String token = jwtUtil.generateToken("77777777-7", "PACIENTE");
        assertEquals("PACIENTE", jwtUtil.extractRole(token));
    }

    @Test
    @DisplayName("Debe validar token valido sin excepcion")
    void deberiaValidarTokenValido() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertDoesNotThrow(() -> jwtUtil.validateToken(token));
    }

    @Test
    @DisplayName("Debe lanzar excepcion con token invalido")
    void deberiaLanzarExcepcionTokenInvalido() {
        assertThrows(Exception.class,
                () -> jwtUtil.validateToken("token.invalido.falso"));
    }

    @Test
    @DisplayName("Debe lanzar excepcion con token vacio")
    void deberiaLanzarExcepcionTokenVacio() {
        assertThrows(Exception.class,
                () -> jwtUtil.validateToken(""));
    }

    @Test
    @DisplayName("Tokens distintos para usuarios distintos")
    void tokensDiferentesParaUsuariosDiferentes() {
        String token1 = jwtUtil.generateToken("33333333-3", "MEDICO");
        String token2 = jwtUtil.generateToken("11111111-1", "ADMIN");
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Token no debe estar vacio")
    void tokenNoDebeEstarVacio() {
        String token = jwtUtil.generateToken("33333333-3", "MEDICO");
        assertFalse(token.isEmpty());
    }
}