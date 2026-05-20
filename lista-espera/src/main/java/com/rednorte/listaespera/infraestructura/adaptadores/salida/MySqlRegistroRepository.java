package com.rednorte.listaespera.infraestructura.adaptadores.salida;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 👈 Agregado
import org.springframework.data.repository.query.Param; // 👈 Agregado para los parámetros de la consulta
import org.springframework.data.domain.Pageable; // 👈 Agregado para limitar los resultados
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MySqlRegistroRepository extends JpaRepository<RegistroEntidad, Long> {

    // Esta línea permite buscar todas las interconsultas de un paciente específico
    List<RegistroEntidad> findByRutPaciente(String rutPaciente);

    /**
     * ✅ Busca los candidatos con mayor prioridad para una especialidad.
     * Se ordena por prioridad (DESC) y luego por antigüedad en la lista (fechaIngreso ASC).
     */
    @Query("SELECT r FROM RegistroEntidad r " +
            "WHERE r.especialidadDestino = :esp " +
            "AND r.estado = 'PENDIENTE' " +
            "AND r.prioridad = 'ALTA' " + // <--- Filtro estricto por prioridad
            "ORDER BY r.fechaIngreso ASC") // <--- ASC ordena de más antigua a más reciente
    List<RegistroEntidad> buscarCandidatoTop(@Param("esp") String esp, Pageable pageable);;

}