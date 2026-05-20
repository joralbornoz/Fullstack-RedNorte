package com.rednorte.msreasignacion.infrastructure.adapter.in.web;

import com.fasterxml.jackson.annotation.JsonProperty; // 🔥 Importante
import lombok.Data;

@Data
public class ReasignacionRequest {

    @JsonProperty("idInterconsultaOriginal") // Mapea del JSON a esta variable
    private Long id;

    @JsonProperty("rutPaciente")
    private String rutPaciente;

    @JsonProperty("especialidad") // Mapea del JSON a esta variable
    private String specialtyDestino;

    private String highwayDestino; // Si no viene en el JSON, se quedará null

    private String motivo;

    // Tu lógica de getter sigue siendo excelente
    public String getEspecialidadDestino() {
        return specialtyDestino != null ? specialtyDestino : highwayDestino;
    }
}