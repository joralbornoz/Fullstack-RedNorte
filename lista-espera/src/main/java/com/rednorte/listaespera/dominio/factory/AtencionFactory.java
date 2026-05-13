package com.rednorte.listaespera.dominio.factory;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;

public class AtencionFactory {

    public static RegistroEspera crearAtencion(String rut, String especialidad, String patologia, String prioridadManual) {
    RegistroEspera registro = new RegistroEspera();

    String esp = (especialidad != null) ? especialidad.toUpperCase() : "";

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