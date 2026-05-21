package com.rednorte.msreasignacion.application.port.out;

import reactor.core.publisher.Mono;

public interface NotificacionPort {
    // Definimos el contrato para avisar al paciente o al sistema
    Mono<Void> enviarNotificacionReasignacion(String email, String detalle);
}