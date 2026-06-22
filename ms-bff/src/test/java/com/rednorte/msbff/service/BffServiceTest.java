package com.rednorte.msbff.service;

import com.rednorte.msbff.client.ExternalServiceClient;
import com.rednorte.msbff.dto.CancelacionDTO;
import com.rednorte.msbff.dto.RegistroListaEsperaDetalleDTO;
import com.rednorte.msbff.service.BffService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BffService - Pruebas unitarias")
class BffServiceTest {

    @Mock
    private ExternalServiceClient client;

    @InjectMocks
    private BffService bffService;

    private final String TOKEN = "Bearer test-token";

    @Test
    @DisplayName("Debe calcular total de pacientes correctamente")
    void deberiaCalcularTotalPacientes() {
        Map<String, Object> r1 = Map.of("estado", "PENDIENTE", "rutPaciente", "77777777-7");
        Map<String, Object> r2 = Map.of("estado", "CONFIRMADO", "rutPaciente", "88888888-8");
        Map<String, Object> r3 = Map.of("estado", "PENDIENTE", "rutPaciente", "99999999-9");

        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.just(r1, r2, r3));

        StepVerifier.create(bffService.obtenerResumenDashboard(TOKEN))
                .expectNextMatches(dto -> dto.totalPacientes() == 3)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe contar solo registros PENDIENTE como en espera")
    void deberiaContarSoloPendientes() {
        Map<String, Object> pendiente  = Map.of("estado", "PENDIENTE",  "rutPaciente", "77777777-7");
        Map<String, Object> confirmado = Map.of("estado", "CONFIRMADO", "rutPaciente", "88888888-8");
        Map<String, Object> cancelado  = Map.of("estado", "CANCELADO",  "rutPaciente", "99999999-9");

        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.just(pendiente, confirmado, cancelado));

        StepVerifier.create(bffService.obtenerResumenDashboard(TOKEN))
                .expectNextMatches(dto -> dto.enEspera() == 1)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar cero si no hay registros")
    void deberiaRetornarCeroSiNoHayRegistros() {
        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.empty());

        StepVerifier.create(bffService.obtenerResumenDashboard(TOKEN))
                .expectNextMatches(dto ->
                        dto.totalPacientes() == 0 && dto.enEspera() == 0)
                .verifyComplete();
    }

    @Test
    @DisplayName("Tiempo promedio debe ser 15 min por defecto")
    void tiempoPromedioDebeSerValorDefecto() {
        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.empty());

        StepVerifier.create(bffService.obtenerResumenDashboard(TOKEN))
                .expectNextMatches(dto -> "15 min".equals(dto.tiempoPromedio()))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe contar todos como pendientes si todos estan en espera")
    void deberiaContarTodosComoEnEspera() {
        Map<String, Object> r1 = Map.of("estado", "PENDIENTE", "rutPaciente", "77777777-7");
        Map<String, Object> r2 = Map.of("estado", "PENDIENTE", "rutPaciente", "88888888-8");

        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.just(r1, r2));

        StepVerifier.create(bffService.obtenerResumenDashboard(TOKEN))
                .expectNextMatches(dto ->
                        dto.totalPacientes() == 2 && dto.enEspera() == 2)
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe combinar datos de lista-espera y usuarios en DTO")
    void deberiaCombinarDatosEnDTO() {
        Map<String, Object> registro = new HashMap<>();
        registro.put("id", 1);
        registro.put("rutPaciente", "77777777-7");
        registro.put("especialidadDestino", "Cardiologia");
        registro.put("patologiaSospecha", "Arritmia");
        registro.put("prioridad", "ALTA");
        registro.put("estado", "PENDIENTE");
        registro.put("fechaIngreso", "2024-01-15");

        Map<String, Object> usuario = Map.of(
                "nombreCompleto", "Maria Gonzalez",
                "email", "p.gonzalez@gmail.com"
        );

        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.just(registro));
        when(client.obtenerUsuarioPorRutComoMap(anyString(), anyString()))
                .thenReturn(Mono.just(usuario));

        StepVerifier.create(bffService.obtenerListaEsperaDetallada(TOKEN))
                .expectNextMatches(dto ->
                        "Maria Gonzalez".equals(dto.nombreCompleto()) &&
                                "p.gonzalez@gmail.com".equals(dto.email()) &&
                                "Cardiologia".equals(dto.especialidadDestino())
                )
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe usar valores por defecto si ms-usuarios no responde")
    void deberiaUsarValoresPorDefectoSiUsuariosFalla() {
        Map<String, Object> registro = new HashMap<>();
        registro.put("id", 1);
        registro.put("rutPaciente", "77777777-7");
        registro.put("especialidadDestino", "Cardiologia");
        registro.put("patologiaSospecha", "Arritmia");
        registro.put("prioridad", "ALTA");
        registro.put("estado", "PENDIENTE");
        registro.put("fechaIngreso", "2024-01-15");

        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.just(registro));
        when(client.obtenerUsuarioPorRutComoMap(anyString(), anyString()))
                .thenReturn(Mono.empty());

        StepVerifier.create(bffService.obtenerListaEsperaDetallada(TOKEN))
                .expectNextMatches(dto ->
                        "Usuario no encontrado".equals(dto.nombreCompleto()) &&
                                "N/A".equals(dto.email())
                )
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe retornar Flux vacio si no hay registros en lista detallada")
    void deberiaRetornarFluxVacioSiNoHayRegistros() {
        when(client.obtenerListaEsperaParaDashboard(anyString()))
                .thenReturn(Flux.empty());

        StepVerifier.create(bffService.obtenerListaEsperaDetallada(TOKEN))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe cancelar correctamente sin error")
    void deberiaCancelarCorrectamente() {
        CancelacionDTO dto = new CancelacionDTO(
                1L, "77777777-7", "Cardiologia", "Paciente no disponible", "MEDICO");

        when(client.cancelarListaEspera(any())).thenReturn(Mono.empty());

        StepVerifier.create(bffService.cancelarYReasignar(dto, TOKEN))
                .verifyComplete();

        verify(client, times(1)).cancelarListaEspera(any());
    }

    @Test
    @DisplayName("Debe completar sin error aunque cancelacion falle")
    void deberiaCompletarSinErrorAunqueFalle() {
        CancelacionDTO dto = new CancelacionDTO(
                1L, "77777777-7", "Cardiologia", "Motivo", "MEDICO");

        when(client.cancelarListaEspera(any()))
                .thenReturn(Mono.error(new RuntimeException("Servicio no disponible")));

        StepVerifier.create(bffService.cancelarYReasignar(dto, TOKEN))
                .verifyComplete();
    }

    @Test
    @DisplayName("Debe delegar consultas de paciente al client")
    void deberiaDelegarConsultasPaciente() {
        when(client.consultasPaciente(anyString(), anyString()))
                .thenReturn(Mono.empty());

        bffService.obtenerMisConsultas("77777777-7", TOKEN);

        verify(client, times(1)).consultasPaciente("77777777-7", TOKEN);
    }
}