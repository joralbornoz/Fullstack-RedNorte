package com.rednorte.listaespera.dominio.modelo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroEspera {
    private Long id; 
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private LocalDate fechaIngreso;
    private String prioridad;
    private String estado; 
}