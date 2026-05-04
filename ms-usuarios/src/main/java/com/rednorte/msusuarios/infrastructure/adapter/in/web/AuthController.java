package com.rednorte.msusuarios.infrastructure.adapter.in.web;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.application.ports.out.TokenGeneratorPort;
import com.rednorte.msusuarios.domain.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios/auth")
public class AuthController {

    private final GestionarUsuarioUseCase gestionarUsuarioUseCase;
    private final TokenGeneratorPort tokenGeneratorPort;

    public AuthController(GestionarUsuarioUseCase gestionarUsuarioUseCase, TokenGeneratorPort tokenGeneratorPort) {
        this.gestionarUsuarioUseCase = gestionarUsuarioUseCase;
        this.tokenGeneratorPort = tokenGeneratorPort;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Validar credenciales
        boolean esValido = gestionarUsuarioUseCase.validarCredenciales(request.getRut(), request.getContrasena());

        if (esValido) {
            // 2. Obtener el usuario completo para sacar su ROL
            Usuario usuario = gestionarUsuarioUseCase.obtenerUsuarioPorRut(request.getRut());

            // 3. Pasar AMBOS argumentos al generador (RUT y ROL)
            // Usamos .name() si tu rol es un Enum, o simplemente el String si es un String
            String token = tokenGeneratorPort.generateToken(usuario.getRut(), usuario.getRol().name());

            return ResponseEntity.ok(new LoginResponse(token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }

    // --- DTOs para la comunicación web ---
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String rut;
        private String contrasena;
    }

    @Data
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
    }
}