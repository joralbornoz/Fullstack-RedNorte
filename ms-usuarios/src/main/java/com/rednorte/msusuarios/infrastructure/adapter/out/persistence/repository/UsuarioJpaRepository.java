package com.rednorte.msusuarios.infrastructure.adapter.out.persistence.repository;

import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, String> {
    Optional<UsuarioJpaEntity> findByRut(String rut);
}