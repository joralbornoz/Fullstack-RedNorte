package com.rednorte.ms_reasignacion.infrastructure.adapters.output;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasignaciones")
@Getter
@Setter
public class ReasignacionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String idCitaOriginal;
    private String rutPaciente;
    private String especialidad;
    private LocalDateTime fechaRegistro;
}