package com.rednorte.msusuarios.application.service;

import com.rednorte.msusuarios.application.ports.in.GestionarUsuarioUseCase;
import com.rednorte.msusuarios.application.ports.out.UsuarioRepositoryPort;
import com.rednorte.msusuarios.domain.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService implements GestionarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepositoryPort;

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepositoryPort.guardar(usuario);
    }

    @Override
    public Usuario obtenerUsuarioPorRut(String rut) {
        return usuarioRepositoryPort.buscarPorRut(rut)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con RUT: " + rut));
    }

    @Override
    public Usuario actualizarUsuario(String rut, Usuario usuarioData) {
        // Buscamos el usuario existente
        Usuario usuarioExistente = obtenerUsuarioPorRut(rut);

        // Actualizamos los campos (puedes elegir cuáles permitir editar)
        usuarioExistente.setNombreCompleto(usuarioData.getNombreCompleto());
        usuarioExistente.setNumeroTelefono(usuarioData.getNumeroTelefono());
        usuarioExistente.setEmail(usuarioData.getEmail());

        // Guardamos los cambios a través del Port Out
        return usuarioRepositoryPort.guardar(usuarioExistente);
    }
    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        // Aquí llamas al repository (o al puerto de salida)
        return usuarioRepositoryPort.findAll();
    }

    @Override
    public void eliminarUsuario(String rut) {
        Usuario usuario = obtenerUsuarioPorRut(rut);
        usuarioRepositoryPort.eliminar(usuario);
    }
    @Override
    public boolean validarCredenciales(String rut, String contrasena) {
        // 1. Buscamos al usuario usando tu puerto
        return usuarioRepositoryPort.buscarPorRut(rut)
                // 2. Si lo encuentra, extrae la contraseña y la compara
                .map(usuario -> usuario.getContrasena().equals(contrasena))
                // 3. Si no encuentra al usuario, devuelve false
                .orElse(false);
    }

}