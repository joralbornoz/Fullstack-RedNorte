package com.rednorte.msusuarios.infrastructure.adapter.in.web;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.domain.model.Usuario;
import com.rednorte.msusuarios.infrastructure.adapter.in.web.dto.LoginRequest;  // 👈 Importamos tus records
import com.rednorte.msusuarios.infrastructure.adapter.in.web.dto.LoginResponse; // 👈 Importamos tus records
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GestionarUsuarioUseCase gestionarUsuarioUseCase;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("👤 [MS-Usuarios] Validando credenciales para RUT: " + request.rut());

        // 1. Validar usando la sintaxis de record (con paréntesis)
        boolean esValido = gestionarUsuarioUseCase.validarCredenciales(request.rut(), request.contrasena());

        if (esValido) {
            Usuario usuario = gestionarUsuarioUseCase.obtenerUsuarioPorRut(request.rut());

            // 2. Retornamos tu LoginResponse limpio (solo RUT y ROL, sin token)
            return ResponseEntity.ok(new LoginResponse(usuario.getRut(), usuario.getRol().name()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("RUT o contraseña incorrectos");
        }
    }
}