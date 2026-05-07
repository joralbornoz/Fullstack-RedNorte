package com.rednorte.ms_reasignacion.infrastructure.adapters.output;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaReasignacionRepository extends JpaRepository<ReasignacionEntity, Long> {
}