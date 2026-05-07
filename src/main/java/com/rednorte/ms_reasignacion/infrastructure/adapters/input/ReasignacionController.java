package com.rednorte.ms_reasignacion.infrastructure.adapters.input;

import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.infrastructure.dto.ReasignacionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reasignaciones")
@RequiredArgsConstructor
public class ReasignacionController {

    private final CrearReasignacionUseCase useCase;

    @PostMapping
    public Reasignacion crear(@RequestBody ReasignacionRequest request) {
        return useCase.ejecutar(request.getIdCitaOriginal(), request.getRutPaciente(), request.getEspecialidad());
    }

    @GetMapping
    public List<Reasignacion> listar() {
        return useCase.listarTodas();
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        useCase.borrar(id);
    }
}