package com.rednorte.ms_reasignacion.application.service;

import com.rednorte.ms_reasignacion.application.ports.out.CitaCanceladaEventPort;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CitaCanceladaServiceTest {

    @Mock
    private ReasignacionRepository reasignacionRepository;

    @Mock
    private CitaCanceladaEventPort eventPort;

    @InjectMocks
    private CitaCanceladaService service;

    private Reasignacion reasignacion;

    @BeforeEach
    void setUp() {
        reasignacion = new Reasignacion("CITA-001", "12345678-9", "Neurología");
        reasignacion.setId(1L);
    }

    @Test
    void procesarCancelacion_conDatosValidos_guardaYPublicaEvento() {
        when(reasignacionRepository.guardar(any())).thenReturn(reasignacion);

        Reasignacion result = service.procesarCancelacion(
                "CITA-001", "12345678-9", "Neurología",
                "Emergencia", "Dr. Smith", "ALTA", true, "MAÑANA");

        assertThat(result).isNotNull();
        assertThat(result.getRutPaciente()).isEqualTo("12345678-9");
        verify(reasignacionRepository).guardar(any(Reasignacion.class));
        verify(eventPort).publicarCancelacionA5Microservicios(reasignacion);
    }

    @Test
    void procesarCancelacion_asignaTodosLosCamposAlDomain() {
        when(reasignacionRepository.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Reasignacion result = service.procesarCancelacion(
                "CITA-002", "98765432-1", "Traumatología",
                "Viaje", "Dra. López", "MEDIA", false, "TARDE");

        assertThat(result.getIdCitaOriginal()).isEqualTo("CITA-002");
        assertThat(result.getRutPaciente()).isEqualTo("98765432-1");
        assertThat(result.getEspecialidad()).isEqualTo("Traumatología");
        assertThat(result.getMotivoCancelacion()).isEqualTo("Viaje");
        assertThat(result.getMedicoOriginal()).isEqualTo("Dra. López");
        assertThat(result.getPrioridadReasignacion()).isEqualTo("MEDIA");
        assertThat(result.getRequiereExamenesPrevios()).isFalse();
        assertThat(result.getPreferenciaHorario()).isEqualTo("TARDE");
        assertThat(result.getEstado()).isEqualTo("PENDIENTE");
    }

    @Test
    void procesarCancelacion_publicaEventoConReasignacionGuardada() {
        when(reasignacionRepository.guardar(any())).thenReturn(reasignacion);

        service.procesarCancelacion(
                "CITA-001", "12345678-9", "Neurología",
                "Emergencia", "Dr. Smith", "ALTA", true, "MAÑANA");

        verify(eventPort, times(1)).publicarCancelacionA5Microservicios(reasignacion);
    }

    @Test
    void procesarCancelacion_conRutNulo_lanzaExcepcionSinGuardarNiPublicar() {
        assertThatThrownBy(() -> service.procesarCancelacion(
                "CITA-001", null, "Neurología",
                "Emergencia", "Dr. Smith", "ALTA", true, "MAÑANA"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("RUT");

        verifyNoInteractions(reasignacionRepository, eventPort);
    }

    @Test
    void procesarCancelacion_conRutSinGuion_lanzaExcepcionSinGuardarNiPublicar() {
        assertThatThrownBy(() -> service.procesarCancelacion(
                "CITA-001", "123456789", "Neurología",
                "Emergencia", "Dr. Smith", "ALTA", true, "MAÑANA"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("guion");

        verifyNoInteractions(reasignacionRepository, eventPort);
    }
}
