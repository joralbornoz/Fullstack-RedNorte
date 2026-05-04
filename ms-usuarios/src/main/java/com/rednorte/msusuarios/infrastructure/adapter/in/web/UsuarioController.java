package com.rednorte.msusuarios.infrastructure.adapter.in.web;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final GestionarUsuarioUseCase gestionarUsuarioUseCase;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = gestionarUsuarioUseCase.crearUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @GetMapping("/{rut}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable String rut) {
        Usuario usuario = gestionarUsuarioUseCase.obtenerUsuarioPorRut(rut);
        return ResponseEntity.ok(usuario);
    }
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        // El nombre debe ser IDÉNTICO al de la interfaz
        List<Usuario> usuarios = gestionarUsuarioUseCase.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{rut}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable String rut, @RequestBody Usuario usuario) {
        Usuario usuarioActualizado = gestionarUsuarioUseCase.actualizarUsuario(rut, usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{rut}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable String rut) {
        gestionarUsuarioUseCase.eliminarUsuario(rut);
        return ResponseEntity.noContent().build();
    }
}