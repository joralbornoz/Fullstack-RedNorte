package com.rednorte.msreasignacion.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Reasignacion {
    private String id;
    private String idInterconsultaOriginal;
    private String idInterconsultaNueva;
    private String rutPacienteReasignado;
    private String especialidad;
    private LocalDateTime fechaProcesamiento;
    private EstadoReasignacion estadoProceso;

    public Reasignacion marcarComoCompletada(String idNueva, String rutNuevo) {
        return this.toBuilder()
                .idInterconsultaNueva(idNueva)
                .rutPacienteReasignado(rutNuevo)
                .estadoProceso(EstadoReasignacion.COMPLETADO)
                .fechaProcesamiento(LocalDateTime.now())
                .build();
    }

    public Reasignacion marcarComoFallida() {
        return this.toBuilder()
                .estadoProceso(EstadoReasignacion.FALLIDO)
                .fechaProcesamiento(LocalDateTime.now())
                .build();
    }
}