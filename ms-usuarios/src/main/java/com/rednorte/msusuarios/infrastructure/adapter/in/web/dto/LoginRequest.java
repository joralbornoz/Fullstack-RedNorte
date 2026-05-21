package com.rednorte.msusuarios.infrastructure.adapter.in.web.dto;

public record LoginRequest(
        String rut,
        String contrasena
) {}