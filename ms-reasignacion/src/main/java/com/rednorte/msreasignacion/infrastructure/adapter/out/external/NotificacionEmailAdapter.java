package com.rednorte.msreasignacion.infrastructure.adapter.out.external;

import com.rednorte.msreasignacion.application.port.out.NotificacionPort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class NotificacionEmailAdapter implements NotificacionPort {

    @Override
    public Mono<Void> enviarNotificacionReasignacion(String email, String detalle) {
        // Aquí iría la lógica real de envío de correos
        return Mono.fromRunnable(() -> {
            log.info("Enviando Email a {}: {}", email, detalle);
        }).then();
    }
}