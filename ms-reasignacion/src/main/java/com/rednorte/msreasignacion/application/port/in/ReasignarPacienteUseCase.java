package com.rednorte.msreasignacion.application.port.in;

import reactor.core.publisher.Mono;

public interface ReasignarPacienteUseCase {
    Mono<Void> reasignarCupo(String idInterconsultaOriginal, String especialidad, String motivo);
    Mono<Void> procesarCancelacionAutomatica(String idInterconsultaOriginal, String especialidad);
}