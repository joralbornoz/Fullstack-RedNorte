package com.rednorte.msreasignacion.infrastructure.adapter.in.web;

import com.rednorte.msreasignacion.application.port.in.ReasignarPacienteUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/reasignar")
@RequiredArgsConstructor
public class ReasignacionController {

    private final ReasignarPacienteUseCase useCase;

    @PostMapping("/ejecutar")
    public Mono<Void> ejecutarReasignacion(@RequestBody ReasignacionRequest request) {
        return useCase.reasignarCupo(
                String.valueOf(request.getId()),
                request.getEspecialidadDestino(),
                request.getMotivo()
        );
    }
}

