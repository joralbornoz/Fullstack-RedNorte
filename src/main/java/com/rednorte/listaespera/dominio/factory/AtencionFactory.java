package com.rednorte.listaespera.dominio.factory;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AtencionFactory {

    public static RegistroEspera crearAtencion(String rut, String especialidad, String patologia, String prioridadManual) {
        RegistroEspera registro = new RegistroEspera();

        
        registro.setRutPaciente(rut);
        registro.setEspecialidadDestino(especialidad);
        registro.setPatologiaSospecha(patologia);
        registro.setEstado("PENDIENTE"); 

        String esp = (especialidad != null) ? especialidad.toUpperCase() : "";
        String fechaActual = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        registro.setFechaIngreso(LocalDate.now());

        if (esp.equals("CARDIOLOGIA") || esp.equals("URGENCIA")) {
            registro.setPrioridad("3");
        } 
        else if (prioridadManual != null && !prioridadManual.isEmpty()) {
            registro.setPrioridad(prioridadManual.toUpperCase());
        }
        else if (esp.equals("TRAUMATOLOGIA") || esp.equals("PEDIATRIA")) {
            registro.setPrioridad("2");
        }
        else {
            registro.setPrioridad("1");
        }

        return registro;
    }
}