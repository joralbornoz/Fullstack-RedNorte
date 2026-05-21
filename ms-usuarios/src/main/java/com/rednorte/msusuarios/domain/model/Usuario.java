package com.rednorte.msusuarios.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    private String id;
    private String rut;
    private String email;
    private String contrasena;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String numeroTelefono;
    private Role rol;

}