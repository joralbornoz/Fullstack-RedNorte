package com.rednorte.msbff.service;

import com.rednorte.msbff.client.ExternalServiceClient;
import com.rednorte.msbff.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class BffService {

    private final ExternalServiceClient client;
    private final WebClient webClient;

    // ... tus otros métodos permanecen igual ...

    public Mono<ResponseEntity<Object>> obtenerListaEspera(String token) {
        return client.obtenerListaEsperaTodos(token);
    }

    public Flux<RegistroListaEsperaDetalleDTO> obtenerListaEsperaDetallada(String token) {
        return client.obtenerListaEsperaParaDashboard(token)
                .flatMap(registro -> {
                    String rut = (String) (registro.get("rutPaciente") != null ? registro.get("rutPaciente") : registro.get("rut"));
                    String rutSanitizado = (rut != null) ? rut.replace(".", "").trim() : "16912006-4";
                    return client.obtenerUsuarioPorRutComoMap(rutSanitizado, token)
                            .defaultIfEmpty(Map.of())
                            .map(userMap -> mapToDetalleDTO(registro, rut, userMap));
                });
    }

    public Mono<DashboardSummaryDTO> obtenerResumenDashboard(String token) {
        return client.obtenerListaEsperaParaDashboard(token)
                .collectList()
                .map(lista -> {
                    long total = lista.size();
                    long enEspera = lista.stream().filter(p -> "PENDIENTE".equals(p.get("estado"))).count();
                    return new DashboardSummaryDTO(total, enEspera, 12L, "15 min");
                });
    }

    public Mono<ResponseEntity<Object>> registrarUsuario(Object usuarioData, String token) {
        return client.registrarUsuario(usuarioData, token);
    }

    public Mono<ResponseEntity<Object>> listarUsuarios(String token) {
        return client.listarUsuarios(token);
    }

    public Mono<PacienteDetalleDTO> obtenerDetalle(Long id) {
        return client.obtenerDetallePaciente(id);
    }

    public Mono<ResponseEntity<Object>> registrarConsulta(Map<String, Object> datos, String token) {
        String rutPaciente = (String) datos.get("rut");
        return client.obtenerUsuarioPorRut(rutPaciente, token)
                .flatMap(userResponse -> client.registrarConsulta(datos, token));
    }

    public Mono<ResponseEntity<Object>> obtenerMisConsultas(String rut, String token) {
        return client.consultasPaciente(rut, token);
    }

    // ── MÉTODO CORREGIDO ──
    public Mono<Void> cancelarYReasignar(CancelacionDTO dto, String token) {
        // Aseguramos que el token tenga el prefijo "Bearer "
        String authHeader = token.startsWith("Bearer ") ? token : "Bearer " + token;

        System.out.println("🚨 [BFF] Llamando a 8082 con token: " + authHeader.substring(0, 20) + "...");

        return webClient.put()
                .uri("http://localhost:8082/api/v1/lista-espera/" + dto.getId() + "/estado")
                .header("Authorization", authHeader) // Usamos el header corregido
                .bodyValue(dto)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnError(e -> System.err.println("🚨 ERROR EN LLAMADA A 8082: " + e.getMessage()));
    }

    private RegistroListaEsperaDetalleDTO mapToDetalleDTO(Map<String, Object> registro, String rut, Map<String, Object> userMap) {
        String nombre = "Usuario no encontrado";
        if (userMap != null && !userMap.isEmpty()) {
            Map actualUser = userMap.containsKey("data") && userMap.get("data") instanceof Map ? (Map) userMap.get("data") : userMap;
            nombre = (String) actualUser.getOrDefault("nombreCompleto", "Usuario sin nombre");
        }
        return new RegistroListaEsperaDetalleDTO(
                Long.valueOf(registro.get("id").toString()), rut, nombre, "N/A",
                (String) registro.get("especialidadDestino"), (String) registro.get("patologiaSospecha"),
                (String) registro.get("prioridad"), (String) registro.get("estado"), (String) registro.get("fechaIngreso")
        );
    }
}