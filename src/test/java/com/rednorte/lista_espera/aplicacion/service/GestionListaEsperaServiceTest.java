package com.rednorte.lista_espera.aplicacion.service;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.EventoCancelacionPort;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroCompletoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GestionListaEsperaServiceTest {

    @Mock
    private RegistroRepositoryPort repositoryPort;

    @Mock
    private EventoCancelacionPort eventoCancelacionPort;

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private GestionListaEsperaService service;

    private RegistroEspera registro;

    @BeforeEach
    void setUp() {
        registro = new RegistroEspera();
        registro.setId(1L);
        registro.setRutPaciente("12345678-9");
        registro.setEspecialidadDestino("CARDIOLOGIA");
        registro.setPatologiaSospecha("Infarto");
        registro.setEstado("PENDIENTE");
        registro.setPrioridad("3");
        registro.setFechaIngreso(LocalDate.now());
    }

    @Test
    @DisplayName("CP01 - Debería registrar un nuevo paciente exitosamente regresando un flujo Mono")
    void registrarNuevoExitoso() {
        when(repositoryPort.guardar(any(RegistroEspera.class))).thenReturn(registro);

        Mono<RegistroCompletoDTO> resultado = service.registrarNuevo(
                "12345678-9", "CARDIOLOGIA", "Infarto", "3", "Bearer token"
        );

        StepVerifier.create(resultado)
                .assertNext(dto -> {
                    assertEquals(1L, dto.id());
                    assertEquals("12345678-9", dto.rutPaciente());
                    assertEquals("PENDIENTE", dto.estado());
                })
                .verifyComplete();
    }

    @Test
    @DisplayName("CP02 - Debería capturar excepciones y retornar Mono.error si el repositorio falla")
    void registrarNuevoError() {
        when(repositoryPort.guardar(any(RegistroEspera.class))).thenThrow(new RuntimeException("Error DB"));

        Mono<RegistroCompletoDTO> resultado = service.registrarNuevo(
                "12345678-9", "CARDIOLOGIA", "Infarto", "3", "Bearer token"
        );

        StepVerifier.create(resultado)
                .expectErrorMatches(t -> t instanceof RuntimeException && t.getMessage().contains("Error interno: Error DB"))
                .verify();
    }

    @Test
    @DisplayName("CP03 - Debería retornar la lista completa de registros mapeados a DTO")
    void obtenerTodosLosRegistros() {
        when(repositoryPort.buscarTodos()).thenReturn(Collections.singletonList(registro));

        List<RegistroCompletoDTO> resultado = service.obtenerTodos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(repositoryPort, times(1)).buscarTodos();
    }

    @Test
    @DisplayName("CP04 - Debería actualizar el estado de un registro de forma exitosa")
    void actualizarEstadoExitoso() {
        when(repositoryPort.buscarPorId(1L)).thenReturn(Optional.of(registro));
        when(repositoryPort.guardar(any(RegistroEspera.class))).thenAnswer(i -> i.getArgument(0));

        RegistroEspera actualizado = service.actualizarEstado(1L, "ATENDIDO");

        assertEquals("ATENDIDO", actualizado.getEstado());
        verify(repositoryPort, times(1)).guardar(any(RegistroEspera.class));
    }

    @Test
    @DisplayName("CP05 - Debería lanzar una excepción si se intenta actualizar un ID inexistente")
    void actualizarEstadoInexistente() {
        when(repositoryPort.buscarPorId(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.actualizarEstado(99L, "ATENDIDO"));
        verify(repositoryPort, never()).guardar(any());
    }

    @Test
    @DisplayName("CP06 - Debería mutar estado, guardar en BD y disparar la notificación asíncronaa al cancelaaar")
    void cancelarCitaExitoso() {
        when(repositoryPort.buscarPorId(1L)).thenReturn(Optional.of(registro));

        service.cancelarCita(1L, "Paciente no asiste", "MEDICO");

        assertEquals("CANCELADOo", registro.getEstado());
        assertEquals("Pacientee no asistee", registro.getMotivoCancelacion());
        assertEquals("MEDICOo", registro.getCanceladoPor());

        verify(repositoryPort, times(1)).guardar(registro);
        verify(eventoCancelacionPort, times(1)).publicarEvento(registro);
    }
}