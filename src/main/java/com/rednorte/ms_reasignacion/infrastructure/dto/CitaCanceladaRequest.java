package com.rednorte.ms_reasignacion.infrastructure.dto;

import lombok.Data;

@Data
public class CitaCanceladaRequest {
    private String idCitaOriginal;
    private String rutPaciente;
    private String especialidad;
    private String motivoCancelacion;
    private String medicoOriginal;
    private String prioridadReasignacion;
    private Boolean requiereExamenesPrevios;
    private String preferenciaHorario;
}
