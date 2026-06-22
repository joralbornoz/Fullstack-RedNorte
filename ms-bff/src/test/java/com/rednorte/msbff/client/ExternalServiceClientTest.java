package com.rednorte.msbff.client;

import com.rednorte.msbff.dto.CancelacionDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.test.StepVerifier;

import java.lang.reflect.Field;
import java.util.Map;

@DisplayName("ExternalServiceClient - Pruebas unitarias")
class ExternalServiceClientTest {

    private ExternalServiceClient client;

    @BeforeEach
    void setUp() throws Exception {
        client = new ExternalServiceClient(WebClient.builder());
        setField(client, "URL_LISTA_ESPERA", "http://localhost:9999/api/v1");
        setField(client, "URL_USUARIOS",     "http://localhost:9999/api/v1");
        setField(client, "URL_REASIGNACION", "http://localhost:9999/api/v1");
    }

    private void setField(Object obj, String name, String value) throws Exception {
        Field f = obj.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.set(obj, value);
    }

    @Test
    @DisplayName("Debe retornar Flux vacio cuando ms-lista-espera no responde")
    void deberiaRetornarFluxVacioCuandoFalla() {
        StepVerifier.create(client.obtenerListaEsperaParaDashboard("Bearer token"))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar 503 cuando obtenerListaEsperaTodos falla")
    void deberiaRetornar503CuandoListaFalla() {
        StepVerifier.create(client.obtenerListaEsperaTodos("Bearer token"))
                .expectNextMatches(r -> r.getStatusCode().value() == 503)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar 503 cuando listarUsuarios falla")
    void deberiaRetornar503CuandoUsuariosFalla() {
        StepVerifier.create(client.listarUsuarios("Bearer token"))
                .expectNextMatches(r -> r.getStatusCode().value() == 503)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar 503 cuando consultasPaciente falla")
    void deberiaRetornar503CuandoConsultasFalla() {
        StepVerifier.create(client.consultasPaciente("77777777-7", "Bearer token"))
                .expectNextMatches(r -> r.getStatusCode().value() == 503)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar vacio cuando obtenerDetallePaciente falla")
    void deberiaRetornarVacioCuandoDetalleFalla() {
        StepVerifier.create(client.obtenerDetallePaciente(1L))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar usuario no encontrado cuando falla")
    void deberiaRetornarUsuarioNoEncontrado() {
        StepVerifier.create(client.obtenerUsuarioPorRutComoMap("33333333-3", "Bearer token"))
                .expectNextMatches(m -> "Usuario no encontrado".equals(m.get("nombreCompleto")))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe completar cancelacion sin error aunque falle")
    void deberiaCancelarSinError() {
        CancelacionDTO dto = new CancelacionDTO(
                1L, "77777777-7", "Cardiologia", "Motivo", "MEDICO");
        StepVerifier.create(client.cancelarListaEspera(dto))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe completar reasignacion sin error aunque falle")
    void deberiaReasignarSinError() {
        StepVerifier.create(client.dispararReasignacion(
                        Map.of("especialidad", "Cardiologia"), "Bearer token"))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar 503 cuando registrarConsulta falla")
    void deberiaRetornar503CuandoRegistrarFalla() {
        StepVerifier.create(client.registrarConsulta(
                        Map.of("rut", "77777777-7"), "Bearer token"))
                .expectNextMatches(r -> r.getStatusCode().value() == 503)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar 503 cuando registrarUsuario falla")
    void deberiaRetornar503CuandoRegistrarUsuarioFalla() {
        StepVerifier.create(client.registrarUsuario(
                        Map.of("rut", "77777777-7"), "Bearer token"))
                .expectNextMatches(r -> r.getStatusCode().value() == 503)
                .verifyComplete();
    }
}