package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "registros_espera")
@Data
public class RegistroEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private String prioridad;
    private String estado;
    private LocalDate fechaIngreso;
}