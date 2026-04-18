package cl.rednorte.informacionPaciente.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity // Le dice a Spring que esta clase es una tabla de la base de datos
@Table(name = "pacientes") // Nombra la tabla en la base de datos
@Data // Lombok: Genera automáticamente Getters, Setters, toString, equals y hashCode
@NoArgsConstructor // Lombok: Crea un constructor vacío (requerido por JPA)
@AllArgsConstructor // Lombok: Crea un constructor con todos los atributos
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rut; // Usamos un identificador único (RUT, DNI, etc.)

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDate fechaNacimiento;
    
    // Aquí más adelante podríamos agregar listas de atenciones médicas, citas, etc.
}