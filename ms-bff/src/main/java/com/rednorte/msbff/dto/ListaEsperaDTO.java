package com.rednorte.msbff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListaEsperaDTO {
    private Long id;
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private LocalDate fechaIngreso;
    private String prioridad;
    private String estado;
}