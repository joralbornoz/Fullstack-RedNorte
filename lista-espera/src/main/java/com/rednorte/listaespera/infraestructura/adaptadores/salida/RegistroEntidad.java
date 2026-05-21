package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "registros_espera")
@Data
public class RegistroEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private String prioridad;
    private String estado;
    private LocalDate fechaIngreso;

    // 🔥 CAMPOS NUEVOS DE CANCELACIÓN
    private String motivoCancelacion;
    private String canceladoPor;

    // 🔥 GETTERS Y SETTERS MANUALES PARA EVITAR FALLAS DE LOMBOK
    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }

    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }

    public String getCanceladoPor() {
        return canceladoPor;
    }

    public void setCanceladoPor(String canceladoPor) {
        this.canceladoPor = canceladoPor;
    }
}