package com.rednorte.listaespera.dominio.modelo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistroEspera {
    private Long id;
    private String rutPaciente;
    private String nombrePaciente;
    private String tipoAtencion; 
    private String prioridad;    
    private LocalDateTime fechaRegistro;
    private EstadoEspera estado; 

    public RegistroEspera() {
        this.fechaRegistro = LocalDateTime.now();
    }
}