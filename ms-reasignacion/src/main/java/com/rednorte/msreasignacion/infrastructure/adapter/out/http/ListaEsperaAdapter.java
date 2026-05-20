package com.rednorte.msreasignacion.infrastructure.adapter.out.http;

import com.rednorte.msreasignacion.application.port.out.ListaEsperaPort;
import com.rednorte.msreasignacion.domain.model.PacienteCandidato;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@Component
public class ListaEsperaAdapter implements ListaEsperaPort {

    private final WebClient webClient;

    public ListaEsperaAdapter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8082/api/v1").build();
    }

    @Override
    public Mono<PacienteCandidato> obtenerSiguienteEnLista(String especialidad) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String token = (auth != null && auth.getCredentials() != null) ? auth.getCredentials().toString() : "";

        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/lista-espera/siguiente")
                        .queryParam("especialidad", especialidad)
                        .build())
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(PacienteCandidato.class) // 🔥 WebClient mapea automáticamente si la clase está bien
                .doOnNext(p -> log.info("Candidato mapeado correctamente: {}", p.getRut()))
                .doOnError(e -> log.error("Error al obtener siguiente candidato", e));
    }

    @Override
    public Mono<Void> actualizarEstado(String idInterconsulta, String nuevoEstado) {
        // 🔥 VALIDACIÓN CRÍTICA: No llamar si el ID es nulo
        if (idInterconsulta == null) {
            return Mono.error(new RuntimeException("ID de interconsulta nulo, no se puede actualizar estado"));
        }

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String token = (auth != null && auth.getCredentials() != null) ? auth.getCredentials().toString() : "";

        return this.webClient.put()
                // 🔥 URL CORREGIDA: Debe coincidir exactamente con el controlador
                .uri("/lista-espera/actualizar/" + idInterconsulta)
                .header("Authorization", "Bearer " + token)
                .bodyValue(Map.of("estado", nuevoEstado))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("ERROR AL ACTUALIZAR: Código {} para ID {}", response.statusCode(), idInterconsulta);
                    return Mono.error(new RuntimeException("Error al actualizar estado en ms-lista-espera"));
                })
                .bodyToMono(Void.class)
                .doOnSuccess(v -> log.info("ÉXITO: Estado actualizado a {} para ID {}", nuevoEstado, idInterconsulta))
                .doOnError(e -> log.error("FALLO CRÍTICO en la llamada PUT", e));
    }
}