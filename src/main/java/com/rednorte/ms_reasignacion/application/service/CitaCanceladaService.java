package com.rednorte.ms_reasignacion.application.service;

import com.rednorte.ms_reasignacion.application.ports.in.ProcesarCitaCanceladaUseCase;
import com.rednorte.ms_reasignacion.application.ports.out.CitaCanceladaEventPort;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.domain.repository.ReasignacionRepository;

public class CitaCanceladaService implements ProcesarCitaCanceladaUseCase {

    private final ReasignacionRepository reasignacionRepository;
    private final CitaCanceladaEventPort eventPort;

    public CitaCanceladaService(ReasignacionRepository reasignacionRepository, CitaCanceladaEventPort eventPort) {
        this.reasignacionRepository = reasignacionRepository;
        this.eventPort = eventPort;
    }

    @Override
    public Reasignacion procesarCancelacion(
            String idCitaOriginal,
            String rutPaciente,
            String especialidad,
            String motivoCancelacion,
            String medicoOriginal,
            String prioridadReasignacion,
            Boolean requiereExamenesPrevios,
            String preferenciaHorario) {

        if (rutPaciente == null || !rutPaciente.contains("-")) {
            throw new IllegalArgumentException("El RUT debe tener guion (xxxxxxxx-x)");
        }

        Reasignacion nueva = new Reasignacion(idCitaOriginal, rutPaciente, especialidad);
        nueva.setMotivoCancelacion(motivoCancelacion);
        nueva.setMedicoOriginal(medicoOriginal);
        nueva.setPrioridadReasignacion(prioridadReasignacion);
        nueva.setRequiereExamenesPrevios(requiereExamenesPrevios);
        nueva.setPreferenciaHorario(preferenciaHorario);

        Reasignacion guardada = reasignacionRepository.guardar(nueva);

        eventPort.publicarCancelacionA5Microservicios(guardada);

        return guardada;
    }
}
