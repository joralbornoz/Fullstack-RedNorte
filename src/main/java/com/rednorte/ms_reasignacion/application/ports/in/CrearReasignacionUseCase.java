package com.rednorte.ms_reasignacion.application.ports.in;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import java.util.List;

public interface CrearReasignacionUseCase {
    Reasignacion ejecutar(String idCita, String rut, String especialidad);
    List<Reasignacion> listarTodas();
    void borrar(Long id);
    Reasignacion obtenerPorId(Long id);
    Reasignacion actualizarEstado(Long id, String nuevoEstado);
}