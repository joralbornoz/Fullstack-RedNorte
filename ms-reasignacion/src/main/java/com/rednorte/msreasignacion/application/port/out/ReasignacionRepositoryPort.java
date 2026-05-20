package com.rednorte.msreasignacion.application.port.out;

import com.rednorte.msreasignacion.domain.model.Reasignacion;
import reactor.core.publisher.Mono;

public interface ReasignacionRepositoryPort {
    Mono<Reasignacion> guardar(Reasignacion reasignacion);
}