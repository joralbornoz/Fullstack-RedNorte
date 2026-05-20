package com.rednorte.msusuarios.application.service;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.application.ports.out.UsuarioRepositoryPort;
import com.rednorte.msusuarios.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // Importación clave
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements GestionarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;
    private final PasswordEncoder passwordEncoder; // Inyección del codificador

    @Override
    public boolean validarCredenciales(String rut, String contrasena) {
        return usuarioRepositoryPort.buscarPorRut(rut)
                .map(usuario -> {
                    // Aquí ahora comparará "123456" con "123456" directamente
                    return passwordEncoder.matches(contrasena, usuario.getContrasena());
                })
                .orElse(false);
    }

    @Override
    public Usuario obtenerUsuarioPorRut(String rut) {
        return usuarioRepositoryPort.buscarPorRut(rut)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con RUT: " + rut));
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        // Encriptar la clave antes de guardar para que no sea texto plano
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepositoryPort.guardar(usuario);
    }

    // --- Otros métodos del UseCase ---
    @Override
    public Usuario actualizarUsuario(String rut, Usuario usuarioData) {
        Usuario usuarioExistente = obtenerUsuarioPorRut(rut);
        usuarioExistente.setNombreCompleto(usuarioData.getNombreCompleto());
        usuarioExistente.setNumeroTelefono(usuarioData.getNumeroTelefono());
        usuarioExistente.setEmail(usuarioData.getEmail());
        return usuarioRepositoryPort.guardar(usuarioExistente);
    }

    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepositoryPort.findAll();
    }

    @Override
    public void eliminarUsuario(String rut) {
        Usuario usuario = obtenerUsuarioPorRut(rut);
        usuarioRepositoryPort.eliminar(usuario);
    }
}