package com.rednorte.msbff.infrastructure.adapter.in.web;

import com.rednorte.msbff.application.port.in.ObtenerDetallePacienteUseCase;
import com.rednorte.msbff.domain.model.PacienteDetalleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono; // <--- AGREGAR ESTA IMPORTACIÓN

@RestController
@RequestMapping("/api/v1/bff")
@RequiredArgsConstructor
public class BffController {

    private final ObtenerDetallePacienteUseCase useCase;

    @GetMapping("/detalle-paciente/{id}")
    public Mono<PacienteDetalleDTO> getDetalle(@PathVariable String id) {
        // Ahora los tipos coinciden: el UseCase devuelve Mono y el Controller entrega Mono
        return useCase.ejecutar(id);
    }
}