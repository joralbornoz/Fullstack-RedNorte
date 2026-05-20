package com.rednorte.msusuarios.application.ports.out;

import com.rednorte.msusuarios.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Optional<Usuario> buscarPorRut(String rut);
    Usuario guardar(Usuario usuario);
    void eliminar(Usuario usuario);
    List<Usuario> findAll();
}