package cl.rednorte.informacionPaciente.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class Appointment {

    private final String id;
    private final String patientId;
    private final String doctorName;
    private final String specialty;
    private final LocalDateTime scheduledAt;
    private final AppointmentStatus status;
    private final String location;
    private final String notes;

    public boolean isCancellable() {
        return this.status == AppointmentStatus.SCHEDULED
            && this.scheduledAt.isAfter(LocalDateTime.now().plusHours(2));
    }

    public boolean isPending() {
        return this.status == AppointmentStatus.SCHEDULED
            && this.scheduledAt.isAfter(LocalDateTime.now());
    }
}