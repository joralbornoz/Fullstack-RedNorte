package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.EventoCancelacionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EventoCancelacionAdapter implements EventoCancelacionPort {

    private final WebClient.Builder webClientBuilder;

    @Override
    public void publicarEvento(RegistroEspera registro) {
        webClientBuilder.build()
                .post()
                .uri("http://localhost:8083/api/v1/reasignar/ejecutar")
                .bodyValue(Map.of(
                        "idInterconsultaOriginal", registro.getId(),
                        "rutPaciente",             registro.getRutPaciente(),
                        "especialidad",            registro.getEspecialidadDestino(),
                        "motivo",                  registro.getMotivoCancelacion() != null
                                ? registro.getMotivoCancelacion() : ""
                ))
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe(
                        null,
                        error -> System.err.println("⚠️ [ms-lista-espera] Error notificando a ms-reasignacion: "
                                + error.getMessage())
                );
    }
}