package com.rednorte.msbff.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder // <--- Crucial para que el Service pueda construirlo
public class UsuarioDTO {

    private String rut;
    private String nombreCompleto;
    private String numeroTelefono;
    private String email;

    // Si tu ms-usuarios devuelve otros campos como 'rol' o 'direccion',
    // puedes agregarlos aquí si el BFF los necesita.
}