package cl.rednorte.informacionPaciente.domain.port.in;

import cl.rednorte.informacionPaciente.domain.model.Paciente;

public interface GetPatienteInfo {
    Paciente getByRut(String rut);
    Paciente getById(String patientId);
}