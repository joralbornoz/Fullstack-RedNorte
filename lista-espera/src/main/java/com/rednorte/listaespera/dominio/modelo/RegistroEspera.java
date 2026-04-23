package com.rednorte.listaespera.dominio.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "registros_espera") 
@Data
public class RegistroEspera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private LocalDate fechaIngreso;
    private String prioridad;
    private String estado;
}