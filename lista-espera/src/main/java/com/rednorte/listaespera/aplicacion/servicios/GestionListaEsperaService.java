package com.rednorte.listaespera.aplicacion.servicios;

import com.rednorte.listaespera.dominio.modelo.RegistroEspera;
import com.rednorte.listaespera.dominio.puertos.out.EventoCancelacionPort; // ✅ Importado correctamente
import com.rednorte.listaespera.dominio.puertos.out.RegistroRepositoryPort;
import com.rednorte.listaespera.infraestructura.adaptadores.entrada.dto.RegistroCompletoDTO;
import com.rednorte.listaespera.dominio.factory.AtencionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GestionListaEsperaService {

    private final RegistroRepositoryPort repositoryPort;
    private final EventoCancelacionPort eventoCancelacionPort; // 🔥 CORREGIDO: Inyectamos el puerto para que compile el método cancelar
    private final WebClient.Builder webClientBuilder;

    /**
     * ✅ Registra una nueva consulta incluyendo la fecha de ingreso actual.
     */
    public Mono<RegistroCompletoDTO> registrarNuevo(String rut, String esp, String pato, String prioridad, String token) {
        System.out.println("📋 [MS-Lista-Espera] Guardando consulta con fecha en la DB para: " + rut);

        try {
            RegistroEspera nuevo = AtencionFactory.crearAtencion(rut, esp, pato, prioridad);
            nuevo.setFechaIngreso(java.time.LocalDate.now()); // Seteamos la fecha actual

            RegistroEspera guardado = repositoryPort.guardar(nuevo);

            return Mono.just(new RegistroCompletoDTO(
                    guardado.getId(),
                    guardado.getRutPaciente(),
                    guardado.getEspecialidadDestino(),
                    guardado.getPatologiaSospecha(),
                    guardado.getPrioridad(),
                    guardado.getEstado(),
                    guardado.getFechaIngreso() // ✅ Enviamos la fecha real
            ));
        } catch (Exception e) {
            return Mono.error(new RuntimeException("Error interno: " + e.getMessage()));
        }
    }

    /**
     * 🔄 Devuelve RegistroCompletoDTO con la fecha para el Dashboard
     */
    public List<RegistroCompletoDTO> obtenerTodos() {
        System.out.println("🔍 [MS-Lista-Espera] Obteniendo todos los registros con sus fechas para el BFF");
        return repositoryPort.buscarTodos().stream()
                .map(registro -> new RegistroCompletoDTO(
                        registro.getId(),
                        registro.getRutPaciente(),
                        registro.getEspecialidadDestino(),
                        registro.getPatologiaSospecha(),
                        registro.getPrioridad(),
                        registro.getEstado(),
                        registro.getFechaIngreso() // ✅ Enchufamos la fecha para el Dashboard
                ))
                .collect(Collectors.toList());
    }

    /**
     * ✅ Obtiene un registro por su ID único
     */
    public Optional<RegistroEspera> obtenerPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    /**
     * ✅ Actualiza el estado administrativo de un registro
     */
    public RegistroEspera actualizarEstado(Long id, String nuevoEstado) {
        return repositoryPort.buscarPorId(id).map(registro -> {
            registro.setEstado(nuevoEstado);
            return repositoryPort.guardar(registro);
        }).orElseThrow(() -> new RuntimeException("No se encontró el registro con ID: " + id));
    }

    /**
     * ✅ Elimina físicamente un registro por su ID
     */
    public void eliminarRegistro(Long id) {
        repositoryPort.eliminar(id);
    }

    /**
     * 🔄 Devuelve las consultas filtradas por el RUT del paciente usando RegistroCompletoDTO
     */
    public List<RegistroCompletoDTO> obtenerConsultasPorPaciente(String rut) {
        return repositoryPort.buscarPorRut(rut).stream()
                .map(reg -> new RegistroCompletoDTO(
                        reg.getId(),
                        reg.getRutPaciente(),
                        reg.getEspecialidadDestino(),
                        reg.getPatologiaSospecha(),
                        reg.getPrioridad(),
                        reg.getEstado(),
                        reg.getFechaIngreso() // ✅ Fecha incluida para la vista del paciente
                ))
                .collect(Collectors.toList());
    }

    /**
     * 🔥 LÓGICA CORE DE CANCELACIÓN Y EMISIÓN DE EVENTO
     */
    @Transactional
    public void cancelarCita(Long id, String motivo, String canceladoPor) {
        repositoryPort.buscarPorId(id).ifPresent(registro -> {
            // 1. Aplicamos los cambios de estado y auditoría en el modelo de dominio
            registro.setEstado("CANCELADO");
            registro.setMotivoCancelacion(motivo);
            registro.setCanceladoPor(canceladoPor);

            // 2. Persistimos los cambios en la base de datos (MySQL)
            repositoryPort.guardar(registro);

            // 3. Notificamos de forma asíncrona a ms-reasignacion (Puerto 8083) usando el puerto inyectado
            eventoCancelacionPort.publicarEvento(registro);
        });
    }

    /**
     * 🔄 Obtiene el siguiente candidato ideal ordenado según lógica de prioridad y antigüedad
     */
    public Optional<RegistroCompletoDTO> obtenerSiguiente(String especialidad) {
        return repositoryPort.obtenerSiguiente(especialidad)
                .map(registro -> new RegistroCompletoDTO(
                        registro.getId(),
                        registro.getRutPaciente(),
                        registro.getEspecialidadDestino(),
                        registro.getPatologiaSospecha(),
                        registro.getPrioridad(),
                        registro.getEstado(),
                        registro.getFechaIngreso()
                ));
    }
}