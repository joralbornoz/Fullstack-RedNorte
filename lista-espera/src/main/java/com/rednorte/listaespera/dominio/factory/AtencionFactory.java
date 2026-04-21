package com.rednorte.listaespera.dominio.factory;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.modelo.EstadoEspera;

public class AtencionFactory {
    public static RegistroEspera crearAtencion(String tipo, String nombre, String rut) {
        RegistroEspera registro = new RegistroEspera();
        registro.setNombrePaciente(nombre);
        registro.setRutPaciente(rut);
        registro.setTipoAtencion(tipo);
        
        
        if (tipo.equalsIgnoreCase("URGENCIA")) {
            registro.setPrioridad("ALTA");
        } else {
            registro.setPrioridad("MEDIA");
        }
        
        registro.setEstado(new EstadoEspera() {
            @Override
            public void cancelar(RegistroEspera registro) {
                
            }

            @Override
            public void asignar(RegistroEspera registro) {
              
            }

            @Override
            public String getNombreEstado() {
                return "PENDIENTE";
            }
        });
        return registro;
    }
}