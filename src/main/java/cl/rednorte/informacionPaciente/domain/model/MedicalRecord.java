package cl.rednorte.informacionPaciente.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MedicalRecord {

    private final String id;
    private final String patientId;
    private final String diagnosis;
    private final String treatment;
    private final String doctorName;
    private final LocalDate recordDate;
    private final String observations;

    public boolean isRecent() {
        return this.recordDate.isAfter(LocalDate.now().minusMonths(6));
    }
}