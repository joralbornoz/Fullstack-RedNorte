package com.rednorte.ms_reasignacion.infrastructure.dto;

import lombok.Data;

@Data
public class ReasignacionRequest {
    private String idCitaOriginal;
    private String rutPaciente; // Aquí recibiremos el xxxxxxxx-x
    private String especialidad;
}