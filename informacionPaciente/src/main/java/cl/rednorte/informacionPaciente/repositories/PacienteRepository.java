package cl.rednorte.informacionPaciente.repositories;

import cl.rednorte.informacionPaciente.models.Paciente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // ¡La magia de Spring Data!
    Optional<Paciente> findByRut(String rut);

    Optional<Paciente> findByEmail(String email);

} // <-- ¡Faltaba esta llave para cerrar la interfaz!