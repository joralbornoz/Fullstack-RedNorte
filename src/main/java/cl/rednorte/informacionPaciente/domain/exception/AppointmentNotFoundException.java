package cl.rednorte.informacionPaciente.domain.exception;

public class AppointmentNotFoundException extends RuntimeException {
    public AppointmentNotFoundException(String id) {
        super("Cita no encontrada: " + id);
    }
}