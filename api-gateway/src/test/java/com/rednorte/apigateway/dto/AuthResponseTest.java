package com.rednorte.apigateway.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AuthResponse - Pruebas unitarias")
class AuthResponseTest {

    @Test
    @DisplayName("Debe crear AuthResponse con todos los campos")
    void deberiaCrearAuthResponse() {
        AuthResponse response = new AuthResponse("token123", "33333333-3", "MEDICO");
        assertEquals("token123", response.getToken());
        assertEquals("33333333-3", response.getRut());
        assertEquals("MEDICO", response.getRol());
    }

    @Test
    @DisplayName("Debe crear AuthResponse vacio con constructor sin argumentos")
    void deberiaCrearAuthResponseVacio() {
        AuthResponse response = new AuthResponse();
        assertNull(response.getToken());
        assertNull(response.getRut());
        assertNull(response.getRol());
    }

    @Test
    @DisplayName("Debe actualizar token con setter")
    void deberiaActualizarToken() {
        AuthResponse response = new AuthResponse();
        response.setToken("nuevoToken");
        assertEquals("nuevoToken", response.getToken());
    }

    @Test
    @DisplayName("Debe actualizar rut con setter")
    void deberiaActualizarRut() {
        AuthResponse response = new AuthResponse();
        response.setRut("11111111-1");
        assertEquals("11111111-1", response.getRut());
    }

    @Test
    @DisplayName("Dos AuthResponse con mismos datos deben ser iguales")
    void dosResponseIgualesDebenSerIguales() {
        AuthResponse r1 = new AuthResponse("token", "33333333-3", "MEDICO");
        AuthResponse r2 = new AuthResponse("token", "33333333-3", "MEDICO");
        assertEquals(r1, r2);
    }
}