package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RegistroPersistenceAdapter implements RegistroRepositoryPort {

    private final MySqlRegistroRepository repository;

    @Override
    public Optional<RegistroEspera> obtenerSiguiente(String especialidad) {
        return repository.buscarCandidatoTop(especialidad, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .map(this::mapToDomain);
    }

    @Override
    public RegistroEspera guardar(RegistroEspera dominio) {
        RegistroEntidad entidad = new RegistroEntidad();

        if (dominio.getId() != null) entidad.setId(dominio.getId());
        entidad.setRutPaciente(dominio.getRutPaciente());
        entidad.setEspecialidadDestino(dominio.getEspecialidadDestino());
        entidad.setPatologiaSospecha(dominio.getPatologiaSospecha());
        entidad.setPrioridad(dominio.getPrioridad());
        entidad.setEstado(dominio.getEstado());
        entidad.setFechaIngreso(dominio.getFechaIngreso());

        // 🔥 CORREGIDO: Mapeamos los campos de cancelación a la entidad MySQL
        entidad.setMotivoCancelacion(dominio.getMotivoCancelacion());
        entidad.setCanceladoPor(dominio.getCanceladoPor());

        RegistroEntidad guardado = repository.save(entidad);
        return mapToDomain(guardado);
    }

    @Override
    public List<RegistroEspera> buscarTodos() {
        return repository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<RegistroEspera> buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::mapToDomain);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<RegistroEspera> buscarPorRut(String rut) {
        return repository.findByRutPaciente(rut).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private RegistroEspera mapToDomain(RegistroEntidad entidad) {
        RegistroEspera d = new RegistroEspera();
        d.setId(entidad.getId());
        d.setRutPaciente(entidad.getRutPaciente());
        d.setEspecialidadDestino(entidad.getEspecialidadDestino());
        d.setPatologiaSospecha(entidad.getPatologiaSospecha());
        d.setPrioridad(entidad.getPrioridad());
        d.setEstado(entidad.getEstado());
        d.setFechaIngreso(entidad.getFechaIngreso());

        // 🔥 CORREGIDO: Recuperamos los campos de la BD al Dominio
        d.setMotivoCancelacion(entidad.getMotivoCancelacion());
        d.setCanceladoPor(entidad.getCanceladoPor());
        return d;
    }
}