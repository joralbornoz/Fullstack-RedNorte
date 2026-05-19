package com.rednorte.ms_reasignacion.application.ports.in;

import com.rednorte.ms_reasignacion.domain.model.Reasignacion;

public interface ProcesarCitaCanceladaUseCase {
    Reasignacion procesarCancelacion(
            String idCitaOriginal,
            String rutPaciente,
            String especialidad,
            String motivoCancelacion,
            String medicoOriginal,
            String prioridadReasignacion,
            Boolean requiereExamenesPrevios,
            String preferenciaHorario
    );
}
