package com.rednorte.listaespera.dominio.modelo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroEspera {
    private Long id;
    private String rutPaciente;
    private String especialidadDestino;
    private String patologiaSospecha;
    private LocalDate fechaIngreso;
    private String prioridad;
    private String estado;

    // 🔥 CAMPOS NUEVOS DE CANCELACIÓN INCLUIDOS EN EL DOMINIO
    private String motivoCancelacion;
    private String canceladoPor;

    // 🔥 GETTERS Y SETTERS MANUALES
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