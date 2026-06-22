package com.rednorte.msusuarios.infrastructure.adapter.out.persistence.repository;

import com.rednorte.msusuarios.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;


public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, Long> {
    Optional<UsuarioJpaEntity> findByRut(String rut);
}