package com.rednorte.ms_reasignacion.infrastructure.adapters.output;

import com.rednorte.ms_reasignacion.application.ports.out.CitaCanceladaEventPort;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import java.util.concurrent.CompletableFuture;

@Component
public class MicroserviciosExternosAdapter implements CitaCanceladaEventPort {

    @Override
    public void publicarCancelacionA5Microservicios(Reasignacion reasignacion) {
        System.out.println("Iniciando envío a ciegas (Fire-and-Forget) para cita: " + reasignacion.getIdCitaOriginal());

        notificarNotificaciones(reasignacion);
        notificarAgendaMedica(reasignacion);
        notificarHistorialClinico(reasignacion);
        notificarFacturacion(reasignacion);
        notificarAnalitica(reasignacion);
    }

    @Async
    protected CompletableFuture<Void> notificarNotificaciones(Reasignacion r) {
        System.out.println("[MS-Notificaciones] Enviando SMS/Email al paciente " + r.getRutPaciente() + " indicando cancelación y búsqueda de reasignación.");
        return CompletableFuture.completedFuture(null);
    }

    @Async
    protected CompletableFuture<Void> notificarAgendaMedica(Reasignacion r) {
        System.out.println("[MS-AgendaMedica] Liberando el bloque de tiempo de la cita original " + r.getIdCitaOriginal() + " del médico " + r.getMedicoOriginal() + ".");
        return CompletableFuture.completedFuture(null);
    }

    @Async
    protected CompletableFuture<Void> notificarHistorialClinico(Reasignacion r) {
        System.out.println("[MS-HistorialClinico] Registrando cancelación por motivo: '" + r.getMotivoCancelacion() + "' para el paciente " + r.getRutPaciente() + ".");
        return CompletableFuture.completedFuture(null);
    }

    @Async
    protected CompletableFuture<Void> notificarFacturacion(Reasignacion r) {
        System.out.println("[MS-Facturacion] Pausando proceso de cobro/Iniciando reembolso para la cita " + r.getIdCitaOriginal() + ".");
        return CompletableFuture.completedFuture(null);
    }

    @Async
    protected CompletableFuture<Void> notificarAnalitica(Reasignacion r) {
        System.out.println("[MS-Analitica] Registrando métrica de cancelación. Especialidad: " + r.getEspecialidad() + ", Prioridad Reasignación: " + r.getPrioridadReasignacion() + ".");
        return CompletableFuture.completedFuture(null);
    }
}
