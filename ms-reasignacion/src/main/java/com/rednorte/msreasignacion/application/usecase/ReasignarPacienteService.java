package com.rednorte.msreasignacion.application.usecase;

import com.rednorte.msreasignacion.application.port.in.ReasignarPacienteUseCase;
import com.rednorte.msreasignacion.application.port.out.ListaEsperaPort;
import com.rednorte.msreasignacion.application.port.out.ReasignacionRepositoryPort;
import com.rednorte.msreasignacion.domain.model.EstadoReasignacion;
import com.rednorte.msreasignacion.domain.model.Reasignacion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReasignarPacienteService implements ReasignarPacienteUseCase {

    private final ListaEsperaPort listaEsperaPort;
    private final ReasignacionRepositoryPort reasignacionRepositoryPort;

    @Override
    public Mono<Void> procesarCancelacionAutomatica(String idInterconsultaOriginal, String especialidad) {
        return ejecutarFlujoCore(idInterconsultaOriginal, mapearEspecialidad(especialidad));
    }

    @Override
    public Mono<Void> reasignarCupo(String idInterconsultaOriginal, String especialidad, String motivo) {
        // 🔥 CORRECCIÓN: Aplicar mapeo también aquí para que sea consistente
        return ejecutarFlujoCore(idInterconsultaOriginal, mapearEspecialidad(especialidad));
    }

    private Mono<Void> ejecutarFlujoCore(String idInterconsultaOriginal, String especialidad) {
        log.info("Iniciando flujo para interconsulta: {} y especialidad: {}", idInterconsultaOriginal, especialidad);

        // ¡Aquí estaba la pieza que faltaba!
        Reasignacion procesoInicial = Reasignacion.builder()
                .id(UUID.randomUUID().toString())
                .idInterconsultaOriginal(idInterconsultaOriginal)
                .especialidad(especialidad)
                .estadoProceso(EstadoReasignacion.EN_PROCESO)
                .fechaProcesamiento(LocalDateTime.now())
                .build();

        return listaEsperaPort.obtenerSiguienteEnLista(especialidad)
                .flatMap(candidato -> {
                    log.info("Candidato encontrado: {}", candidato.getRut());

                    Reasignacion completada = procesoInicial.marcarComoCompletada(
                            candidato.getIdInterconsulta(),
                            candidato.getRut()
                    );

                    return listaEsperaPort.actualizarEstado(candidato.getIdInterconsulta(), "CONFIRMADO")
                            .then(reasignacionRepositoryPort.guardar(completada))
                            .log("DEBUG-REASIGNACION: Candidato asignado y guardado");
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("No hay candidatos para: {}", especialidad);
                    Reasignacion fallida = procesoInicial.marcarComoFallida();
                    return reasignacionRepositoryPort.guardar(fallida);
                }))
                .then();
    }

    private String mapearEspecialidad(String esp) {
        log.info("DEBUG-MAPEADOR: Recibiendo especialidad: '{}'", esp); // <--- AGREGA ESTO

        if (esp == null) return "General";
        String lower = esp.toLowerCase();

        // Si esto falla, logueamos el resultado
        if (lower.contains("cardio")) return "Cardiología";
        if (lower.contains("trauma")) return "Traumatología";
        if (lower.contains("neuro"))  return "Neurología";
        if (lower.contains("gastro")) return "Gastroenterología";

        log.warn("DEBUG-MAPEADOR: No hubo coincidencia, usando default para: '{}'", esp);
        return esp.substring(0, 1).toUpperCase() + esp.substring(1).toLowerCase();
    }
}