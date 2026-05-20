package com.rednorte.msbff.dto; // 🚨 Ajusta el package según tu proyecto

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // 🔥 Genera automáticamente Getters, Setters, toString, equals y hashCode
@NoArgsConstructor // 🔥 Genera el constructor vacío obligatorio para Jackson
@AllArgsConstructor // 🔥 Genera el constructor con todos los campos
public class CancelacionDTO {

    private Long id;
    private String rutPaciente;
    private String especialidadDestino; // 🚀 Corregido para que calce perfecto con el JSON de tu React
    private String motivo;
    private String canceladoPor;

}