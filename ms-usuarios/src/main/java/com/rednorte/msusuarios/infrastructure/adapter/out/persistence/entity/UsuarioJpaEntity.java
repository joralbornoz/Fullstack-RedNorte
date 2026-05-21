package com.rednorte.msusuarios.infrastructure.adapter.out.persistence.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rednorte.msusuarios.domain.model.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- Cambiado de UUID a IDENTITY
    private Long id;

    @Column(unique = true, nullable = false, length = 12)
    private String rut;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "nombre_completo", nullable = false, length = 200)
    private String nombreCompleto;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "numero_telefono", length = 15)
    private String numeroTelefono; // Ej: "+56912345678"

    @Enumerated(EnumType.STRING) // <-- ESTO ES VITAL
    @Column(name = "rol", nullable = false)
    private Role rol;
}