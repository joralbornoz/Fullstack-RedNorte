package com.rednorte.listaespera.aplicacion.servicios;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import com.rednorte.listaespera.dominio.factory.AtencionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List; 
import java.util.Optional; 

@Service
@RequiredArgsConstructor
public class GestionListaEsperaService {

    private final RegistroRepositoryPort repositoryPort;

    public RegistroEspera registrarNuevoPaciente(String rut, String especialidad, String patologia) {
        RegistroEspera nuevo = AtencionFactory.crearAtencion(rut, especialidad, patologia);
        return repositoryPort.guardar(nuevo);
    }

    public List<RegistroEspera> obtenerTodos() {
        return repositoryPort.buscarTodos();
    }

    
    public Optional<RegistroEspera> obtenerPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }
    

    public RegistroEspera actualizarEstado(Long id, String nuevoEstado) {
        return repositoryPort.buscarPorId(id).map(registro -> {
            registro.setEstado(nuevoEstado);
            return repositoryPort.guardar(registro);
        }).orElseThrow(() -> new RuntimeException("No encontrado"));
    }

    public void eliminarRegistro(Long id) {
        repositoryPort.eliminar(id);
    }
    
    public void cancelarCita(Long id) {
        
    }
}