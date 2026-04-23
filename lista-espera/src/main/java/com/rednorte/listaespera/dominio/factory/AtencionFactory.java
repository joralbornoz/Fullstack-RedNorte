package com.rednorte.listaespera.dominio.factory;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import java.time.LocalDate;

public class AtencionFactory {

    public static RegistroEspera crearAtencion(String rut, String especialidad, String patologia) {
        RegistroEspera registro = new RegistroEspera();
        
        registro.setRutPaciente(rut);
        registro.setEspecialidadDestino(especialidad); 
        registro.setPatologiaSospecha(patologia);      
        registro.setFechaIngreso(LocalDate.now());
      
        if (especialidad.equalsIgnoreCase("CARDIOLOGIA") || especialidad.equalsIgnoreCase("URGENCIA")) {
            registro.setPrioridad("ALTA");
        } else {
            registro.setPrioridad("MEDIA");
        }
        
        registro.setEstado("PENDIENTE");

        return registro;
    }
}