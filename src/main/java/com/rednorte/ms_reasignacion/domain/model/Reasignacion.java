package com.rednorte.ms_reasignacion.domain.model;

import java.time.LocalDateTime;

public class Reasignacion {
    private Long id;
    private String idCitaOriginal;
    private String rutPaciente;
    private String especialidad;
    private LocalDateTime fechaRegistro;

    public Reasignacion() {}

    public Reasignacion(String idCitaOriginal, String rutPaciente, String especialidad) {
        this.idCitaOriginal = idCitaOriginal;
        this.rutPaciente = rutPaciente;
        this.especialidad = especialidad;
        this.fechaRegistro = LocalDateTime.now();
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
}