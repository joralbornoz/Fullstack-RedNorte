package com.rednorte.msbff.dto;

public record DashboardSummaryDTO(
        long totalPacientes,
        long enEspera,
        long atencionesHoy,
        String tiempoPromedio
) {}