package com.rednorte.msusuarios.infrastructure.adapter.in.web.dto;

public record LoginResponse(
        String rut,
        String rol // 👈 Eliminamos el token de aquí
) {}