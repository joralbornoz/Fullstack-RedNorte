package com.rednorte.listaespera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rednorte.listaespera.infraestructura.adaptadores.salida.RegistroEntidad;
import java.util.List; // 👈 Importante

@Repository
public interface RegistroEsperaRepository extends JpaRepository<RegistroEntidad, Long> {

    // ✅ Agregamos este método mágico de Spring Data JPA
    // Filtrará automáticamente por la columna 'rut_paciente'
    List<RegistroEntidad> findByRutPaciente(String rutPaciente);
}