package com.rednorte.msbff.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GlobalExceptionHandler - Pruebas unitarias")
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("Debe manejar error 503 de WebClient")
    void deberiaManejarError503() {
        WebClientResponseException ex = WebClientResponseException.create(
                503, "Service Unavailable", null, null, null);

        ResponseEntity<Map<String, String>> response = handler.handleWebClientError(ex);

        assertEquals(503, response.getStatusCode().value());
        assertTrue(response.getBody().containsKey("error"));
        assertTrue(response.getBody().containsKey("detalle"));
    }

    @Test
    @DisplayName("Debe manejar error 404 de WebClient")
    void deberiaManejarError404() {
        WebClientResponseException ex = WebClientResponseException.create(
                404, "Not Found", null, null, null);

        ResponseEntity<Map<String, String>> response = handler.handleWebClientError(ex);

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    @DisplayName("Debe manejar error 401 de WebClient")
    void deberiaManejarError401() {
        WebClientResponseException ex = WebClientResponseException.create(
                401, "Unauthorized", null, null, null);

        ResponseEntity<Map<String, String>> response = handler.handleWebClientError(ex);

        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    @DisplayName("Debe manejar excepcion generica con status 500")
    void deberiaManejarExcepcionGenerica() {
        Exception ex = new RuntimeException("Error inesperado");

        ResponseEntity<Map<String, String>> response = handler.handleGeneral(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error interno del BFF", response.getBody().get("error"));
        assertEquals("Error inesperado", response.getBody().get("detalle"));
    }

    @Test
    @DisplayName("Respuesta de error debe contener clave error y detalle")
    void respuestaDebeContenerClaves() {
        Exception ex = new RuntimeException("fallo");
        ResponseEntity<Map<String, String>> response = handler.handleGeneral(ex);
        assertTrue(response.getBody().containsKey("error"));
        assertTrue(response.getBody().containsKey("detalle"));
    }

    @Test
    @DisplayName("Error de WebClient debe contener status en el body")
    void errorWebClientDebeContenerStatus() {
        WebClientResponseException ex = WebClientResponseException.create(
                500, "Internal Server Error", null, null, null);

        ResponseEntity<Map<String, String>> response = handler.handleWebClientError(ex);
        assertTrue(response.getBody().containsKey("status"));
    }
}