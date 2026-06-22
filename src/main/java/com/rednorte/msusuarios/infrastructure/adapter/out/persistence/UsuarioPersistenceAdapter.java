package com.rednorte.msusuarios.infrastructure.adapter.out.persistence;


import com.rednorte.msusuarios.domain.model.Usuario;
import com.rednorte.msusuarios.application.ports.out.UsuarioRepositoryPort;
import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository repository;

    @Override
    public Optional<Usuario> buscarPorRut(String rut) {
        return repository.findByRut(rut).map(this::mapearADominio);
    }
    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioJpaEntity entity = new UsuarioJpaEntity(
                null,
                usuario.getRut(),
                usuario.getEmail(),
                usuario.getContrasena(),
                usuario.getNombreCompleto(),
                usuario.getFechaNacimiento(),
                usuario.getNumeroTelefono(),
                usuario.getRol()
        );

        UsuarioJpaEntity guardado = repository.save(entity);
        return mapearADominio(guardado);
    }

    private Usuario mapearADominio(UsuarioJpaEntity entity) {
        return new Usuario(
                null,
                entity.getRut(),
                entity.getEmail(),
                entity.getContrasena(),
                entity.getNombreCompleto(),
                entity.getFechaNacimiento(),
                entity.getNumeroTelefono(),
                entity.getRol()
        );
    }
    @Override
    public List<Usuario> findAll() {
        // 1. Usamos el repository de JPA para traer todas las entidades
        // 2. Convertimos cada entidad a objeto de dominio usando tu método de mapeo
        return repository.findAll()
                .stream()
                .map(this::mapearADominio)
                .toList();
    }
    @Override
    public void eliminar(Usuario usuario) {
        // Buscamos la entidad en JPA y la borramos
        repository.findByRut(usuario.getRut())
                .ifPresent(repository::delete);
    }
}