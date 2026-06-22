package com.rednorte.ms_reasignacion.domain.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class ReasignacionTest {

    @Test
    void constructorConParametros_inicializaCamposObligatorios() {
        Reasignacion r = new Reasignacion("CITA-001", "12345678-9", "Cardiología");

        assertThat(r.getIdCitaOriginal()).isEqualTo("CITA-001");
        assertThat(r.getRutPaciente()).isEqualTo("12345678-9");
        assertThat(r.getEspecialidad()).isEqualTo("Cardiología");
    }

    @Test
    void constructorConParametros_estableceEstadoPendienteYFechaActual() {
        Reasignacion r = new Reasignacion("CITA-001", "12345678-9", "Cardiología");

        assertThat(r.getEstado()).isEqualTo("PENDIENTE");
        assertThat(r.getFechaRegistro())
                .isNotNull()
                .isCloseTo(LocalDateTime.now(), within(2, ChronoUnit.SECONDS));
    }

    @Test
    void constructorVacio_noCargaCampos() {
        Reasignacion r = new Reasignacion();

        assertThat(r.getId()).isNull();
        assertThat(r.getRutPaciente()).isNull();
        assertThat(r.getEstado()).isNull();
        assertThat(r.getFechaRegistro()).isNull();
    }

    @Test
    void setId_actualizaId() {
        Reasignacion r = new Reasignacion();
        r.setId(42L);

        assertThat(r.getId()).isEqualTo(42L);
    }

    @Test
    void setEstado_actualizaEstado() {
        Reasignacion r = new Reasignacion("CITA-001", "12345678-9", "Cardiología");
        r.setEstado("COMPLETADO");

        assertThat(r.getEstado()).isEqualTo("COMPLETADO");
    }

    @Test
    void setCamposOpcionales_seAlmacenanCorrectamente() {
        Reasignacion r = new Reasignacion();
        r.setMotivoCancelacion("Emergencia");
        r.setMedicoOriginal("Dr. Smith");
        r.setPrioridadReasignacion("ALTA");
        r.setRequiereExamenesPrevios(true);
        r.setPreferenciaHorario("MAÑANA");

        assertThat(r.getMotivoCancelacion()).isEqualTo("Emergencia");
        assertThat(r.getMedicoOriginal()).isEqualTo("Dr. Smith");
        assertThat(r.getPrioridadReasignacion()).isEqualTo("ALTA");
        assertThat(r.getRequiereExamenesPrevios()).isTrue();
        assertThat(r.getPreferenciaHorario()).isEqualTo("MAÑANA");
    }

    @Test
    void setFechaRegistro_actualizaFecha() {
        Reasignacion r = new Reasignacion();
        LocalDateTime fecha = LocalDateTime.of(2024, 6, 15, 10, 30);
        r.setFechaRegistro(fecha);

        assertThat(r.getFechaRegistro()).isEqualTo(fecha);
    }
}
