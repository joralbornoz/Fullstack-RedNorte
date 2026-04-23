package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MySqlRegistroRepository extends JpaRepository<RegistroEntidad, Long> {
  
}