package com.rednorte.msreasignacion.infrastructure.adapter.out.persistence;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataReasignacionRepository extends CrudRepository<ReasignacionEntity, String> {
}