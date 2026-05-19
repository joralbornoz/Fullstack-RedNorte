package com.rednorte.ms_reasignacion.domain.model;

import java.time.LocalDateTime;

public class Reasignacion {
    private Long id;
    private String idCitaOriginal;
    private String rutPaciente;
    private String especialidad;
    private LocalDateTime fechaRegistro;
    
    private String motivoCancelacion;
    private String medicoOriginal;
    private String prioridadReasignacion;
    private Boolean requiereExamenesPrevios;
    private String preferenciaHorario;
    private String estado;

    public Reasignacion() {}

    public Reasignacion(String idCitaOriginal, String rutPaciente, String especialidad) {
        this.idCitaOriginal = idCitaOriginal;
        this.rutPaciente = rutPaciente;
        this.especialidad = especialidad;
        this.fechaRegistro = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIdCitaOriginal() { return idCitaOriginal; }
    public void setIdCitaOriginal(String idCitaOriginal) { this.idCitaOriginal = idCitaOriginal; }
    public String getRutPaciente() { return rutPaciente; }
    public void setRutPaciente(String rutPaciente) { this.rutPaciente = rutPaciente; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    
    public String getMotivoCancelacion() { return motivoCancelacion; }
    public void setMotivoCancelacion(String motivoCancelacion) { this.motivoCancelacion = motivoCancelacion; }
    public String getMedicoOriginal() { return medicoOriginal; }
    public void setMedicoOriginal(String medicoOriginal) { this.medicoOriginal = medicoOriginal; }
    public String getPrioridadReasignacion() { return prioridadReasignacion; }
    public void setPrioridadReasignacion(String prioridadReasignacion) { this.prioridadReasignacion = prioridadReasignacion; }
    public Boolean getRequiereExamenesPrevios() { return requiereExamenesPrevios; }
    public void setRequiereExamenesPrevios(Boolean requiereExamenesPrevios) { this.requiereExamenesPrevios = requiereExamenesPrevios; }
    public String getPreferenciaHorario() { return preferenciaHorario; }
    public void setPreferenciaHorario(String preferenciaHorario) { this.preferenciaHorario = preferenciaHorario; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}