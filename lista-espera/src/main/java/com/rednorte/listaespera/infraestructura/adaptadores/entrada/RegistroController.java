package com.rednorte.listaespera.infraestructura.adaptadores.entrada;

import com.rednorte.listaespera.aplicacion.servicios.GestionListaEsperaService;
import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/lista-espera")
@RequiredArgsConstructor
public class RegistroController {

    private final GestionListaEsperaService service; 

    @PostMapping("/registrar")
    // Usamos @RequestBody para que puedas mandar un JSON desde Postman
    public RegistroEspera registrarPaciente(@RequestBody Map<String, String> request) {
        
        // Extraemos los datos del JSON
        String tipo = request.get("tipo");
        String nombre = request.get("nombre");
        String rut = request.get("rut");
        
        return service.registrarNuevoPaciente(tipo, nombre, rut);
    }
}