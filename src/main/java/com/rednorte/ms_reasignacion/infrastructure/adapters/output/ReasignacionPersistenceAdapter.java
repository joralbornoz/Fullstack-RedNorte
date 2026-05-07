package com.rednorte.ms_reasignacion.infrastructure.adapters.output;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReasignacionPersistenceAdapter implements ReasignacionRepository {

    private final JpaReasignacionRepository jpaRepository;

    @Override
    public Reasignacion guardar(Reasignacion reasignacion) {
        ReasignacionEntity entity = new ReasignacionEntity();
        entity.setIdCitaOriginal(reasignacion.getIdCitaOriginal());
        entity.setRutPaciente(reasignacion.getRutPaciente());
        entity.setEspecialidad(reasignacion.getEspecialidad());
        entity.setFechaRegistro(reasignacion.getFechaRegistro());

        ReasignacionEntity saved = jpaRepository.save(entity);
        reasignacion.setId(saved.getId());
        return reasignacion;
    }

    @Override
    public List<Reasignacion> obtenerTodas() {
        return jpaRepository.findAll().stream().map(entity -> {
            Reasignacion domain = new Reasignacion(
                    entity.getIdCitaOriginal(),
                    entity.getRutPaciente(),
                    entity.getEspecialidad()
            );
            domain.setId(entity.getId());
            domain.setFechaRegistro(entity.getFechaRegistro());
            return domain;
        }).collect(Collectors.toList());
    }

    @Override
    public void eliminar(Long id) {
        jpaRepository.deleteById(id);
    }
}