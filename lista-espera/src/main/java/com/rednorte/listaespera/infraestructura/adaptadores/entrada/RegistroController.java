package com.rednorte.listaespera.infraestructura.adaptadores.entrada;

import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroDTO;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lista-espera")
@RequiredArgsConstructor
public class RegistroController {

    private final GestionListaEsperaService service; 

    @PostMapping("/registrar")
    public ResponseEntity<RegistroDTO> registrar(@RequestBody Map<String, String> request) {
    RegistroDTO nuevo = service.registrarNuevo(
        request.get("rutPaciente"),
        request.get("especialidadDestino"),
        request.get("patologiaSospecha"),
        request.get("prioridad")
    );
    return ResponseEntity.ok(nuevo);
}

    @GetMapping("/todos")
    public ResponseEntity<List<RegistroDTO>> listarTodos() {
    return ResponseEntity.ok(service.obtenerTodos());
}

    @GetMapping("/{id}")
    public ResponseEntity<RegistroEspera> obtenerPaciente(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<RegistroEspera> actualizar(@PathVariable Long id, @RequestBody Map<String, String> request) {
        // Extraemos el string "estado" del JSON que envíes por Postman
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

    @PostMapping("/cancelar/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        service.cancelarCita(id);
        return ResponseEntity.ok().build();
    }
}  
