package cl.rednorte.informacionPaciente.application.usecase;

import cl.rednorte.informacionPaciente.domain.exception.PatientNotFoundException;
import cl.rednorte.informacionPaciente.domain.model.Paciente;
import cl.rednorte.informacionPaciente.domain.port.in.GetPatienteInfo;
import cl.rednorte.informacionPaciente.domain.port.out.PacienteRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GetPatientInfoUseCaseImpl implements GetPatienteInfo {

    private final PacienteRepositoryPort pacienteRepositoryPort;

    @Override
    public Paciente getByRut(String rut) {
        return pacienteRepositoryPort.findByRut(rut)
            .orElseThrow(() -> new PatientNotFoundException(rut));
    }

    public Paciente getById(String patientId) {
        return pacienteRepositoryPort.findById(patientId)
            .orElseThrow(() -> new PatientNotFoundException(patientId));
    }
}