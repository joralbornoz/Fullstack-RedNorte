package com.rednorte.ms_reasignacion.domain.repository;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import java.util.List;

public interface ReasignacionRepository {
    Reasignacion guardar(Reasignacion reasignacion);
    List<Reasignacion> obtenerTodas();
    void eliminar(Long id);
}