package cl.rednorte.informacionPaciente.domain.exception;

public class PatientNotFoundException extends RuntimeException {
    public PatientNotFoundException(String identifier) {
        super("Paciente no encontrado: " + identifier);
    }
}