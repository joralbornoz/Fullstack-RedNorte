package cl.rednorte.informacionPaciente.application.usecase;

import cl.rednorte.informacionPaciente.domain.exception.PatientNotFoundException;
import cl.rednorte.informacionPaciente.domain.model.MedicalRecord;
import cl.rednorte.informacionPaciente.domain.model.Paciente;
import cl.rednorte.informacionPaciente.domain.port.in.GetMedicalRecordUseCase;
import cl.rednorte.informacionPaciente.domain.port.in.GetPatienteInfo;
import cl.rednorte.informacionPaciente.domain.port.out.PacienteRepositoryPort;
import cl.rednorte.informacionPaciente.domain.port.out.EventPublishertPort;
import cl.rednorte.informacionPaciente.domain.port.out.MedicalRecordRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetMedicalRecordUseCaseImpl implements GetMedicalRecordUseCase {

    private final MedicalRecordRepositoryPort medicalRecordRepositoryPort;

    @Override
    public List<MedicalRecord> getByPatientId(String patientId) {
        List<MedicalRecord> records = medicalRecordRepositoryPort.findByPatientId(patientId);

        if (records.isEmpty()) {
            throw new PatientNotFoundException(patientId);
        }

        return records;
    }

    @Override
    public MedicalRecord getById(String recordId) {
        return medicalRecordRepositoryPort.findById(recordId)
            .orElseThrow(() -> new PatientNotFoundException(recordId));
    }
}