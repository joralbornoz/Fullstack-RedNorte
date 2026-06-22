package com.rednorte.ms_reasignacion.application.service;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReasignacionServiceTest {

    @Mock
    private ReasignacionRepository reasignacionRepository;

    @InjectMocks
    private ReasignacionService service;

    private Reasignacion reasignacion;

    @BeforeEach
    void setUp() {
        reasignacion = new Reasignacion("CITA-001", "12345678-9", "Cardiología");
        reasignacion.setId(1L);
    }

    @Test
    void ejecutar_conRutValido_guardaYRetornaReasignacion() {
        when(reasignacionRepository.guardar(any())).thenReturn(reasignacion);

        Reasignacion result = service.ejecutar("CITA-001", "12345678-9", "Cardiología");

        assertThat(result).isNotNull();
        assertThat(result.getRutPaciente()).isEqualTo("12345678-9");
        assertThat(result.getEstado()).isEqualTo("PENDIENTE");
        verify(reasignacionRepository).guardar(any(Reasignacion.class));
    }

    @Test
    void ejecutar_conRutNulo_lanzaIllegalArgumentException() {
        assertThatThrownBy(() -> service.ejecutar("CITA-001", null, "Cardiología"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("RUT");

        verifyNoInteractions(reasignacionRepository);
    }

    @Test
    void ejecutar_conRutSinGuion_lanzaIllegalArgumentException() {
        assertThatThrownBy(() -> service.ejecutar("CITA-001", "123456789", "Cardiología"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("guion");

        verifyNoInteractions(reasignacionRepository);
    }

    @Test
    void listarTodas_retornaListaCompleta() {
        when(reasignacionRepository.obtenerTodas()).thenReturn(List.of(reasignacion));

        List<Reasignacion> result = service.listarTodas();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIdCitaOriginal()).isEqualTo("CITA-001");
        verify(reasignacionRepository).obtenerTodas();
    }

    @Test
    void listarTodas_sinRegistros_retornaListaVacia() {
        when(reasignacionRepository.obtenerTodas()).thenReturn(List.of());

        List<Reasignacion> result = service.listarTodas();

        assertThat(result).isEmpty();
    }

    @Test
    void borrar_delegaAlRepositorio() {
        service.borrar(1L);

        verify(reasignacionRepository).eliminar(1L);
    }

    @Test
    void obtenerPorId_existente_retornaReasignacion() {
        when(reasignacionRepository.obtenerPorId(1L)).thenReturn(Optional.of(reasignacion));

        Reasignacion result = service.obtenerPorId(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getRutPaciente()).isEqualTo("12345678-9");
    }

    @Test
    void obtenerPorId_noExistente_lanzaIllegalArgumentException() {
        when(reasignacionRepository.obtenerPorId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.obtenerPorId(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("99");
    }

    @Test
    void actualizarEstado_cambiaEstadoYGuarda() {
        when(reasignacionRepository.obtenerPorId(1L)).thenReturn(Optional.of(reasignacion));
        when(reasignacionRepository.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Reasignacion result = service.actualizarEstado(1L, "COMPLETADO");

        assertThat(result.getEstado()).isEqualTo("COMPLETADO");
        verify(reasignacionRepository).guardar(reasignacion);
    }

    @Test
    void actualizarEstado_idNoExistente_lanzaExcepcion() {
        when(reasignacionRepository.obtenerPorId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.actualizarEstado(99L, "COMPLETADO"))
                .isInstanceOf(IllegalArgumentException.class);

        verify(reasignacionRepository, never()).guardar(any());
    }
}
