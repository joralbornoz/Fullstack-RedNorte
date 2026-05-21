package com.rednorte.msbff.dto;

public record RegistroListaEsperaDetalleDTO(
        Long id,
        String rutPaciente,
        String nombreCompleto,
        String email,
        String especialidadDestino,
        String patologiaSospecha,
        String prioridad,
        String estado,
        String fechaIngreso
) {}