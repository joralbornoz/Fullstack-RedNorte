package com.rednorte.listaespera.infraestructura.adaptadores.entrada;

import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
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
    public RegistroEspera registrarPaciente(@RequestBody Map<String, String> request) {
        String rut = request.get("rutPaciente");
        String especialidad = request.get("especialidadDestino");
        String patologia = request.get("patologiaSospecha");
        
        return service.registrarNuevoPaciente(rut, especialidad, patologia);
    }

    
    @GetMapping("/todos")
    public List<RegistroEspera> listar() {
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroEspera> obtenerPaciente(@PathVariable Long id) {
    return service.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

    
    @PutMapping("/actualizar/{id}")
    public RegistroEspera actualizar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.actualizarEstado(id, body.get("estado"));
    }

   
    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminarRegistro(id);
    }

    
    @PostMapping("/cancelar/{id}")
    public void cancelar(@PathVariable Long id) {
        service.cancelarCita(id);
    }
}