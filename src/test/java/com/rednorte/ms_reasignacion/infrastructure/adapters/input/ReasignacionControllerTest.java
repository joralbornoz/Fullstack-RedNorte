package com.rednorte.ms_reasignacion.infrastructure.adapters.input;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.application.ports.in.ProcesarCitaCanceladaUseCase;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.infrastructure.config.SecurityConfig;
import com.rednorte.ms_reasignacion.infrastructure.dto.CitaCanceladaRequest;
import com.rednorte.ms_reasignacion.infrastructure.dto.ReasignacionRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReasignacionController.class)
@Import(SecurityConfig.class)
class ReasignacionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CrearReasignacionUseCase useCase;

    @MockitoBean
    private ProcesarCitaCanceladaUseCase procesarCancelacionUseCase;

    private Reasignacion reasignacionBase() {
        Reasignacion r = new Reasignacion("CITA-001", "12345678-9", "Cardiología");
        r.setId(1L);
        r.setEstado("PENDIENTE");
        return r;
    }

    @Test
    void crear_conDatosValidos_retorna200ConReasignacion() throws Exception {
        ReasignacionRequest request = new ReasignacionRequest();
        request.setIdCitaOriginal("CITA-001");
        request.setRutPaciente("12345678-9");
        request.setEspecialidad("Cardiología");

        when(useCase.ejecutar("CITA-001", "12345678-9", "Cardiología")).thenReturn(reasignacionBase());

        mockMvc.perform(post("/api/reasignaciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rutPaciente").value("12345678-9"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.idCitaOriginal").value("CITA-001"));
    }

    @Test
    void listar_retornaListaDeReasignaciones() throws Exception {
        when(useCase.listarTodas()).thenReturn(List.of(reasignacionBase()));

        mockMvc.perform(get("/api/reasignaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].idCitaOriginal").value("CITA-001"))
                .andExpect(jsonPath("$[0].especialidad").value("Cardiología"));
    }

    @Test
    void listar_sinRegistros_retornaArregloVacio() throws Exception {
        when(useCase.listarTodas()).thenReturn(List.of());

        mockMvc.perform(get("/api/reasignaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void buscarPorId_existente_retorna200ConReasignacion() throws Exception {
        when(useCase.obtenerPorId(1L)).thenReturn(reasignacionBase());

        mockMvc.perform(get("/api/reasignaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.rutPaciente").value("12345678-9"));
    }

    @Test
    void eliminar_retorna200YLlamaBorrar() throws Exception {
        doNothing().when(useCase).borrar(1L);

        mockMvc.perform(delete("/api/reasignaciones/1"))
                .andExpect(status().isOk());

        verify(useCase).borrar(1L);
    }

    @Test
    void actualizarEstado_retornaReasignacionConNuevoEstado() throws Exception {
        Reasignacion actualizada = reasignacionBase();
        actualizada.setEstado("COMPLETADO");
        when(useCase.actualizarEstado(1L, "COMPLETADO")).thenReturn(actualizada);

        mockMvc.perform(put("/api/reasignaciones/1/estado")
                        .param("nuevoEstado", "COMPLETADO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("COMPLETADO"));
    }

    @Test
    void procesarCancelacion_conDatosCompletos_retorna200() throws Exception {
        CitaCanceladaRequest request = new CitaCanceladaRequest();
        request.setIdCitaOriginal("CITA-001");
        request.setRutPaciente("12345678-9");
        request.setEspecialidad("Neurología");
        request.setMotivoCancelacion("Emergencia");
        request.setMedicoOriginal("Dr. Smith");
        request.setPrioridadReasignacion("ALTA");
        request.setRequiereExamenesPrevios(true);
        request.setPreferenciaHorario("MAÑANA");

        when(procesarCancelacionUseCase.procesarCancelacion(
                any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(reasignacionBase());

        mockMvc.perform(post("/api/reasignaciones/cita-cancelada")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rutPaciente").value("12345678-9"))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"));
    }

    @Test
    void procesarCancelacion_pasaParametrosCorrectosAlUseCase() throws Exception {
        CitaCanceladaRequest request = new CitaCanceladaRequest();
        request.setIdCitaOriginal("CITA-002");
        request.setRutPaciente("98765432-1");
        request.setEspecialidad("Traumatología");
        request.setMotivoCancelacion("Viaje");
        request.setMedicoOriginal("Dra. López");
        request.setPrioridadReasignacion("MEDIA");
        request.setRequiereExamenesPrevios(false);
        request.setPreferenciaHorario("TARDE");

        when(procesarCancelacionUseCase.procesarCancelacion(
                any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(reasignacionBase());

        mockMvc.perform(post("/api/reasignaciones/cita-cancelada")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(procesarCancelacionUseCase).procesarCancelacion(
                "CITA-002", "98765432-1", "Traumatología",
                "Viaje", "Dra. López", "MEDIA", false, "TARDE");
    }
}
