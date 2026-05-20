package com.rednorte.msbff.client;

import com.rednorte.msbff.dto.PacienteDetalleDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Map;

@Component
public class ExternalServiceClient {

    private final WebClient webClient;

    public ExternalServiceClient(WebClient.Builder webClientBuilder) {
        // ✅ ELIMINADO: No usamos una baseUrl global porque cada servicio tiene su puerto
        this.webClient = webClientBuilder.build();
    }

    // 🔥 IMPORTANTE: Ajusta los puertos (8001, 8002, 8003) según lo que definieron tus compañeros
    // 🔥 CORRECCIÓN: Ajustamos a 8082 según lo que confirmó netstat
    private final String URL_USUARIOS = "http://localhost:8001/api/v1"; // Verifica que este también sea el correcto
    private final String URL_LISTA_ESPERA = "http://localhost:8082/api/v1"; // ¡CORREGIDO!
    private final String URL_REASIGNACION = "http://localhost:8083/api/v1"; // ¡CORREGIDO!// Ajusta el puerto aquí

    public Mono<ResponseEntity<Object>> obtenerListaEsperaTodos(String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/todos")
                .header("Authorization", token != null ? token : "")
                .exchangeToMono(response -> response.toEntity(Object.class));
    }

    public Flux<Map> obtenerListaEsperaParaDashboard(String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/todos")
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .bodyToFlux(Map.class);
    }

    public Mono<ResponseEntity<Object>> registrarConsulta(Object datos, String token) {
        return webClient.post()
                .uri(URL_LISTA_ESPERA + "/lista-espera/registrar")
                .header("Authorization", token != null ? token : "")
                .bodyValue(datos)
                .exchangeToMono(response -> response.toEntity(Object.class));
    }

    public Mono<ResponseEntity<Object>> registrarUsuario(Object usuarioData, String token) {
        return webClient.post()
                .uri(URL_USUARIOS + "/usuarios")
                .header("Authorization", token != null ? token : "")
                .bodyValue(usuarioData)
                .exchangeToMono(response -> response.toEntity(Object.class));
    }

    public Mono<ResponseEntity<Object>> listarUsuarios(String token) {
        return webClient.get()
                .uri(URL_USUARIOS + "/usuarios")
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class);
    }

    public Mono<ResponseEntity<Object>> consultasPaciente(String rut, String token) {
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/lista-espera/paciente/" + rut)
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class);
    }

    public Mono<PacienteDetalleDTO> obtenerDetallePaciente(Long id) {
        // Ajusta este puerto si es necesario
        return webClient.get()
                .uri(URL_LISTA_ESPERA + "/detalle-paciente-backend-mock/" + id)
                .retrieve()
                .bodyToMono(PacienteDetalleDTO.class);
    }

    public Mono<ResponseEntity<Object>> obtenerUsuarioPorRut(String rut, String token) {
        return webClient.get()
                .uri(URL_USUARIOS + "/usuarios/" + rut)
                .header("Authorization", token != null ? token : "")
                .retrieve()
                .toEntity(Object.class);
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
                .uri(URL_LISTA_ESPERA + "/lista-espera/" + id + "/estado")
                .header("Authorization", token != null ? token : "")
                .bodyValue(Map.of("estado", estado))
                .retrieve()
                .bodyToMono(Void.class);
    }

    public Mono<Void> dispararReasignacion(Map<String, Object> payload, String token) {
        return this.webClient.post()
                .uri(URL_REASIGNACION + "/reasignar/ejecutar")
                .header("Authorization", token != null ? token : "")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Void.class);
    }
    public Mono<PacienteDetalleDTO> consultarDatosUnificados(String rut) {
        // Asegúrate de usar la URL absoluta al puerto 8002 (Lista Espera)
        return webClient.get()
                .uri("http://localhost:8002/api/v1/lista-espera/paciente/" + rut)
                .retrieve()
                .bodyToMono(PacienteDetalleDTO.class);
    }
}