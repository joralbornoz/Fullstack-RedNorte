package com.rednorte.listaespera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rednorte.listaespera.infraestructura.adaptadores.salida.RegistroEntidad;

@Repository
public interface RegistroEsperaRepository extends JpaRepository<RegistroEntidad, Long> {
}