package com.rednorte.listaespera.aplicacion.servicios;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import com.rednorte.listaespera.dominio.puertos.out.EventoCancelacionPort;
import com.rednorte.listaespera.dominio.factory.AtencionFactory;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;

@Service
@RequiredArgsConstructor


public class GestionListaEsperaService {

    private final RegistroRepositoryPort repositoryPort;
    private final EventoCancelacionPort eventoPort;

   
    public RegistroEspera registrarNuevoPaciente(String tipo, String nombre, String rut) {
        RegistroEspera nuevoRegistro = AtencionFactory.crearAtencion(tipo, nombre, rut);
        return repositoryPort.guardar(nuevoRegistro);
    }

    
    public void cancelarCita(Long id) {
        
        RegistroEspera registro = new RegistroEspera(); 
        
        
        eventoPort.publicarEvento(registro);
        
        System.out.println("Cita cancelada y evento enviado al Broker.");
    }
}