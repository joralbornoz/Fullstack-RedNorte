package com.rednorte.msusuarios.application.ports.in;

import com.rednorte.msusuarios.domain.model.Usuario;
import java.util.List;

public interface GestionarUsuarioUseCase {
    Usuario crearUsuario(Usuario usuario);
    Usuario obtenerUsuarioPorRut(String rut);
    Usuario actualizarUsuario(String rut, Usuario usuario);
    List<Usuario> obtenerTodosLosUsuarios();
    void eliminarUsuario(String rut);
    boolean validarCredenciales(String rut, String contrasena);
}