package com.rednorte.ms_reasignacion.infrastructure.adapters.output;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReasignacionPersistenceAdapterTest {

    @Mock
    private JpaReasignacionRepository jpaRepository;

    @InjectMocks
    private ReasignacionPersistenceAdapter adapter;

    private ReasignacionEntity entity;
    private Reasignacion domain;

    @BeforeEach
    void setUp() {
        entity = new ReasignacionEntity();
        entity.setId(1L);
        entity.setIdCitaOriginal("CITA-001");
        entity.setRutPaciente("12345678-9");
        entity.setEspecialidad("Cardiología");
        entity.setFechaRegistro(LocalDateTime.of(2024, 1, 15, 10, 0));
        entity.setEstado("PENDIENTE");
        entity.setMotivoCancelacion("Emergencia");
        entity.setMedicoOriginal("Dr. Smith");
        entity.setPrioridadReasignacion("ALTA");
        entity.setRequiereExamenesPrevios(true);
        entity.setPreferenciaHorario("MAÑANA");

        domain = new Reasignacion("CITA-001", "12345678-9", "Cardiología");
        domain.setId(1L);
    }

    @Test
    void guardar_nuevaReasignacion_retornaDomainConIdAsignado() {
        when(jpaRepository.save(any())).thenReturn(entity);

        Reasignacion result = adapter.guardar(domain);

        assertThat(result.getId()).isEqualTo(1L);
        verify(jpaRepository).save(any(ReasignacionEntity.class));
    }

    @Test
    void guardar_conIdExistente_incluyeIdEnEntityParaActualizar() {
        domain.setId(5L);
        entity.setId(5L);
        when(jpaRepository.save(any())).thenReturn(entity);

        adapter.guardar(domain);

        verify(jpaRepository).save(argThat(e -> Long.valueOf(5L).equals(e.getId())));
    }

    @Test
    void guardar_sinId_noAsignaIdEnEntity() {
        Reasignacion sinId = new Reasignacion("CITA-002", "12345678-9", "Neurología");
        when(jpaRepository.save(any())).thenReturn(entity);

        adapter.guardar(sinId);

        verify(jpaRepository).save(argThat(e -> e.getId() == null));
    }

    @Test
    void obtenerTodas_mapeoCompletoDeEntityADomain() {
        when(jpaRepository.findAll()).thenReturn(List.of(entity));

        List<Reasignacion> result = adapter.obtenerTodas();

        assertThat(result).hasSize(1);
        Reasignacion r = result.get(0);
        assertThat(r.getId()).isEqualTo(1L);
        assertThat(r.getIdCitaOriginal()).isEqualTo("CITA-001");
        assertThat(r.getRutPaciente()).isEqualTo("12345678-9");
        assertThat(r.getEspecialidad()).isEqualTo("Cardiología");
        assertThat(r.getMotivoCancelacion()).isEqualTo("Emergencia");
        assertThat(r.getMedicoOriginal()).isEqualTo("Dr. Smith");
        assertThat(r.getPrioridadReasignacion()).isEqualTo("ALTA");
        assertThat(r.getRequiereExamenesPrevios()).isTrue();
        assertThat(r.getPreferenciaHorario()).isEqualTo("MAÑANA");
        assertThat(r.getEstado()).isEqualTo("PENDIENTE");
    }

    @Test
    void obtenerTodas_sinRegistros_retornaListaVacia() {
        when(jpaRepository.findAll()).thenReturn(List.of());

        List<Reasignacion> result = adapter.obtenerTodas();

        assertThat(result).isEmpty();
    }

    @Test
    void eliminar_delegaDeleteByIdAlJpaRepository() {
        adapter.eliminar(1L);

        verify(jpaRepository).deleteById(1L);
    }

    @Test
    void obtenerPorId_encontrado_retornaOptionalConDomainMapeado() {
        when(jpaRepository.findById(1L)).thenReturn(Optional.of(entity));

        Optional<Reasignacion> result = adapter.obtenerPorId(1L);

        assertThat(result).isPresent();
        Reasignacion r = result.get();
        assertThat(r.getId()).isEqualTo(1L);
        assertThat(r.getRutPaciente()).isEqualTo("12345678-9");
        assertThat(r.getEstado()).isEqualTo("PENDIENTE");
        assertThat(r.getMedicoOriginal()).isEqualTo("Dr. Smith");
    }

    @Test
    void obtenerPorId_noEncontrado_retornaOptionalVacio() {
        when(jpaRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Reasignacion> result = adapter.obtenerPorId(99L);

        assertThat(result).isEmpty();
    }
}
