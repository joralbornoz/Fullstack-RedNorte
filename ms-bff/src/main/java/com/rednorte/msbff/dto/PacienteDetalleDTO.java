package com.rednorte.msbff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder; // <-- Fundamental para el Service
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder // <-- Permite que el Service use PacienteDetalleDTO.builder()
public class PacienteDetalleDTO {

    // Datos de ms-lista-espera (8002)
    private Long idInterconsulta;
    private String especialidad;
    private String prioridad; // Agregado para el flujo de reasignación
    private String estado;

    // Datos de ms-usuarios (8001)
    private String rut;
    private String nombreCompleto;
    private String numeroTelefono;
    private String email; // Agregado para notificaciones
}