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
        if (reasignacion.getId() != null) {
            entity.setId(reasignacion.getId());
        }
        entity.setIdCitaOriginal(reasignacion.getIdCitaOriginal());
        entity.setRutPaciente(reasignacion.getRutPaciente());
        entity.setEspecialidad(reasignacion.getEspecialidad());
        entity.setFechaRegistro(reasignacion.getFechaRegistro());

        entity.setMotivoCancelacion(reasignacion.getMotivoCancelacion());
        entity.setMedicoOriginal(reasignacion.getMedicoOriginal());
        entity.setPrioridadReasignacion(reasignacion.getPrioridadReasignacion());
        entity.setRequiereExamenesPrevios(reasignacion.getRequiereExamenesPrevios());
        entity.setPreferenciaHorario(reasignacion.getPreferenciaHorario());
        entity.setEstado(reasignacion.getEstado());

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

            domain.setMotivoCancelacion(entity.getMotivoCancelacion());
            domain.setMedicoOriginal(entity.getMedicoOriginal());
            domain.setPrioridadReasignacion(entity.getPrioridadReasignacion());
            domain.setRequiereExamenesPrevios(entity.getRequiereExamenesPrevios());
            domain.setPreferenciaHorario(entity.getPreferenciaHorario());
            domain.setEstado(entity.getEstado());

            return domain;
        }).collect(Collectors.toList());
    }

    @Override
    public void eliminar(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public java.util.Optional<Reasignacion> obtenerPorId(Long id) {
        return jpaRepository.findById(id).map(entity -> {
            Reasignacion domain = new Reasignacion(
                    entity.getIdCitaOriginal(),
                    entity.getRutPaciente(),
                    entity.getEspecialidad()
            );
            domain.setId(entity.getId());
            domain.setFechaRegistro(entity.getFechaRegistro());
            domain.setMotivoCancelacion(entity.getMotivoCancelacion());
            domain.setMedicoOriginal(entity.getMedicoOriginal());
            domain.setPrioridadReasignacion(entity.getPrioridadReasignacion());
            domain.setRequiereExamenesPrevios(entity.getRequiereExamenesPrevios());
            domain.setPreferenciaHorario(entity.getPreferenciaHorario());
            domain.setEstado(entity.getEstado());
            return domain;
        });
    }
}