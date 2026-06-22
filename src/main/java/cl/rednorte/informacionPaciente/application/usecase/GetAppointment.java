package cl.rednorte.informacionPaciente.application.usecase;

import cl.rednorte.informacionPaciente.domain.exception.AppointmentNotFoundException;
import cl.rednorte.informacionPaciente.domain.model.Appointment;
import cl.rednorte.informacionPaciente.domain.port.in.GetAppointmentUseCase;
import cl.rednorte.informacionPaciente.domain.port.out.AppointmentRepository;
import cl.rednorte.informacionPaciente.domain.port.out.EventPublishertPort;
import cl.rednorte.informacionPaciente.domain.model.AppointmentStatus;
import cl.rednorte.informacionPaciente.domain.port.out.PacienteRepositoryPort;
import cl.rednorte.informacionPaciente.domain.port.in.GetPatienteInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAppointment implements GetAppointmentUseCase {

    private final AppointmentRepository appointmentRepositoryPort;
    private final EventPublishertPort eventPublisherPort;

    @Override
    public List<Appointment> getByPatientId(String patientId) {
        List<Appointment> appointments = appointmentRepositoryPort.findByPatientId(patientId);

        // Publica evento cuando un paciente consulta sus citas
        eventPublisherPort.publish(
            "patient-portal.appointment.queried",
            patientId,
            new AppointmentQueriedEvent(patientId, appointments.size())
        );

        return appointments;
    }

    @Override
    public Appointment getById(String appointmentId) {
        return appointmentRepositoryPort.findById(appointmentId)
            .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
    }

    @Override
    public List<Appointment> getPendingByPatientId(String patientId) {
        return appointmentRepositoryPort.findByPatientIdAndStatus(
            patientId,
            AppointmentStatus.SCHEDULED
        );
    }

    // Evento interno (record de Java, limpio y sin dependencias)
    public record AppointmentQueriedEvent(String patientId, int totalAppointments) {}
}