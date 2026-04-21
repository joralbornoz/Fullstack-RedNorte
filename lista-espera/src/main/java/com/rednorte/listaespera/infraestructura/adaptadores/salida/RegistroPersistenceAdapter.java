package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RegistroPersistenceAdapter implements RegistroRepositoryPort {

    private final PostgresRegistroRepository repository;

    @Override
    public RegistroEspera guardar(RegistroEspera dominio) {
        RegistroEntidad entidad = new RegistroEntidad();
        entidad.setRutPaciente(dominio.getRutPaciente());
        entidad.setNombrePaciente(dominio.getNombrePaciente());
        entidad.setTipoAtencion(dominio.getTipoAtencion());
        entidad.setPrioridad(dominio.getPrioridad());
        entidad.setEstado(dominio.getEstado().getNombreEstado());
        entidad.setFechaRegistro(dominio.getFechaRegistro());

        RegistroEntidad guardado = repository.save(entidad);
        dominio.setId(guardado.getId());
        return dominio;
    }

    @Override
    public List<RegistroEspera> buscarTodos() {
        return repository.findAll().stream()
                .map(entidad -> {
                    RegistroEspera d = new RegistroEspera();
                    d.setId(entidad.getId());
                    d.setRutPaciente(entidad.getRutPaciente());
                    d.setNombrePaciente(entidad.getNombrePaciente());
                    d.setTipoAtencion(entidad.getTipoAtencion());
                    d.setPrioridad(entidad.getPrioridad());
                    d.setFechaRegistro(entidad.getFechaRegistro());
                    return d;
                })
                .collect(Collectors.toList());
    }
}