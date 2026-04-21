package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.EventoCancelacionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RabbitMQAdapter implements EventoCancelacionPort {

    private final RabbitTemplate rabbitTemplate;

    @Override
    public void publicarEvento(RegistroEspera registro) {
        String mensaje = "Cita cancelada para el paciente: " + registro.getRutPaciente();
        
        rabbitTemplate.convertAndSend("reasignacion_exchange", "cita.cancelada", mensaje);
        System.out.println("Evento publicado: " + mensaje);
    }
}