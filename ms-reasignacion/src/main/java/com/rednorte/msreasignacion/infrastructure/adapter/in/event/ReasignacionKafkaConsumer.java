package com.rednorte.msreasignacion.infrastructure.adapter.in.event;

import com.rednorte.msreasignacion.application.port.in.ReasignarPacienteUseCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReasignacionKafkaConsumer {

    private final ReasignarPacienteUseCase useCase;

    @KafkaListener(topics = "interconsulta-cancelada", groupId = "reasignacion-group")
    public void listenCancelacion(String mensajeKafka) {
        log.info(">>>> Evento recibido de Kafka: {}", mensajeKafka);
        try {
            String[] datos = mensajeKafka.split(";");
            String idInterconsulta = datos[0];
            String especialidad = datos.length > 1 ? datos[1] : "GENERAL";

            useCase.procesarCancelacionAutomatica(idInterconsulta, especialidad)
                    .doOnSuccess(v -> log.info(">>>> Reasignación concluida para ID: {}", idInterconsulta))
                    .doOnError(e -> log.error(">>>> Error en procesamiento Kafka: {}", e.getMessage()))
                    .subscribe();
        } catch (Exception e) {
            log.error("❌ Error al parsear mensaje de Kafka: {}", e.getMessage());
        }
    }
}