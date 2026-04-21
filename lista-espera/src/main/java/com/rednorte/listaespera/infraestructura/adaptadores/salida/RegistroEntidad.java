package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros_espera")
@Data
public class RegistroEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rutPaciente;
    private String nombrePaciente;
    private String tipoAtencion;
    private String prioridad;
    private String estado; // nombre del estado (ESPERA, CANCELADO Y LOS OTROS)
    private LocalDateTime fechaRegistro;
}