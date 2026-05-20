package com.rednorte.listaespera.aplicacion.servicios;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroDTO;
import com.rednorte.listaespera.dominio.factory.AtencionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List; 
import java.util.Optional;
import java.util.stream.Collectors; 

@Service
@RequiredArgsConstructor
public class GestionListaEsperaService {

    private final RegistroRepositoryPort repositoryPort;

    public RegistroDTO registrarNuevo(String rut, String esp, String pato, String prioridad) {
        RegistroEspera nuevo = AtencionFactory.crearAtencion(rut, esp, pato, prioridad);
        RegistroEspera guardado = repositoryPort.guardar(nuevo);
        
        return new RegistroDTO(
            guardado.getId(),
            guardado.getRutPaciente(),
            guardado.getEspecialidadDestino(),
            guardado.getPatologiaSospecha(), 
            guardado.getPrioridad(),
            guardado.getEstado()
        );
    }

    public List<RegistroDTO> obtenerTodos() {
        return repositoryPort.buscarTodos().stream()
            .map(registro -> new RegistroDTO(
                registro.getId(),
                registro.getRutPaciente(),
                registro.getEspecialidadDestino(),
                registro.getPatologiaSospecha(), 
                registro.getPrioridad(),
                registro.getEstado()
            ))
            .collect(Collectors.toList());
    }

    public Optional<RegistroEspera> obtenerPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    public RegistroEspera actualizarEstado(Long id, String nuevoEstado) {
        return repositoryPort.buscarPorId(id).map(registro -> {
            registro.setEstado(nuevoEstado);
            return repositoryPort.guardar(registro);
        }).orElseThrow(() -> new RuntimeException("No se encontró el registro con ID: " + id));
    }

    public void eliminarRegistro(Long id) {
        repositoryPort.eliminar(id);
    }
}