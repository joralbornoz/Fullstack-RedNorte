package com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto;

import java.time.LocalDate;

public record RegistroCompletoDTO(
        Long id,
        String rutPaciente,
        String especialidadDestino,
        String patologiaSospecha,
        String prioridad,
        String estado,
        LocalDate fechaIngreso // ✅ Aquí viaja la fecha real desde la base de datos
) {}