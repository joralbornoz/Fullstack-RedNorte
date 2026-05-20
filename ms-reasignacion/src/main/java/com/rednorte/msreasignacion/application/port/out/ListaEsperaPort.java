package com.rednorte.msreasignacion.application.port.out;

import com.rednorte.msreasignacion.domain.model.PacienteCandidato;
import reactor.core.publisher.Mono;

public interface ListaEsperaPort {
    Mono<PacienteCandidato> obtenerSiguienteEnLista(String especialidad);
    Mono<Void> actualizarEstado(String idInterconsulta, String nuevoEstado);
}