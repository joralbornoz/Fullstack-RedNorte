package com.rednorte.ms_reasignacion.application.service;

import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;
import java.util.List;

public class ReasignacionService implements CrearReasignacionUseCase {

    private final ReasignacionRepository reasignacionRepository;

    public ReasignacionService(ReasignacionRepository reasignacionRepository) {
        this.reasignacionRepository = reasignacionRepository;
    }

    @Override
    public Reasignacion ejecutar(String idCita, String rut, String especialidad) {
        if (rut == null || !rut.contains("-")) {
            throw new IllegalArgumentException("El RUT debe tener guion (xxxxxxxx-x)");
        }
        Reasignacion nueva = new Reasignacion(idCita, rut, especialidad);
        return reasignacionRepository.guardar(nueva);
    }

    @Override
    public List<Reasignacion> listarTodas() {
        return reasignacionRepository.obtenerTodas();
    }

    @Override
    public void borrar(Long id) {
        reasignacionRepository.eliminar(id);
    }
}