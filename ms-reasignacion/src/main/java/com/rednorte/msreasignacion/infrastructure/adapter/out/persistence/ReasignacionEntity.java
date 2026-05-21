package com.rednorte.msreasignacion.infrastructure.adapter.out.persistence;

import com.rednorte.msreasignacion.domain.model.EstadoReasignacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasignaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReasignacionEntity {

    @Id
    private String id;

    @Column(name = "id_interconsulta_original", nullable = false)
    private String idInterconsultaOriginal;

    @Column(name = "id_interconsulta_nueva")
    private String idInterconsultaNueva;

    @Column(name = "rut_paciente_reasignado")
    private String rutPacienteReasignado;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "fecha_procesamiento")
    private LocalDateTime fechaProcesamiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_proceso", nullable = false)
    private EstadoReasignacion estadoProceso;
}