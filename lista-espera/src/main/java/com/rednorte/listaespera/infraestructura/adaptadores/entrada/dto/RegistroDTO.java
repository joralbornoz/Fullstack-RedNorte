package com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto;


public class RegistroDTO {
    private Long id;
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha; 
    private String prioridad;
    private String estado;

    public RegistroDTO() {}

    public RegistroDTO(Long id, String rutPaciente, String especialidadDestino, String patologiaSospecha, String prioridad, String estado) {
        this.id = id;
        this.rutPaciente = rutPaciente;
        this.especialidadDestino = especialidadDestino;
        this.patologiaSospecha = patologiaSospecha;
        this.prioridad = prioridad;
        this.estado = estado;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRutPaciente() { return rutPaciente; }
    public void setRutPaciente(String rutPaciente) { this.rutPaciente = rutPaciente; }
    
    public String getEspecialidadDestino() { return especialidadDestino; }
    public void setEspecialidadDestino(String especialidadDestino) { this.especialidadDestino = especialidadDestino; }

    public String getPatologiaSospecha() { return patologiaSospecha; }
    public void setPatologiaSospecha(String patologiaSospecha) { this.patologiaSospecha = patologiaSospecha; }

    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}