package com.rednorte.listaespera.infraestructura.adaptadores.entrada;

import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.CancelarRequest;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroCompletoDTO;
import lombok.Data; // 🔥 Importamos para el DTO interno de cancelación
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lista-espera")
@RequiredArgsConstructor
public class RegistroController {

    private final GestionListaEsperaService service;

    /**
     * Endpoint para obtener el siguiente candidato de la lista
     */
    @GetMapping("/siguiente")
    public ResponseEntity<RegistroCompletoDTO> obtenerSiguiente(@RequestParam String especialidad) {
        return service.obtenerSiguiente(especialidad)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/registrar")
    public Mono<ResponseEntity<RegistroCompletoDTO>> crearConsulta(
            @RequestBody RegistroCompletoDTO dto,
            @RequestHeader("Authorization") String token) {

        return service.registrarNuevo(
                dto.rutPaciente(),
                dto.especialidadDestino(),
                dto.patologiaSospecha(),
                dto.prioridad(),
                token
        ).map(ResponseEntity::ok);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<RegistroCompletoDTO>> listarTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroEspera> obtenerPaciente(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{rut}")
    public ResponseEntity<List<RegistroCompletoDTO>> obtenerPorPaciente(@PathVariable String rut) {
        List<RegistroCompletoDTO> consultas = service.obtenerConsultasPorPaciente(rut);
        return ResponseEntity.ok(consultas);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<RegistroEspera> actualizar(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String nuevoEstado = request.get("estado");
        try {
            RegistroEspera actualizado = service.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarRegistro(id);
        return ResponseEntity.noContent().build();
    }

    // 🔥 NUEVO ENDPOINT: Unificado dentro de tu controlador principal
    @PostMapping("/cancelar")
    public ResponseEntity<Void> cancelarCita(@RequestBody CancelarRequest request) {
        // 🔥 Llamamos directo a tu service existente con los métodos tradicionales
        service.cancelarCita(
                request.getIdInterconsulta(),
                request.getMotivo(),
                request.getCanceladoPor()
        );
        return ResponseEntity.ok().build();
    }
}

