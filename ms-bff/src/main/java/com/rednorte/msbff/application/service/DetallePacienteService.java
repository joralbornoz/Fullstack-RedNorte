package com.rednorte.msbff.application.service;

import com.rednorte.msbff.application.port.in.ObtenerDetallePacienteUseCase;
import com.rednorte.msbff.application.port.out.ExternalServicePort; // Importamos el Puerto
import com.rednorte.msbff.domain.model.PacienteDetalleDTO;
import com.rednorte.msbff.domain.model.ListaEsperaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class DetallePacienteService implements ObtenerDetallePacienteUseCase {

    // Inyectamos el PUERTO, no el adaptador
    private final ExternalServicePort externalServicePort;

    @Override
    public Mono<PacienteDetalleDTO> ejecutar(String idInterconsulta) {
        // 1. Llamamos al microservicio de lista de espera (8002)
        return externalServicePort.obtenerInterconsultaPorId(idInterconsulta)
                .flatMap(interconsulta -> {

                    // 2. Con el RUT obtenido, llamamos al microservicio de usuarios (8001)
                    return externalServicePort.obtenerUsuarioPorRut(interconsulta.getRutPaciente())
                            .map(usuario -> {

                                // 3. Unimos los datos en el DTO final
                                return PacienteDetalleDTO.builder()
                                        .idInterconsulta(idInterconsulta)
                                        .rut(usuario.getRut())
                                        .nombreCompleto(usuario.getNombreCompleto())
                                        .numeroTelefono(usuario.getNumeroTelefono())
                                        .email(usuario.getEmail())
                                        .especialidad(interconsulta.getEspecialidadDestino())
                                        .prioridad(interconsulta.getPrioridad())
                                        .estado(interconsulta.getEstado())
                                        .build();
                            });
                });
    }
}