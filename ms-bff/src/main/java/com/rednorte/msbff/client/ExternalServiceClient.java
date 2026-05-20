package com.rednorte.msbff.client;

import com.rednorte.msbff.dto.CancelacionDTO;
import com.rednorte.msbff.dto.PacienteDetalleDTO;
import io.netty.channel.ChannelOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class ExternalServiceClient {

    private final WebClient webClient;

    @Value("${services.usuarios.url}")
    private String URL_USUARIOS;

    @Value("${services.lista-espera.url}")
    private String URL_LISTA_ESPERA;

    @Value("${services.reasignacion.url}")
    private String URL_REASIGNACION;

    public ExternalServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create()
                                .responseTimeout(Duration.ofSeconds(5))
                                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 3000)
                ))
                .build();
    }

    public Mono<ResponseEntity<Object>> obtenerListaEsperaTodos(String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/todos")
                .header("Authorization", token != null ? token : "")
                .exchangeToMono(response -> response.toEntity(Object.class))
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] ms-lista-espera no disponible: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(503)
                            .body((Object) Map.of("error", "Servicio no disponible", "datos", List.of())));
                });
    }

    public Flux<Map> obtenerListaEsperaParaDashboard(String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/todos")
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .bodyToFlux(Map.class)
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] ms-lista-espera no disponible para dashboard: " + e.getMessage());
                    return Flux.empty();
                });
    }

    public Mono<ResponseEntity<Object>> registrarConsulta(Object datos, String token) {
        return webClient.post()
                .uri(URL_LISTA_ESPERA + "/lista-espera/registrar")
                .header("Authorization", token != null ? token : "")
                .bodyValue(datos)
                .exchangeToMono(response -> response.toEntity(Object.class))
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] Error al registrar consulta: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(503)
                            .body((Object) Map.of("error", "No se pudo registrar la consulta")));
                });
    }

    public Mono<ResponseEntity<Object>> registrarUsuario(Object usuarioData, String token) {
        return webClient.post()
                .uri(URL_USUARIOS + "/usuarios")
                .header("Authorization", token != null ? token : "")
                .bodyValue(usuarioData)
                .exchangeToMono(response -> response.toEntity(Object.class))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(503)
                        .body((Object) Map.of("error", "No se pudo registrar el usuario"))));
    }

    public Mono<ResponseEntity<Object>> listarUsuarios(String token) {
        return webClient.get()
                .uri(URL_USUARIOS + "/usuarios")
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(503)
                        .body((Object) Map.of("error", "Servicio de usuarios no disponible"))));
    }

    public Mono<ResponseEntity<Object>> consultasPaciente(String rut, String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/paciente/" + rut)
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class)
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] ms-lista-espera no disponible: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(503)
                            .body((Object) Map.of("error", "Servicio no disponible", "consultas", List.of())));
                });
    }

    public Mono<PacienteDetalleDTO> obtenerDetallePaciente(Long id) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/" + id)
                .retrieve()
                .bodyToMono(PacienteDetalleDTO.class)
                .onErrorResume(e -> Mono.empty());
    }

    public Mono<ResponseEntity<Object>> obtenerUsuarioPorRut(String rut, String token) {
        return webClient.get()
                .uri(URL_USUARIOS + "/usuarios/" + rut)
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(503)
                        .body((Object) Map.of("error", "Servicio de usuarios no disponible"))));
    }

    public Mono<Map> obtenerUsuarioPorRutComoMap(String rut, String token) {
        return webClient.get()
                .uri(URL_USUARIOS + "/usuarios/" + rut)
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorReturn(Map.of("nombreCompleto", "Usuario no encontrado", "email", "N/A"));
    }

    public Mono<Void> cambiarEstadoListaEspera(Long id, String estado, String token) {
        return this.webClient.put()
                .uri(URL_LISTA_ESPERA + "/lista-espera/actualizar/" + id)
                .header("Authorization", token != null ? token : "")
                .bodyValue(Map.of("estado", estado))
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> Mono.empty());
    }

    public Mono<Void> dispararReasignacion(Map<String, Object> payload, String token) {
        return this.webClient.post()
                .uri(URL_REASIGNACION + "/reasignar/ejecutar")
                .header("Authorization", token != null ? token : "")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] ms-reasignacion no disponible: " + e.getMessage());
                    return Mono.empty();
                });
    }
    public Mono<Void> cancelarListaEspera(CancelacionDTO dto) {
        return webClient.post()
                .uri(URL_LISTA_ESPERA + "/lista-espera/cancelar")
                .bodyValue(Map.of(
                        "idInterconsulta", dto.getId(),
                        "motivo",          dto.getMotivo() != null ? dto.getMotivo() : "",
                        "canceladoPor",    dto.getCanceladoPor() != null ? dto.getCanceladoPor() : "MEDICO"
                ))
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    System.err.println("⚠️ [BFF] Error al cancelar: " + e.getMessage());
                    return Mono.empty();
                });
    }
}