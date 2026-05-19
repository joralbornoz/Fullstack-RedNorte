package com.rednorte.ms_reasignacion.infrastructure.adapters.input;

import com.rednorte.ms_reasignacion.application.ports.in.CrearReasignacionUseCase;
import com.rednorte.ms_reasignacion.application.ports.in.ProcesarCitaCanceladaUseCase;
import com.rednorte.ms_reasignacion.domain.model.Reasignacion;
import com.rednorte.ms_reasignacion.infrastructure.dto.ReasignacionRequest;
import com.rednorte.ms_reasignacion.infrastructure.dto.CitaCanceladaRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reasignaciones")
@RequiredArgsConstructor
public class ReasignacionController {

    private final CrearReasignacionUseCase useCase;
    private final ProcesarCitaCanceladaUseCase procesarCancelacionUseCase;

    @PostMapping("/cita-cancelada")
    public Reasignacion procesarCancelacion(@RequestBody CitaCanceladaRequest request) {
        return procesarCancelacionUseCase.procesarCancelacion(
                request.getIdCitaOriginal(),
                request.getRutPaciente(),
                request.getEspecialidad(),
                request.getMotivoCancelacion(),
                request.getMedicoOriginal(),
                request.getPrioridadReasignacion(),
                request.getRequiereExamenesPrevios(),
                request.getPreferenciaHorario()
        );
    }

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

    @GetMapping("/{id}")
    public Reasignacion buscarPorId(@PathVariable Long id) {
        return useCase.obtenerPorId(id);
    }

    @PutMapping("/{id}/estado")
    public Reasignacion actualizarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        return useCase.actualizarEstado(id, nuevoEstado);
    }
}