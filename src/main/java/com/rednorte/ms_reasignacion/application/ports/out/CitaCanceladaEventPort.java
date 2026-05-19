package com.rednorte.ms_reasignacion.application.ports.out;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;

public interface CitaCanceladaEventPort {
    void publicarCancelacionA5Microservicios(Reasignacion reasignacion);
}
