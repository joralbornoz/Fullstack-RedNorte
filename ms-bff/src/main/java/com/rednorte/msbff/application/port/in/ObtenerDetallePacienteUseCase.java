package com.rednorte.msbff.application.port.in;

import com.rednorte.msbff.domain.model.PacienteDetalleDTO;
import reactor.core.publisher.Mono; // <--- IMPORTANTE

public interface ObtenerDetallePacienteUseCase {
    Mono<PacienteDetalleDTO> ejecutar(String idInterconsulta); // Cambiado a Mono
}