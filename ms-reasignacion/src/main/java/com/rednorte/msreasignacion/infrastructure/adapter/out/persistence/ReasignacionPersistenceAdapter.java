package com.rednorte.msreasignacion.infrastructure.adapter.out.persistence;

import com.rednorte.msreasignacion.application.port.out.ReasignacionRepositoryPort;
import com.rednorte.msreasignacion.domain.model.Reasignacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers; // ✅ Solo necesitamos este import

@Component
@RequiredArgsConstructor
public class ReasignacionPersistenceAdapter implements ReasignacionRepositoryPort {

    private final SpringDataReasignacionRepository repository;

    @Override
    public Mono<Reasignacion> guardar(Reasignacion reasignacion) {
        // ❌ ELIMINADO: Schedulers Schedulers; (Esto causaba el conflicto)

        return Mono.fromCallable(() -> {

            ReasignacionEntity entity = ReasignacionEntity.builder()
                    .id(reasignacion.getId())
                    .idInterconsultaOriginal(reasignacion.getIdInterconsultaOriginal())
                    .idInterconsultaNueva(reasignacion.getIdInterconsultaNueva())
                    .rutPacienteReasignado(reasignacion.getRutPacienteReasignado())
                    .especialidad(reasignacion.getEspecialidad())
                    .fechaProcesamiento(reasignacion.getFechaProcesamiento())
                    .estadoProceso(reasignacion.getEstadoProceso())
                    .build();

            ReasignacionEntity guardada = repository.save(entity);

            return reasignacion.toBuilder()
                    .id(guardada.getId())
                    .idInterconsultaNueva(guardada.getIdInterconsultaNueva())
                    .rutPacienteReasignado(guardada.getRutPacienteReasignado())
                    .estadoProceso(guardada.getEstadoProceso())
                    .fechaProcesamiento(guardada.getFechaProcesamiento())
                    .build();
        }).subscribeOn(Schedulers.boundedElastic()); // ✅ Ahora funciona porque Schedulers es la clase
    }
}