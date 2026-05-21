package com.rednorte.msbff.controller;

import com.rednorte.msbff.dto.CancelacionDTO;
import com.rednorte.msbff.dto.DashboardSummaryDTO;
import com.rednorte.msbff.dto.PacienteDetalleDTO;
import com.rednorte.msbff.dto.RegistroListaEsperaDetalleDTO;
import com.rednorte.msbff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/api/v1/bff")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;

    @GetMapping("/lista-espera/todos")
    public Mono<ResponseEntity<Object>> obtenerListaEspera(
            @RequestHeader(value = "Authorization", required = false) String token) {
        return bffService.obtenerListaEspera(token);
    }

    @GetMapping("/resumen-dashboard")
    public Mono<DashboardSummaryDTO> obtenerResumenDashboard(
            @RequestHeader(value = "Authorization", required = false) String token) {
        return bffService.obtenerResumenDashboard(token);
    }

    @PostMapping("/lista-espera/registrar")
    public Mono<ResponseEntity<Object>> registrarConsulta(
            @RequestBody java.util.Map<String, Object> datos,
            @RequestHeader(value = "Authorization", required = false) String token) {
        return bffService.registrarConsulta(datos, token);
    }

    @PostMapping("/usuarios")
    public Mono<ResponseEntity<Object>> registrar(
            @RequestBody Object usuarioData,
            @RequestHeader("Authorization") String token) {
        System.out.println("➕ [BFF CONTROLLER] Canalizando registro de nuevo usuario");
        return bffService.registrarUsuario(usuarioData, token);
    }
    @GetMapping("/usuarios")
    public Mono<ResponseEntity<Object>> listarUsuarios(
            @RequestHeader(value = "Authorization") String token) {
        return bffService.listarUsuarios(token);
    }
    @GetMapping("/paciente/consultas/{rut}")
// ✅ CORREGIDO: Cambiado de Flux a Mono<ResponseEntity<Object>> para calzar perfectamente con BffService
    public Mono<ResponseEntity<Object>> obtenerMisConsultas(
            @PathVariable String rut,
            @RequestHeader(value = "Authorization", required = false) String token) {

        System.out.println("🏥 [BFF Controller] Token validado. Procesando solicitud unificada mediante Mono...");
        return bffService.obtenerMisConsultas(rut, token); // 🚀 Invoca el método consolidado sin desajustes
    }

    @GetMapping("/detalle-paciente/{id}")
    public Mono<PacienteDetalleDTO> getDetalle(@PathVariable Long id) {
        return bffService.obtenerDetalle(id);
    }

    @GetMapping("/lista-espera/detallada")
    public Flux<RegistroListaEsperaDetalleDTO> obtenerListaDetallada(
            @RequestHeader(value = "Authorization", required = false) String token) {
        return bffService.obtenerListaEsperaDetallada(token);
    }

    // ── 🔥 NUEVO ENDPOINT: Orquestación unificada exigida por el profesor ──
    @PostMapping("/lista-espera/cancelar")
    public Mono<ResponseEntity<Void>> cancelarYReasignar(
            @RequestBody CancelacionDTO dto,
            @RequestHeader("Authorization") String token) {
        System.out.println("🚨 [BFF] Recibida orden de cancelación y reasignación para interconsulta ID: " + dto.getId());

        // Delegamos la lógica de llamadas WebClient al servicio del BFF para mantener las capas limpias
        return bffService.cancelarYReasignar(dto, token)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }
}