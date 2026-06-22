package com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto;

import lombok.Data;

/**
 * DTO independiente para la captura de datos de la cancelación de citas
 */
@Data // Usamos Lombok para que no tengas que escribir los getters y setters a mano aquí
public class CancelarRequest {
    private Long idInterconsulta;
    private String motivo;
    private String canceladoPor; // 'MEDICO' o 'PACIENTE'
}