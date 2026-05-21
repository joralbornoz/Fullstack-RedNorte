package com.rednorte.msreasignacion.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
// 🔥 ESTO EVITA QUE LA APP SE ROMPA SI LLEGAN CAMPOS NUEVOS EN EL FUTURO
@JsonIgnoreProperties(ignoreUnknown = true)
public class PacienteCandidato {

    @JsonProperty("id")
    private String idInterconsulta;

    @JsonProperty("rutPaciente")
    private String rut;

    @JsonProperty("prioridad")
    private String prioridad;

    @JsonProperty("especialidadDestino")
    private String especialidad;

    // Agregamos los que faltaban para que el mapeo sea completo
    @JsonProperty("patologiaSospecha")
    private String patologiaSospecha;

    @JsonProperty("estado")
    private String estado;

    @JsonProperty("fechaIngreso")
    private String fechaIngreso;
}