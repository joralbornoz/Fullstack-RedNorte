package cl.rednorte.informacionPaciente.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class Paciente {

    private final String id;
    private final String rut;
    private final String fullName;
    private final String email;
    private final String phone;
    private final LocalDate birthDate;
    private final String healthInsurance; // FONASA, ISAPRE, etc.

    public int calculateAge() {
        return LocalDate.now().getYear() - this.birthDate.getYear();
    }

    public boolean hasEmail() {
        return this.email != null && !this.email.isBlank();
    }
}