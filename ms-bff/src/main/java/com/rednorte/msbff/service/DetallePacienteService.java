package com.rednorte.msbff.service;

import com.rednorte.msbff.client.ExternalServiceClient;
import com.rednorte.msbff.dto.PacienteDetalleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class DetallePacienteService {

    private final ExternalServiceClient externalServiceClient;

    public Mono<PacienteDetalleDTO> obtenerDetalleCompleto(String rut) {
        return externalServiceClient.consultarDatosUnificados(rut)
                // 🛡️ Logueo importante: si falla, sabremos qué microservicio fue
                .doOnError(e -> System.err.println("❌ [BFF] Error al orquestar detalle de paciente: " + e.getMessage()))
                // 🛡️ Recuperación: si falla, devolvemos un Mono vacío o un objeto por defecto
                .onErrorResume(e -> {
                    // Aquí podrías loguear o lanzar una excepción personalizada si el front necesita saber qué pasó
                    return Mono.empty();
                });
    }
}